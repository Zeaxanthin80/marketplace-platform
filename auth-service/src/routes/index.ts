import { Router } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth";
import { register, login } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected route example:
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route example:
router.get("/admin", authenticateJWT, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});

export default router;
