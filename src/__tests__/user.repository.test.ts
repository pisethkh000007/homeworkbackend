import { UserRepository } from "../repositories/user.repository";
import { UserModel } from "../database/models/user.model";

jest.mock("../database/models/user.model");

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users", async () => {
    const users = [{ id: "1", username: "testuser" }];
    (UserModel.countDocuments as jest.Mock).mockResolvedValue(1);
    (UserModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(users),
    });

    const result = await userRepository.getAllUsers(1, 10);
    expect(result).toEqual({
      users,
      totalUser: 1,
      totalPages: 1,
      page: 1,
    });
    expect(UserModel.countDocuments).toHaveBeenCalled();
    expect(UserModel.find).toHaveBeenCalled();
  });

  it("should get user by id", async () => {
    const user = { id: "1", username: "testuser" };

    (UserModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    });

    const result = await userRepository.getUserById("1");
    expect(result).toEqual(user);
    expect(UserModel.findById).toHaveBeenCalledWith("1");
  });

  it("should create a user", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      password: "hashedpassword",
    };
    (UserModel.prototype.save as jest.Mock).mockResolvedValue(user);
    const newUser = new UserModel(user);

    const result = await userRepository.createUser(user);
    expect(result).toEqual(user);
    expect(newUser.save).toHaveBeenCalled();
  });

  it("should delete user by id", async () => {
    const user = { id: "1", username: "testuser" };
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(user);

    const result = await userRepository.deleteUser("1");
    expect(result).toEqual(user);
    expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("1");
  });

  it("should update user by id", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "updated@test.com",
      password: "hashedpassword",
    };
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(user);

    const result = await userRepository.updateUser("1", {
      email: "updated@test.com",
      password: "newpassword",
    });
    expect(result).toEqual(user);
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { email: "updated@test.com", password: "newpassword" },
      { new: true }
    );
  });
});
