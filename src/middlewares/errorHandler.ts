import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger"; // Adjust the path as necessary

// Custom ValidationError class
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Error handling middleware
const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
  } else {
    logger.error("Unexpected Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { ValidationError, errorHandler };
