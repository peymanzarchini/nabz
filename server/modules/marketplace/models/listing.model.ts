import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { ListingCondition, ListingSpecs, ListingStatus } from "../types/index.js";

export class Listing extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare price: number;
  declare isNegotiable: boolean;
  declare condition: ListingCondition;
  declare status: CreationOptional<ListingStatus>;

  declare cityId: number;
  declare districtId: CreationOptional<number | null>;
  declare latitude: CreationOptional<number | null>;
  declare longitude: CreationOptional<number | null>;

  declare thumbnail: CreationOptional<string | null>;
  declare images: string[];

  declare stock: CreationOptional<number | null>;

  declare specs: CreationOptional<ListingSpecs | null>;

  declare averageRating: CreationOptional<number>;
  declare reviewCount: CreationOptional<number>;
  declare aiReviewSummary: CreationOptional<string | null>;

  declare discountPercentage: CreationOptional<number | null>;
  declare discountExpiry: CreationOptional<Date | null>;
  declare isAmazingOffer: CreationOptional<boolean>;
  declare finalPrice: CreationOptional<number>;
  declare rejectionReason: CreationOptional<string | null>;

  declare categoryId: number;
  declare userId: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Listing.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "Title is required" } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: "Description is required" } },
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: { min: 0 },
    },
    isNegotiable: { type: DataTypes.BOOLEAN, defaultValue: false },
    condition: {
      type: DataTypes.ENUM(ListingCondition.NEW, ListingCondition.USED),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        ListingStatus.PENDING,
        ListingStatus.ACTIVE,
        ListingStatus.REJECTED,
        ListingStatus.SOLD,
      ),
      defaultValue: ListingStatus.PENDING,
    },

    cityId: { type: DataTypes.INTEGER, allowNull: false },
    districtId: { type: DataTypes.INTEGER, allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },

    thumbnail: { type: DataTypes.STRING, allowNull: true },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },

    stock: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, validate: { min: 0 } },

    specs: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },

    averageRating: { type: DataTypes.FLOAT, defaultValue: 0, validate: { min: 0, max: 5 } },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    aiReviewSummary: { type: DataTypes.TEXT, allowNull: true },

    discountPercentage: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    discountExpiry: { type: DataTypes.DATE, allowNull: true },
    isAmazingOffer: { type: DataTypes.BOOLEAN, defaultValue: false },
    finalPrice: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Listing",
    tableName: "listings",
    hooks: {
      beforeSave: (listing: Listing) => {
        const hasActiveDiscount =
          listing.discountPercentage !== null &&
          listing.discountPercentage > 0 &&
          listing.discountExpiry !== null &&
          new Date(listing.discountExpiry) > new Date();

        if (hasActiveDiscount) {
          const discountAmount = (listing.price * listing.discountPercentage!) / 100;
          listing.finalPrice = listing.price - discountAmount;
        } else {
          listing.finalPrice = listing.price;

          if (listing.discountExpiry && new Date(listing.discountExpiry) <= new Date()) {
            listing.discountPercentage = 0;
            listing.isAmazingOffer = false;
          }
        }
      },
    },
    indexes: [
      { fields: ["userId"] },
      { fields: ["categoryId"] },
      { fields: ["status"] },
      { fields: ["cityId"] },
      { fields: ["isAmazingOffer"] },
    ],
  },
);
