import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";

import { User } from "../database/models/user.model";

jest.mock("bcryptjs");
jest.mock("validator");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      deleteUser: jest.fn(),
      updateUser: jest.fn(),
    } as jest.Mocked<UserRepository>;
    userService = new UserService();
    userService["userRepository"] = mockUserRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should call UserRepository.getAllUsers with correct arguments", async () => {
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

      mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers("1", "10");

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe("getUserById", () => {
    it("should return user when found", async () => {
      const mockUser: User = {
        _id: "1",
        fullname: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        roles: ["user"],
      };

      mockUserRepository.getUserById.mockResolvedValueOnce(mockUser);

      const result = await userService.getUserById("1");

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith("1");
    });

    it("should throw error when user not found", async () => {
      mockUserRepository.getUserById.mockResolvedValueOnce(null);

      await expect(userService.getUserById("1")).rejects.toThrowError(
        "User not found"
      );
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith("1");
    });
  });

  describe("createUser", () => {
    it("should create user with valid inputs", async () => {
      const fullname = "testuser";
      const email = "test@test.com";
      const password = "Password1!";
      const hashedPassword = "hashedPassword1!";
      const newUser: User = {
        _id: "1",
        fullname,
        email,
        password: hashedPassword,
        roles: ["user"],
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.createUser.mockResolvedValue(newUser);

      const result = await userService.createUser(fullname, email, password);

      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        fullname,
        email,
        password: hashedPassword,
        roles: ["user"],
      });
    });

    it("should throw validation error with invalid email", async () => {
      const fullname = "testuser";
      const email = "";
      const password = "Password1!";

      await expect(
        userService.createUser(fullname, email, password)
      ).rejects.toThrowError("Invalid email");
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("should delete user by id", async () => {
      const mockUser: User = {
        _id: "1",
        fullname: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        roles: ["user"],
      };

      mockUserRepository.deleteUser.mockResolvedValue(mockUser);

      const result = await userService.deleteUser("1");

      expect(result).toEqual({
        status: 200,
        message: "Deleted successfully",
      });
      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith("1");
    });

    it("should throw error when user not found", async () => {
      mockUserRepository.deleteUser.mockResolvedValue(null);

      await expect(userService.deleteUser("1")).rejects.toThrowError(
        "User not found"
      );
      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith("1");
    });
  });

  describe("updateUser", () => {
    it("should update user with valid inputs", async () => {
      const id = "1";
      const fullname = "updatedUser";
      const email = "updated@example.com";
      const password = "updatedPassword";
      const hashedPassword = "hashedUpdatedPassword";
      const updatedUser: User = {
        _id: id,
        fullname,
        email,
        password: hashedPassword,
        roles: ["user"],
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(
        id,
        fullname,
        email,
        password
      );

      expect(result).toEqual({
        status: 200,
        message: "User updated successfully",
        data: updatedUser,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(id, {
        fullname,
        email,
        password: hashedPassword,
      });
    });

    it("should throw error when user not found", async () => {
      const id = "1";
      const fullname = "updatedUser";
      const email = "updated@example.com";
      const password = "updatedPassword";

      mockUserRepository.updateUser.mockResolvedValue(null);

      await expect(
        userService.updateUser(id, fullname, email, password)
      ).rejects.toThrowError("User not found");
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(id, {
        fullname,
        email,
        password: expect.any(String),
      });
    });
  });
});
