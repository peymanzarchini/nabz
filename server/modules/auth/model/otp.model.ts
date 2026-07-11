import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "@sequelize/core";

import { sequelize } from "@/config/database.js";

export class Otp extends Model<InferAttributes<Otp>, InferCreationAttributes<Otp>> {
  declare id: CreationOptional<string>;
  declare email: string | null;
  declare phoneNumber: string | null;
  declare code: string;
  declare expiresAt: Date;
  declare attempts: CreationOptional<number>;
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: "otps",
    timestamps: true,
  },
);
