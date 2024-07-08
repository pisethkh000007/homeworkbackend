// src/repositories/user.repository.ts
import { UserModel, User } from "../database/models/user.model";

export class UserRepository {
  async getAllUsers(page: number, limit: number): Promise<any> {
    const totalUser = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalUser / limit);
    const users = await UserModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    return { users, totalUser, totalPages, page };
  }

  async getUserById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }

  async createUser(data: Partial<User>): Promise<User> {
    const newUser = new UserModel(data);
    return newUser.save();
  }

  async deleteUser(id: string): Promise<User | null> {
    return UserModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }
}
