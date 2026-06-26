import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { ListingCondition, ListingStatus } from "../types/index.js";

export class Listing extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare price: number;
  declare isNegotiable: boolean;
  declare condition: ListingCondition;
  declare status: CreationOptional<ListingStatus>;
  declare city: string;
  declare district: CreationOptional<string>;
  declare images: string[];
  declare categoryId: number;
  declare userId: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
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
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: { min: 0 },
    },
    isNegotiable: {
      type: DataTypes.BOOLEAN,
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
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
      { fields: ["city"] },
    ],
  },
);
