//user.model.ts
import { Document, Schema, model } from "mongoose";

export interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UserDocument extends Document {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  roles: string[];
}

const userSchema = new Schema<UserDocument>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ["user"] },
});

export const UserModel = model<UserDocument>("User", userSchema);
