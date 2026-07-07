import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { ReviewStatus } from "../types/index.js";

export class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id: CreationOptional<string>;
  declare rating: CreationOptional<number | null>;
  declare title: CreationOptional<string | null>;
  declare comment: string;
  declare pros: CreationOptional<string[]>;
  declare cons: CreationOptional<string[]>;
  declare status: CreationOptional<ReviewStatus>;
  declare rejectionReason: CreationOptional<string | null>;
  declare parentId: CreationOptional<string | null>;
  declare userId: string;
  declare listingId: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: null,
      validate: { min: 1, max: 5 },
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
    status: {
      type: DataTypes.ENUM(ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED),
      allowNull: false,
      defaultValue: ReviewStatus.PENDING,
    },
    rejectionReason: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    listingId: { type: DataTypes.UUID, allowNull: false },
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
      { fields: ["status"] },
      {
        fields: ["parentId"],
      },
    ],
  },
);
