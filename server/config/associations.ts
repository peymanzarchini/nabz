import { Auth } from "@/modules/auth/model/auth.model.js";
import { Category } from "@/modules/marketplace/models/category.model.js";
import { Listing } from "@/modules/marketplace/models/listing.model.js";
import { Location } from "@/modules/marketplace/models/location.model.js";
import { Review } from "@/modules/marketplace/models/review.model.js";

export function setupAssociations() {
  Auth.hasMany(Listing, { foreignKey: "userId", as: "listings" });
  Listing.belongsTo(Auth, { foreignKey: "userId", as: "user" });

  Auth.hasMany(Review, { foreignKey: "userId", as: "reviews" });
  Review.belongsTo(Auth, { foreignKey: "userId", as: "user" });

  Category.hasMany(Listing, { foreignKey: "categoryId", as: "listings" });
  Listing.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  Category.hasMany(Category, {
    foreignKey: "parentId",
    as: "subcategories",
    inverse: "parent",
  });

  Listing.hasMany(Review, { foreignKey: "listingId", as: "reviews" });
  Review.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

  Location.hasMany(Location, {
    foreignKey: "parentId",
    as: "districts",
    inverse: "city",
  });

  Location.hasMany(Listing, {
    foreignKey: "cityId",
    as: "cityListings",
    inverse: "city",
  });
  Listing.belongsTo(Location, { foreignKey: "cityId", as: "city" });

  Location.hasMany(Listing, {
    foreignKey: "districtId",
    as: "districtListings",
    inverse: "district",
  });
  Listing.belongsTo(Location, { foreignKey: "districtId", as: "district" });

  Review.hasMany(Review, {
    foreignKey: "parentId",
    as: "replies",
    inverse: "parent",
  });
}
