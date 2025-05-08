import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";
import { register, login, updateProfile, changePassword, deleteProfile } from "../controllers/authController";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

// User management features
router.patch("/profile", authenticateJWT, updateProfile);
router.post("/change-password", authenticateJWT, changePassword);
router.delete("/profile", authenticateJWT, deleteProfile);

// Protected route example:
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route example:
router.get("/admin", authenticateJWT, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});

export default router;
