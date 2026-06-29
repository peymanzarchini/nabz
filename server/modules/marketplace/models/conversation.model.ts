import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";
import { ConversationStatus } from "../types/index.js";

export class Conversation extends Model<
  InferAttributes<Conversation>,
  InferCreationAttributes<Conversation>
> {
  declare id: CreationOptional<number>;
  declare listingId: number;
  declare buyerId: number;
  declare sellerId: number;
  declare status: CreationOptional<ConversationStatus>;
  declare lastMessageAt: CreationOptional<Date>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    listingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(ConversationStatus.ACTIVE, ConversationStatus.CLOSED),
      allowNull: false,
      defaultValue: ConversationStatus.ACTIVE,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "برای مرتب‌سازی چت‌ها بر اساس جدیدترین پیام",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Conversation",
    tableName: "conversations",
    indexes: [
      { fields: ["listingId", "buyerId", "sellerId"], unique: true },
      { fields: ["lastMessageAt"] },
    ],
  },
);
