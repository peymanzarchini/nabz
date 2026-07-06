import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { ListingCondition, ListingStatus, SpecValue } from "../types/index.js";
import { ListingVariant } from "./variant.model.js";
import { Category } from "./category.model.js";
import { Location } from "./location.model.js";
import { Auth } from "@/modules/auth/model/auth.model.js";

export class Listing extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare isNegotiable: boolean;
  declare condition: ListingCondition;
  declare status: CreationOptional<ListingStatus>;

  declare cityId: number;
  declare districtId: CreationOptional<number | null>;
  declare latitude: CreationOptional<number | null>;
  declare longitude: CreationOptional<number | null>;

  declare thumbnail: CreationOptional<string | null>;
  declare images: string[];

  declare specs: CreationOptional<Record<string, SpecValue>>;

  declare minPrice: CreationOptional<number>;

  declare averageRating: CreationOptional<number>;
  declare reviewCount: CreationOptional<number>;
  declare aiReviewSummary: CreationOptional<string | null>;

  declare isAmazingOffer: CreationOptional<boolean>;
  declare rejectionReason: CreationOptional<string | null>;
  declare categoryId: number;
  declare userId: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare variants?: NonAttribute<ListingVariant[]>;
  declare category?: NonAttribute<Category>;
  declare city?: NonAttribute<Location>;
  declare district?: NonAttribute<Location | null>;
  declare user?: NonAttribute<Auth>;
}

Listing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    isNegotiable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
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

    specs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },

    minPrice: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },

    averageRating: { type: DataTypes.FLOAT, defaultValue: 0, validate: { min: 0, max: 5 } },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    aiReviewSummary: { type: DataTypes.TEXT, allowNull: true },

    isAmazingOffer: { type: DataTypes.BOOLEAN, defaultValue: false },
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
    indexes: [
      { fields: ["userId"] },
      { fields: ["categoryId"] },
      { fields: ["status"] },
      { fields: ["cityId"] },
      { fields: ["isAmazingOffer"] },
      { fields: ["minPrice"] },
    ],
  },
);
