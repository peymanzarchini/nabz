import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "@sequelize/core";
import bcrypt from "bcrypt";
import { UserRole, UserStatus } from "@/types/index.js";
import { sequelize } from "@/config/database.js";

export class Auth extends Model<InferAttributes<Auth>, InferCreationAttributes<Auth>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string;
  declare avatar: CreationOptional<string>;
  declare role: CreationOptional<UserRole>;
  declare status: CreationOptional<UserStatus>;
  declare isVerified: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  get fullName(): NonAttribute<string> {
    return `${this.firstName} ${this.lastName}`;
  }

  async validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

Auth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "First name is required" },
        notEmpty: { msg: "First name cannot be empty" },
        len: { args: [2, 50], msg: "First name must be between 2 and 50 characters" },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: "Last name is required" },
        notEmpty: { msg: "Last name cannot be empty" },
        len: {
          args: [2, 50],
          msg: "Last name must be between 2 and 50 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "unique_email",
        msg: "This email is already registered",
      },
      validate: {
        notNull: { msg: "Email is required" },
        isEmail: { msg: "Invalid email format" },
      },
      set(value: string) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        len: {
          args: [8, 255],
          msg: "Password must be at least 8 characters",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: {
        name: "unique_phone_number",
        msg: "This phone number is already registered",
      },
      validate: {
        notNull: { msg: "Phone number is required" },
        is: {
          args: /^\+?[0-9\s\-()]{7,20}$/,
          msg: "Invalid phone number format",
        },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM(
        UserRole.ADMIN,
        UserRole.SUPPORT,
        UserRole.SELLER,
        UserRole.DRIVER,
        UserRole.CUSTOMER,
      ),
      allowNull: false,
      defaultValue: UserRole.CUSTOMER,
    },
    status: {
      type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.BANNED, UserStatus.PENDING),
      allowNull: false,
      defaultValue: UserStatus.PENDING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Auth",
    tableName: "auth",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    hooks: {
      beforeCreate: async (user: Auth) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user: Auth) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["phoneNumber"], unique: true },
      { fields: ["role"] },
    ],
  },
);
