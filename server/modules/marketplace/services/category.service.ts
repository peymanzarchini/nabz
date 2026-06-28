import { HttpError } from "@/utils/httpError.js";
import { Category } from "../models/category.model.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../validations/category.schema.js";
import { SpecsSchema } from "../types/index.js";

class CategoryService {
  async createCategory(data: CreateCategoryInput) {
    const existingCategory = await Category.findOne({ where: { slug: data.slug } });
    if (existingCategory) throw HttpError.conflict("این اسلاگ قبلا استفاده شده است");

    if (data.parentId) {
      const parent = await Category.findByPk(data.parentId);
      if (!parent) throw HttpError.notFound("دسته بندی والد یافت نشد.");
    }

    return await Category.create({
      name: data.name,
      slug: data.slug,
      parentId: data.parentId || null,
      icon: data.icon || null,
      specsSchema: data.specsSchema as SpecsSchema | null,
    });
  }

  async getAllCategories() {
    return await Category.findAll({
      where: { parentId: null },
      include: [
        {
          model: Category,
          as: "subcategories",
          include: [
            {
              model: Category,
              as: "subcategories",
              include: [
                {
                  model: Category,
                  as: "subcategories",
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  async updateCategory(id: number, data: UpdateCategoryInput) {
    const category = await Category.findByPk(id);
    if (!category) throw HttpError.notFound("دسته بندی یافت نشد.");

    if (data.slug && data.slug !== category.slug) {
      const existing = await Category.findOne({ where: { slug: data.slug } });
      if (existing) throw HttpError.conflict("این اسلاگ قبلا استفاده شده است.");
    }

    await category.update({
      ...data,
      specsSchema:
        data.specsSchema !== undefined
          ? (data.specsSchema as SpecsSchema | null)
          : category.specsSchema,
    });

    return category;
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    const category = await Category.findByPk(id);
    if (!category) throw HttpError.notFound("دسته بندی یافت نشد.");

    const hasSubCategories = await Category.count({ where: { parentId: id } });
    if (hasSubCategories > 0) {
      throw HttpError.badRequest("این دسته دارای زیردسته است و قابل حذف نیست.");
    }

    await category.destroy();
    return { message: "دسته‌بندی با موفقیت حذف شد." };
  }
}

export const categoryService = new CategoryService();
