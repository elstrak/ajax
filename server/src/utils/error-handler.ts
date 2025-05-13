import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message = 'Bad Request') {
    return new ApiError(message, 400);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }
  
  static notFound(message = 'Not Found') {
    return new ApiError(message, 404);
  }
  
  static internal(message = 'Internal Server Error') {
    return new ApiError(message, 500);
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: err.message
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message
    });
  }
  
  // Default to 500 server error
  return res.status(500).json({
    message: 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 