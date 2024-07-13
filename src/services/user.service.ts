import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { User } from "../database/models/user.model";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(page: string, limit: string) {
    const users = await this.userRepository.getAllUsers(
      Number(page),
      Number(limit)
    );
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createUser(fullname: string, email: string, password: string) {
    if (!email) {
      throw new Error("Invalid email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: Partial<User> = {
      fullname,
      email,
      password: hashedPassword,
      roles: ["user"],
    };
    const createdUser = await this.userRepository.createUser(newUser);
    return createdUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userRepository.deleteUser(id);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return {
      status: 200,
      message: "Deleted successfully",
    };
  }

  async updateUser(
    id: string,
    fullname?: string,
    email?: string,
    password?: string
  ) {
    const updatedData: Partial<User> = {};
    if (fullname) updatedData.fullname = fullname;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const updatedUser = await this.userRepository.updateUser(id, updatedData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return {
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    };
  }
}
