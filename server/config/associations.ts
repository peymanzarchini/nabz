import { Auth } from "@/modules/auth/model/auth.model.js";
import { Category } from "@/modules/marketplace/models/category.model.js";
import { Conversation } from "@/modules/marketplace/models/conversation.model.js";
import { Listing } from "@/modules/marketplace/models/listing.model.js";
import { Location } from "@/modules/marketplace/models/location.model.js";
import { Message } from "@/modules/marketplace/models/message.model.js";
import { Review } from "@/modules/marketplace/models/review.model.js";

export function setupAssociations() {
  // ==========================================
  // 🧑 بخش کاربران (Auth)
  // ==========================================
  Auth.hasMany(Listing, { foreignKey: "userId", as: "listings", inverse: "user" });
  Auth.hasMany(Review, { foreignKey: "userId", as: "reviews", inverse: "user" });

  Auth.hasMany(Conversation, { foreignKey: "buyerId", as: "buyerConversations", inverse: "buyer" });
  Auth.hasMany(Conversation, {
    foreignKey: "sellerId",
    as: "sellerConversations",
    inverse: "seller",
  });

  Auth.hasMany(Message, { foreignKey: "senderId", as: "sentMessages", inverse: "sender" });

  // ==========================================
  // 🏷️ بخش دسته‌بندی‌ها (Category)
  // ==========================================

  Category.hasMany(Category, { foreignKey: "parentId", as: "subcategories", inverse: "parent" });

  Category.hasMany(Listing, { foreignKey: "categoryId", as: "listings", inverse: "category" });

  // ==========================================
  // 📍 بخش مکان‌ها (Location)
  // ==========================================

  Location.hasMany(Location, { foreignKey: "parentId", as: "districts", inverse: "city" });

  Location.hasMany(Listing, { foreignKey: "cityId", as: "cityListings", inverse: "city" });
  Location.hasMany(Listing, {
    foreignKey: "districtId",
    as: "districtListings",
    inverse: "district",
  });

  // ==========================================
  // 🛒 بخش آگهی‌ها (Listing)
  // ==========================================

  Listing.hasMany(Review, { foreignKey: "listingId", as: "reviews", inverse: "listing" });
  Listing.hasMany(Conversation, {
    foreignKey: "listingId",
    as: "conversations",
    inverse: "listing",
  });

  // ==========================================
  // 💬 بخش دیدگاه‌ها (Review)
  // ==========================================

  Review.hasMany(Review, { foreignKey: "parentId", as: "replies", inverse: "parent" });

  // ==========================================
  // 📱 بخش چت و پیام‌رسانی (Chat)
  // ==========================================
  Conversation.hasMany(Message, {
    foreignKey: "conversationId",
    as: "messages",
    inverse: "conversation",
  });
}
