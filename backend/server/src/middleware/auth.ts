import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};