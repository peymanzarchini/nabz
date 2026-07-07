import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { SpecsSchema } from "../types/index.js";

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare parentId: CreationOptional<string | null>;
  declare icon: CreationOptional<string | null>;
  declare specsSchema: CreationOptional<SpecsSchema | null>;
  declare hasSpecs: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "Category name is required" } },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: "unique_slug", msg: "Slug must be unique" },
      validate: { notEmpty: true },
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specsSchema: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment: "تعریف فیلدهای اختصاصی این دسته بندی برای فرانت اند (فرم ساز داینامیک)",
    },
    hasSpecs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    indexes: [{ fields: ["slug"], unique: true }, { fields: ["parentId"] }],
  },
);
