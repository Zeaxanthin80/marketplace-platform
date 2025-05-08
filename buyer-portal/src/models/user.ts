export interface User {
  id: string;
  email: string;
  password: string; // In production, hash this!
}

// In-memory user store
export const users: Record<string, User> = {};

export function findUserByEmail(email: string): User | undefined {
  return Object.values(users).find((u) => u.email === email);
}

export function addUser(user: User): void {
  users[user.id] = user;
}
