import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "@sequelize/core";
import { sequelize } from "@/config/database.js";

export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<number>;
  declare conversationId: number;
  declare senderId: number;
  declare content: string;
  declare isRead: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Message.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    conversationId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    indexes: [
      {
        fields: ["conversationId"],
      },
      {
        fields: ["isRead"],
      },
    ],
  },
);
