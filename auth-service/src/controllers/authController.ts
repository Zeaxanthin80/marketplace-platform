import { Request, Response } from "express";
import jwt, { Secret, SignOptions, VerifyOptions } from "jsonwebtoken";
import { User } from "../models/user";
import { hashPassword, validatePassword } from "../utils/hash";

function getJwtSecret(): Secret {
    const secret = process.env.JWT_SECRET || "default_secret";
    console.log('getJwtSecret() runtime JWT_SECRET:', secret);
    return secret;
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

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, roles = ["buyer"] } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists (in-memory)
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
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
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // In-memory user lookup
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
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
