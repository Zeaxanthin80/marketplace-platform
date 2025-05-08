import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// --- In-memory user store import (for testing only) ---
import { users as inMemoryUsers } from "../controllers/authController";

declare global {
  namespace Express {
    interface Request {
      user?: User & { roles: string[] };
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Authentication required" });

  console.log('Auth Middleware: Received token:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
    console.log('Auth Middleware: Decoded payload:', decoded);
    // In-memory user lookup
    const user = inMemoryUsers.find(u => u.id === decoded.userId);
    if (!user) {
      console.log('Auth Middleware: User not found for userId:', decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user as any;
    next();
  } catch (err) {
    console.error('Auth Middleware: JWT verification error:', err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.roles?.some((role: string) => roles.includes(role))) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};
