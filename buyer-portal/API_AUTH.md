# Buyer Portal API Authentication Guide

## Overview
This document describes how to register, log in, and authenticate with the Buyer Portal API using JWT-based authentication.

---

## 1. Register a New User
- **Endpoint:** `POST /api/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `201 Created` with `{ "token": "<JWT>" }` on success.
  - Error codes: `400`, `409` (see below).

### Registration Error Codes
- `400`: Missing or invalid fields, invalid email, or password too short.
- `409`: User already exists.

---

## 2. Log In
- **Endpoint:** `POST /api/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK` with `{ "token": "<JWT>" }` on success.
  - Error codes: `400`, `401` (see below).

### Login Error Codes
- `400`: Missing fields or invalid types.
- `401`: Invalid credentials.

---

## 3. Authenticating Requests
- For all protected endpoints (products, cart, orders), include the JWT in the `Authorization` header:
  ```http
  Authorization: Bearer <JWT>
  ```
- Example with `curl`:
  ```sh
  curl -H "Authorization: Bearer <JWT>" http://localhost:3000/api/products
  ```

---

## 4. Example Error Responses
```json
{
  "message": "Email and password required"
}
{
  "message": "Invalid credentials"
}
{
  "message": "User already exists"
}
```

---

## 5. Notes
- Passwords are stored in memory in plain text for demo purposes. **Do not use for production!**
- JWTs are signed with the secret in your `.env` (`JWT_SECRET`).
- For full API usage, see the main README and endpoint-specific documentation.
