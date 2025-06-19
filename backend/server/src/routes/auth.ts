import { Router, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { createUser, authenticateUser, getUserById } from '../services/userService';
import { generateToken } from '../utils/auth';
import { CreateUserRequest, LoginRequest, AuthResponse } from '../models/User';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password }: CreateUserRequest = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    } as AuthResponse);
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    } as AuthResponse);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    } as AuthResponse);
  }

  try {
    const user = await createUser({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      user,
      token,
      message: 'Account created successfully'
    } as AuthResponse);
  } catch (error) {
    if (error instanceof Error && error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      } as AuthResponse);
    }
    throw error;
  }
}));

// Login user
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    } as AuthResponse);
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    } as AuthResponse);
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    user,
    token,
    message: 'Login successful'
  } as AuthResponse);
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    } as AuthResponse);
  }

  const user = await getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    } as AuthResponse);
  }

  res.status(200).json({
    success: true,
    user,
    message: 'User profile retrieved successfully'
  } as AuthResponse);
}));

// Logout (client-side token removal, but we can track it server-side if needed)
router.post('/logout', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // In a real app, you might want to blacklist the token
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  } as AuthResponse);
}));

export default router;