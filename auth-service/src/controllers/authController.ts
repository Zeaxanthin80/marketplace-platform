import { Request, Response } from "express";
import jwt, { Secret, SignOptions, VerifyOptions } from "jsonwebtoken";
import { User } from "../models/user";
import { hashPassword, validatePassword } from "../utils/hash";

function getJwtSecret(): Secret {
    return process.env.JWT_SECRET || "default_secret";
}

// --- In-memory user store (for testing only) ---
export interface InMemoryUser {
  id: string;
  email: string;
  password: string;
  roles: string[];
}
export const users: InMemoryUser[] = [];

let nextId = 1;
// ----------------------------------------------

// PATCH /profile - update user email/roles
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as InMemoryUser | undefined;
    const userId = currentUser?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { email, roles } = req.body;
    if (email) user.email = email;
    if (roles && Array.isArray(roles)) user.roles = roles;
    res.json({ message: "Profile updated", user: { id: user.id, email: user.email, roles: user.roles } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /change-password - change user password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as InMemoryUser | undefined;
    const userId = currentUser?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current and new password required" });
    const isPasswordValid = await validatePassword(currentPassword, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
    user.password = await hashPassword(newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /profile - delete user account
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as InMemoryUser | undefined;
    const userId = currentUser?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx === -1) return res.status(404).json({ message: "User not found" });
    users.splice(userIdx, 1);
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const register = async (req: Request, res: Response) => {
  // No sensitive logs here

  try {
    const { email, password, roles = ["buyer"] } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists (in-memory)
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      // Hardened error message
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user (in-memory)
    const user: InMemoryUser = {
      id: String(nextId++),
      email,
      password: await hashPassword(password),
      roles
    };
    users.push(user);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  // No sensitive logs here

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // In-memory user lookup
    const user = users.find(u => u.email === email);
    if (!user) {
      // Hardened error message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      // Hardened error message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
