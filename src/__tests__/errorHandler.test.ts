import { Request, Response } from "express";
import { ValidationError, errorHandler } from "../middlewares/errorHandler";
import { logger } from "../utils/logger"; // Adjust the path as necessary

jest.mock("../utils/logger"); // Mock the custom logger

describe("errorHandler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNextFunction = jest.fn();
  });

  it("should handle ValidationError", () => {
    const err = new ValidationError("Validation error message");
    errorHandler(
      err,
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Validation error message",
    });
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  it("should handle other errors", () => {
    console.log("Running test for generic error");
    const err = new Error("Generic error message");
    errorHandler(
      err,
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
    expect(mockNextFunction).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith("Unexpected Error:", err);
  });
});
