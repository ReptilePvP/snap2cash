import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserRequest } from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth';

// In-memory storage for demo purposes
// In production, use a proper database like PostgreSQL, MongoDB, etc.
const users: User[] = [];

export const createUser = async (userData: CreateUserRequest): Promise<Omit<User, 'password'>> => {
  // Check if user already exists
  const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Create user
  const newUser: User = {
    id: uuidv4(),
    email: userData.email.toLowerCase(),
    name: userData.name,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const authenticateUser = async (email: string, password: string): Promise<Omit<User, 'password'> | null> => {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.password) {
    return null;
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
  const user = users.find(u => u.id === id);
  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserByEmail = async (email: string): Promise<Omit<User, 'password'> | null> => {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};