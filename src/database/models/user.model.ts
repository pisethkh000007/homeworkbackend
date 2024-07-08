import { Schema, model, Document } from "mongoose";
import validator from "validator";

export interface User {
  username: string;
  fullName: string;
  email: string;
  password: string;
  status?: string;
  role: string; // Add role to User interface
}

export interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: (props: { value: string }) =>
        ` ${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isStrongPassword(value),
      message: (_props: { value: string }) => "Password is not strong enough!",
    },
  },
  status: { type: String, default: "active" },
  role: { type: String, required: true, default: "user" }, // Add role to schema
});

export const UserModel = model<UserDocument>("User", UserSchema);
