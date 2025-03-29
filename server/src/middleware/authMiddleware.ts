import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types/express';
import config from '../config';
import mongoose from 'mongoose';
import { IUser } from '../models/User';
// cookieParser is imported but should be used in the main app file, not here
// Protect routes
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Extract token from cookies
  if (req.cookies) {
    console.log('Cookies:', req.cookies);
    token = req.cookies.jwt;
    console.log('Token from cookies:', token);
  }

  // Extract token from Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Token from Authorization header:', token);
    }
  }

  // If no token is found, throw an error
  if (!token) {
    console.error('No token found in cookies or Authorization header');
    throw new ApiError(401, 'Not authorized, no token');
  }

  console.log('Extracted Token:', token);

  try {
    // Verify the token
    if (!config.jwtSecret) {
      throw new ApiError(500, 'JWT secret is not defined');
    }
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'Not authorized, user not found');
    }

    // Add user to request
    req.user = user as IUser & { _id: mongoose.Types.ObjectId };
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    throw new ApiError(401, 'Not authorized, token failed');
  }
});

// Admin middleware
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ApiError(403, 'Not authorized as an admin');
  }
};