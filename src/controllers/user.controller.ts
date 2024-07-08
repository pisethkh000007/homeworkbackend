// src/controllers/user.controller.ts
import {
  Controller,
  Route,
  Post,
  Body,
  Get,
  Path,
  Queries,
  Delete,
  Put,
} from "tsoa";
import { UserService } from "../services/user.service";

interface UserQueryParams {
  page?: string;
  limit?: string;
}

@Route("api/v1/users")
export class UsersController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  @Get()
  async getAllUser(
    @Queries() query: UserQueryParams = { page: "1", limit: "10" }
  ): Promise<any> {
    try {
      const page = query.page || "1";
      const limit = query.limit || "10";
      return this.userService.getAllUsers(page, limit);
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      throw error;
    }
  }

  @Get("{id}")
  async getUser(@Path() id: string): Promise<any> {
    try {
      return this.userService.getUserById(id);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  @Post("register")
  public async createUser(
    @Body() requestBody: { username: string; email: string; password: string }
  ): Promise<any> {
    try {
      return this.userService.createUser(
        requestBody.username,
        requestBody.email,
        requestBody.password
      );
    } catch (error: any) {
      throw error;
    }
  }

  @Delete("{id}")
  async deleteUser(@Path() id: string): Promise<any> {
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  @Put("{id}")
  public async updateUser(
    @Path() id: string,
    @Body()
    requestBody: {
      fullName?: string;
      email?: string;
      password?: string;
      status?: string;
    }
  ): Promise<any> {
    try {
      return this.userService.updateUser(
        id,
        requestBody.fullName,
        requestBody.email,
        requestBody.password,
        requestBody.status
      );
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
