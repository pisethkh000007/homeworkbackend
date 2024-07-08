// src/services/user.service.ts
import { UserRepository } from "../repositories/user.repository";
import validator from "validator";
import bcrypt from "bcryptjs";
import { ValidationError } from "../middlewares/errorHandler";
import { User } from "../database/models/user.model";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(page: string, limit: string): Promise<any> {
    const options = {
      page: parseInt(page || "1"),
      limit: parseInt(limit || "10"),
    };
    return this.userRepository.getAllUsers(options.page, options.limit);
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<any> {
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new ValidationError("Password is not strong enough");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.createUser({
      username,
      email,
      password: hashedPassword,
    } as User);
  }

  async deleteUser(id: string): Promise<any> {
    const user = await this.userRepository.deleteUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    return { status: 200, message: "Deleted successfully" };
  }

  async updateUser(
    id: string,
    fullName?: string,
    email?: string,
    password?: string,
    status?: string
  ): Promise<any> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedData: Partial<User> = {};
    if (fullName) updatedData.fullName = fullName;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (status) updatedData.status = status;

    const updatedUser = await this.userRepository.updateUser(id, updatedData);
    return {
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    };
  }
}
