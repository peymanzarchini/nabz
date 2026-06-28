import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";

export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<number>;
  declare rating: number;
  declare title: CreationOptional<string | null>;
  declare comment: string;
  declare pros: CreationOptional<string[]>;
  declare cons: CreationOptional<string[]>;
  declare userId: number;
  declare listingId: number;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5, notNull: { msg: "امتیاز الزامی است" } },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: "متن دیدگاه الزامی است" } },
    },
    pros: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    cons: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    listingId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    indexes: [
      { fields: ["userId"] },
      { fields: ["listingId"] },
      { fields: ["userId", "listingId"], unique: true },
    ],
  },
);
