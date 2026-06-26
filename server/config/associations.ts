import { Auth } from "@/modules/auth/model/auth.model.js";
import { Category } from "@/modules/marketplace/models/category.model.js";
import { Listing } from "@/modules/marketplace/models/listing.model.js";

export function setupAssociations() {
  Auth.hasMany(Listing, {
    foreignKey: "userId",
    as: "listings",
  });

  Listing.belongsTo(Auth, {
    foreignKey: "userId",
    as: "user",
  });

  Category.hasMany(Listing, {
    foreignKey: "categoryId",
    as: "listings",
  });

  Listing.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  Category.hasMany(Category, {
    foreignKey: "parentId",
    as: "subcategories",
  });

  Category.belongsTo(Category, {
    foreignKey: "parentId",
    as: "parent",
  });
}
