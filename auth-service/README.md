# Auth Service

Authentication and authorization microservice for the multi-vendor marketplace platform.

## Features
- User registration and login (JWT, OAuth2, optional 2FA)
- Role-based access control (buyer, seller, admin, courier)
- Secure password hashing (bcrypt)
- Extensible for additional auth providers

## Project Structure
```
auth-service/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── main.ts
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm test
   ```

## Environment Variables
Copy `.env.example` to `.env` and fill in the required values.

## License
MIT
