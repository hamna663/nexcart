import mongoose, { Model, Schema } from "mongoose";

interface IAddress {
  street: string;
  pincode: string;
  city: string;
  country: string;
}

interface IPhone {
  countryCode?: number;
  number?: number;
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode?: string;
  phone: IPhone;
  createdAt?: Date;
  updatedAt?: Date;
}

const phoneSchema = new Schema<IPhone>({
  countryCode: Number,
  number: Number,
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: phoneSchema,
    },
  },
  {
    timestamps: true,
  },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
