import { HttpError } from "@/utils/httpError.js";
import { Category } from "../models/category.model.js";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validations/category.schema.js";
import {
  SpecsSchema,
  UpdateSpecsSchemaPayload,
  PartialSpecFieldSchema,
  SpecFieldSchema,
  CategoryWithSubs,
  CategoryStatus,
} from "../types/index.js";

class CategoryService {
  private async cascadeStatusToChildren(
    parentId: string,
    status: CategoryStatus,
  ) {
    const children = await Category.findAll({ where: { parentId } });
    for (const child of children) {
      if (child.status === CategoryStatus.ACTIVE) {
        await child.update({ status });
        await this.cascadeStatusToChildren(child.id, status);
      }
    }
  }

  async createCategory(data: CreateCategoryInput) {
    const existingCategory = await Category.findOne({
      where: { slug: data.slug },
    });
    if (existingCategory)
      throw HttpError.conflict("این اسلاگ قبلا استفاده شده است");

    if (data.parentId) {
      const parent = await Category.findByPk(data.parentId);
      if (!parent) throw HttpError.notFound("دسته بندی والد یافت نشد.");

      if (parent.parentId) {
        const grandParent = await Category.findByPk(parent.parentId);
        if (grandParent && grandParent.parentId) {
          throw HttpError.badRequest(
            "عمق دسته‌بندی نمی‌تواند بیشتر از ۳ سطح باشد (دسته اصلی > زیردسته > زیردسته ۲).",
          );
        }
      }
    }

    return await Category.create({
      name: data.name,
      slug: data.slug,
      parentId: data.parentId || null,
      icon: data.icon || null,
      status: data.status || CategoryStatus.DRAFT,
      specsSchema: data.specsSchema as SpecsSchema | null,
      hasSpecs: data.hasSpecs || false,
    });
  }

  async getAllCategories() {
    const categories = await Category.findAll({
      where: { parentId: null, status: CategoryStatus.ACTIVE },
      include: [
        {
          model: Category,
          as: "subcategories",
          where: { status: CategoryStatus.ACTIVE },
          required: false,
          include: [
            {
              model: Category,
              as: "subcategories",
              where: { status: CategoryStatus.ACTIVE },
              required: false,
              include: [
                {
                  model: Category,
                  as: "subcategories",
                  where: { status: CategoryStatus.ACTIVE },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const isInheritSchema = (
      schema: unknown,
    ): schema is { inheritFrom: number } => {
      return (
        typeof schema === "object" && schema !== null && "inheritFrom" in schema
      );
    };

    const resolveInheritance = async (cats: CategoryWithSubs[]) => {
      for (const cat of cats) {
        if (isInheritSchema(cat.specsSchema)) {
          const sourceCat = await Category.findByPk(
            cat.specsSchema.inheritFrom,
            {
              attributes: ["specsSchema"],
            },
          );

          if (sourceCat?.specsSchema) {
            cat.specsSchema = sourceCat.specsSchema;
          } else {
            cat.specsSchema = null;
          }
        }

        if (cat.subcategories && cat.subcategories.length > 0) {
          await resolveInheritance(cat.subcategories);
        }
      }
    };

    await resolveInheritance(categories as CategoryWithSubs[]);
    return categories;
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await Category.findByPk(id);
    if (!category) throw HttpError.notFound("دسته بندی یافت نشد.");

    if (data.slug && data.slug !== category.slug) {
      const existing = await Category.findOne({ where: { slug: data.slug } });
      if (existing) throw HttpError.conflict("این اسلاگ قبلا استفاده شده است.");
    }

    let finalSpecsSchema: SpecsSchema | null =
      category.specsSchema as SpecsSchema | null;

    if (data.specsSchema !== undefined) {
      if (data.specsSchema === null) {
        finalSpecsSchema = null;
      } else {
        const existingSchema: SpecsSchema = (category.specsSchema ||
          {}) as SpecsSchema;
        const incomingSchema = data.specsSchema as UpdateSpecsSchemaPayload;

        const mergedSchema: SpecsSchema = { ...existingSchema };

        for (const key in incomingSchema) {
          if (Object.prototype.hasOwnProperty.call(incomingSchema, key)) {
            const incomingField: PartialSpecFieldSchema | null =
              incomingSchema[key];

            if (incomingField === null) {
              delete mergedSchema[key];
            } else {
              const existingField: SpecFieldSchema | undefined =
                mergedSchema[key];
              mergedSchema[key] = {
                ...(existingField || {}),
                ...incomingField,
              } as SpecFieldSchema;
            }
          }
        }

        finalSpecsSchema = mergedSchema;
      }
    }

    if (data.status === CategoryStatus.ACTIVE && category.parentId) {
      const parent = await Category.findByPk(category.parentId);
      if (parent && parent.status !== CategoryStatus.ACTIVE) {
        throw HttpError.badRequest(
          "برای فعال کردن این دسته‌بندی، ابتدا باید دسته‌بندی والد آن را فعال کنید.",
        );
      }
    }

    if (
      data.status &&
      data.status !== CategoryStatus.ACTIVE &&
      category.status === CategoryStatus.ACTIVE
    ) {
      await this.cascadeStatusToChildren(id, data.status);
    }

    await category.update({
      ...data,
      specsSchema: finalSpecsSchema as SpecsSchema | null,
    });

    return category;
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await Category.findByPk(id);
    if (!category) throw HttpError.notFound("دسته بندی یافت نشد.");

    const hasSubCategories = await Category.count({ where: { parentId: id } });
    if (hasSubCategories > 0) {
      throw HttpError.badRequest("این دسته دارای زیردسته است و قابل حذف نیست.");
    }

    await category.destroy();
    return { message: "دسته‌بندی با موفقیت حذف شد." };
  }

  async getAllCategoriesForAdmin() {
    const categories = await Category.findAll({
      where: { parentId: null },
      include: [
        {
          model: Category,
          as: "subcategories",
          required: false,
          include: [
            {
              model: Category,
              as: "subcategories",
              required: false,
              include: [
                {
                  model: Category,
                  as: "subcategories",
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const isInheritSchema = (
      schema: unknown,
    ): schema is { inheritFrom: number } => {
      return (
        typeof schema === "object" && schema !== null && "inheritFrom" in schema
      );
    };

    const resolveInheritance = async (cats: CategoryWithSubs[]) => {
      for (const cat of cats) {
        if (isInheritSchema(cat.specsSchema)) {
          const sourceCat = await Category.findByPk(
            cat.specsSchema.inheritFrom,
            {
              attributes: ["specsSchema"],
            },
          );

          if (sourceCat?.specsSchema) {
            cat.specsSchema = sourceCat.specsSchema;
          } else {
            cat.specsSchema = null;
          }
        }

        if (cat.subcategories && cat.subcategories.length > 0) {
          await resolveInheritance(cat.subcategories);
        }
      }
    };

    await resolveInheritance(categories as CategoryWithSubs[]);
    return categories;
  }
}

export const categoryService = new CategoryService();
