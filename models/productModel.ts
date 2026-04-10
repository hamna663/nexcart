import mongoose, { Model, Schema } from "mongoose";

interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock?: number;
  availableInCountries?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    images: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    availableInCountries: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
