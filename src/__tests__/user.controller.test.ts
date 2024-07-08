// src/__tests__/user.controller.test.ts
import { UsersController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

jest.mock("../services/user.service");

describe("UsersController", () => {
  let usersController: UsersController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    usersController = new UsersController();
    usersController["userService"] = userService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users", async () => {
    const users = [{ id: "1", username: "testuser" }];
    userService.getAllUsers.mockResolvedValue({
      users,
      totalUser: 1,
      totalPages: 1,
      page: 1,
    });

    const result = await usersController.getAllUser({ page: "1", limit: "10" });
    expect(result).toEqual({
      users,
      totalUser: 1,
      totalPages: 1,
      page: 1,
    });
    expect(userService.getAllUsers).toHaveBeenCalledWith("1", "10");
  });

  it("should get user by id", async () => {
    const user = { id: "1", username: "testuser" };
    userService.getUserById.mockResolvedValue(user);

    const result = await usersController.getUser("1");
    expect(result).toEqual(user);
    expect(userService.getUserById).toHaveBeenCalledWith("1");
  });

  it("should create a user", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      password: "hashedpassword",
    };
    userService.createUser.mockResolvedValue(user);

    const result = await usersController.createUser({
      username: "testuser",
      email: "test@test.com",
      password: "password",
    });
    expect(result).toEqual(user);
    expect(userService.createUser).toHaveBeenCalledWith(
      "testuser",
      "test@test.com",
      "password"
    );
  });

  it("should delete user by id", async () => {
    userService.deleteUser.mockResolvedValue({
      status: 200,
      message: "Deleted successfully",
    });

    const result = await usersController.deleteUser("1");
    expect(result).toEqual({ status: 200, message: "Deleted successfully" });
    expect(userService.deleteUser).toHaveBeenCalledWith("1");
  });

  it("should update user by id", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "updated@test.com",
      password: "hashedpassword",
      status: "active",
    };
    userService.updateUser.mockResolvedValue({
      status: 200,
      message: "User updated successfully",
      data: user,
    });

    const result = await usersController.updateUser("1", {
      email: "updated@test.com",
      password: "newpassword",
    });
    expect(result).toEqual({
      status: 200,
      message: "User updated successfully",
      data: user,
    });
    expect(userService.updateUser).toHaveBeenCalledWith(
      "1",
      undefined,
      "updated@test.com",
      "newpassword",
      undefined
    );
  });
});
