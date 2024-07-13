//user.contorller.tset.ts
import { UsersController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { User } from "../database/models/user.model";

jest.mock("../services/user.service");

describe("UsersController", () => {
  let usersController: UsersController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    usersController = new UsersController();
    (usersController as any).userService = userService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const user = {
        _id: "1",
        fullname: "testuser",
        email: "test@test.com",
        password: "hashedpassword",
        roles: ["user"],
      };
      userService.createUser.mockResolvedValue(user);

      const result = await usersController.createUser({
        fullname: "testuser",
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
  });

  describe("getAllUser", () => {
    it("should get all users", async () => {
      const mockUsers: User[] = [
        {
          _id: "1",
          fullname: "Test User 1",
          email: "test1@example.com",
          password: "hashed1",
          roles: ["user"],
        },
        {
          _id: "2",
          fullname: "Test User 2",
          email: "test2@example.com",
          password: "hashed2",
          roles: ["admin"],
        },
      ];

      userService.getAllUsers.mockResolvedValue(mockUsers);

      const result = await usersController.getAllUser({
        page: "1",
        limit: "10",
      });

      expect(result).toEqual(mockUsers);
      expect(userService.getAllUsers).toHaveBeenCalledWith("1", "10");
    });
  });

  describe("getUser", () => {
    it("should get a user by id", async () => {
      const mockUser: User = {
        _id: "1",
        fullname: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        roles: ["user"],
      };

      userService.getUserById.mockResolvedValue(mockUser);

      const result = await usersController.getUser("1");

      expect(result).toEqual(mockUser);
      expect(userService.getUserById).toHaveBeenCalledWith("1");
    });

    it("should throw error when user not found", async () => {
      userService.getUserById.mockRejectedValue(new Error("User not found"));

      await expect(usersController.getUser("1")).rejects.toThrowError(
        "User not found"
      );
      expect(userService.getUserById).toHaveBeenCalledWith("1");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user by id", async () => {
      userService.deleteUser.mockResolvedValue({
        status: 200,
        message: "Deleted successfully",
      });

      const result = await usersController.deleteUser("1");

      expect(result).toEqual({
        status: 200,
        message: "Deleted successfully",
      });
      expect(userService.deleteUser).toHaveBeenCalledWith("1");
    });

    it("should throw error when user not found", async () => {
      userService.deleteUser.mockRejectedValue(new Error("User not found"));

      await expect(usersController.deleteUser("1")).rejects.toThrowError(
        "User not found"
      );
      expect(userService.deleteUser).toHaveBeenCalledWith("1");
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const updatedUser: User = {
        _id: "1",
        fullname: "updatedUser",
        email: "updated@example.com",
        password: "hashedUpdatedPassword",
        roles: ["user"],
      };

      userService.updateUser.mockResolvedValue({
        status: 200,
        message: "User updated successfully",
        data: updatedUser,
      });

      const result = await usersController.updateUser("1", {
        fullname: "updatedUser",
        email: "updated@example.com",
        password: "updatedPassword",
      });

      expect(result).toEqual({
        status: 200,
        message: "User updated successfully",
        data: updatedUser,
      });
      expect(userService.updateUser).toHaveBeenCalledWith(
        "1",
        "updatedUser",
        "updated@example.com",
        "updatedPassword"
      );
    });

    it("should throw error when user not found", async () => {
      userService.updateUser.mockRejectedValue(new Error("User not found"));

      await expect(
        usersController.updateUser("1", {
          fullname: "updatedUser",
          email: "updated@example.com",
          password: "updatedPassword",
        })
      ).rejects.toThrowError("User not found");
      expect(userService.updateUser).toHaveBeenCalledWith(
        "1",
        "updatedUser",
        "updated@example.com",
        "updatedPassword"
      );
    });
  });
});
