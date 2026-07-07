import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";

export class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare parentId: CreationOptional<string | null>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Location.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "Location name is required" } },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { name: "unique_location_slug", msg: "Slug must be unique" },
      validate: { notEmpty: true },
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Location",
    tableName: "locations",
    indexes: [{ fields: ["slug"], unique: true }, { fields: ["parentId"] }],
  },
);
