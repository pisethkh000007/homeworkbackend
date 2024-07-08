// // user.service.test.ts

// import { UserService } from "../services/user.service";
// import { UserRepository } from "../repositories/user.repository";
// import bcrypt from "bcryptjs";
// import validator from "validator";
// import { ValidationError } from "../middlewares/errorHandler";
// import { User } from "../database/models/user.model";

// jest.mock("bcryptjs");
// jest.mock("validator");

// describe("UserService", () => {
//   let userService: UserService;
//   let mockUserRepository: jest.Mocked<UserRepository>;

//   beforeEach(() => {
//     mockUserRepository = {} as jest.Mocked<UserRepository>;
//     userService = new UserService();
//     userService["userRepository"] = mockUserRepository;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getAllUsers", () => {
//     it("should call UserRepository.getAllUsers with correct arguments", async () => {
//       const mockUsers: User[] = [
//         {
//           id: "1",
//           fullName: "Test User 1",
//           email: "test1@example.com",
//           password: "hashed1",
//           roles: ["user"],
//         },
//         {
//           id: "2",
//           fullName: "Test User 2",
//           email: "test2@example.com",
//           password: "hashed2",
//           roles: ["admin"],
//         },
//       ];

//       mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

//       const result = await userService.getAllUsers("1", "10");

//       expect(result).toEqual(mockUsers);
//       expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith(1, 10);
//     });
//   });

//   describe("getUserById", () => {
//     it("should return user when found", async () => {
//       const mockUser: User = {
//         id: "1",
//         fullName: "Test User",
//         email: "test@example.com",
//         password: "hashedpassword",
//         roles: ["user"],
//       };

//       mockUserRepository.getUserById.mockResolvedValueOnce(mockUser);

//       const result = await userService.getUserById("1");

//       expect(result).toEqual(mockUser);
//       expect(mockUserRepository.getUserById).toHaveBeenCalledWith("1");
//     });

//     it("should throw error when user not found", async () => {
//       mockUserRepository.getUserById.mockResolvedValueOnce(null);

//       await expect(userService.getUserById("1")).rejects.toThrowError(
//         "User not found"
//       );
//       expect(mockUserRepository.getUserById).toHaveBeenCalledWith("1");
//     });
//   });

//   describe("createUser", () => {
//     it("should create user with valid inputs", async () => {
//       const username = "testuser";
//       const email = "test@test.com";
//       const password = "Password1!";

//       const hashedPassword = "hashedpassword";
//       (validator.isStrongPassword as jest.Mock).mockReturnValueOnce(true);
//       (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
//       const mockUser: User = {
//         id: "1",
//         fullName: "Test User",
//         email: "test@example.com",
//         password: hashedPassword,
//         roles: ["user"],
//       };
//       mockUserRepository.createUser.mockResolvedValueOnce(mockUser);

//       const result = await userService.createUser(username, email, password);

//       expect(result).toEqual(mockUser);
//       expect(mockUserRepository.createUser).toHaveBeenCalledWith({
//         username,
//         email,
//         password: hashedPassword,
//         fullName: "Test User",
//         roles: ["user"],
//       });
//     });

//     it("should throw ValidationError for weak password", async () => {
//       const username = "testuser";
//       const email = "test@test.com";
//       const password = "weak";

//       (validator.isStrongPassword as jest.Mock).mockReturnValueOnce(false);

//       await expect(
//         userService.createUser(username, email, password)
//       ).rejects.toThrowError(ValidationError);
//       expect(mockUserRepository.createUser).not.toHaveBeenCalled();
//     });
//   });

//   describe("deleteUser", () => {
//     it("should delete user when found", async () => {
//       const mockUser: User = {
//         id: "1",
//         fullName: "Test User",
//         email: "test@example.com",
//         password: "hashedpassword",
//         roles: ["user"],
//       };
//       mockUserRepository.deleteUser.mockResolvedValueOnce(mockUser);

//       const result = await userService.deleteUser("1");

//       expect(result).toEqual({ status: 200, message: "Deleted successfully" });
//       expect(mockUserRepository.deleteUser).toHaveBeenCalledWith("1");
//     });

//     it("should throw error when user not found", async () => {
//       mockUserRepository.deleteUser.mockResolvedValueOnce(null);

//       await expect(userService.deleteUser("1")).rejects.toThrowError(
//         "User not found"
//       );
//       expect(mockUserRepository.deleteUser).toHaveBeenCalledWith("1");
//     });
//   });

//   describe("updateUser", () => {
//     it("should update user when found", async () => {
//       const userId = "1";
//       const updatedData = {
//         email: "updated@test.com",
//         password: "newpassword",
//       };
//       const updatedUser: User = {
//         id: userId,
//         fullName: "Updated Test User", // Updated user data
//         email: updatedData.email,
//         password: "hashedpassword",
//         roles: ["user"],
//       };
//       mockUserRepository.getUserById.mockResolvedValueOnce({
//         id: userId,
//         fullName: "Test User",
//       });
//       mockUserRepository.updateUser.mockResolvedValueOnce(updatedUser);

//       const result = await userService.updateUser(
//         userId,
//         updatedData.email,
//         updatedData.password
//       );

//       expect(result).toEqual({
//         status: 200,
//         message: "User updated successfully",
//         data: updatedUser,
//       });
//       expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
//       expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
//         userId,
//         updatedData
//       );
//     });

//     it("should throw error when user not found", async () => {
//       mockUserRepository.getUserById.mockResolvedValueOnce(null);

//       await expect(
//         userService.updateUser("1", "updated@test.com", "newpassword")
//       ).rejects.toThrowError("User not found");
//       expect(mockUserRepository.getUserById).toHaveBeenCalledWith("1");
//       expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
//     });
//   });
// });
