import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";

export class ListingVariant extends Model<
  InferAttributes<ListingVariant>,
  InferCreationAttributes<ListingVariant>
> {
  declare id: CreationOptional<number>;
  declare listingId: number;
  declare specs: Record<string, string>;
  declare price: number;
  declare discountPercentage: CreationOptional<number>;
  declare discountExpiry: CreationOptional<Date | null>;
  declare finalPrice: CreationOptional<number>;
  declare stock: CreationOptional<number>;
  declare sku: CreationOptional<string | null>;
}

ListingVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    listingId: { type: DataTypes.INTEGER, allowNull: false },
    specs: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    price: { type: DataTypes.BIGINT, allowNull: false, validate: { min: 0 } },
    discountPercentage: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    discountExpiry: { type: DataTypes.DATE, allowNull: true },
    finalPrice: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    sku: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "ListingVariant",
    tableName: "listing_variants",
    hooks: {
      beforeSave: (variant: ListingVariant) => {
        const hasActiveDiscount =
          variant.discountPercentage > 0 &&
          variant.discountExpiry !== null &&
          new Date(variant.discountExpiry) > new Date();

        if (hasActiveDiscount) {
          variant.finalPrice = variant.price - (variant.price * variant.discountPercentage) / 100;
        } else {
          variant.finalPrice = variant.price;
        }
      },
    },
  },
);
