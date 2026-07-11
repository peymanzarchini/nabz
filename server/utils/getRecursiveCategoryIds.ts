import { Category } from "@/modules/marketplace/models/category.model.js";

export async function getRecursiveCategoryIds(categoryId: string): Promise<string[]> {
  const subCategories = await Category.findAll({
    where: { parentId: categoryId },
    attributes: ["id"],
  });

  const subIds = subCategories.map((sub) => sub.id);
  const nestedIds = await Promise.all(subIds.map((subId) => getRecursiveCategoryIds(subId)));

  return [categoryId, ...subIds, ...nestedIds.flat()];
}
