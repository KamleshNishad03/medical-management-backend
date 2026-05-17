import express from "express";
import {
  getMyNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
  getAdminNotificationsController,
  markAdminNotificationAsReadController,
  markAllAdminNotificationsAsReadController,
  deleteAdminNotificationController,
} from "../controllers/notificationController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// USER NOTIFICATION ROUTES
// =========================
router.get("/my", requireSignIn, getMyNotificationsController);
router.put("/:id/read", requireSignIn, markNotificationAsReadController);
router.put("/read-all", requireSignIn, markAllNotificationsAsReadController);
router.delete("/:id", requireSignIn, deleteNotificationController);

// =========================
// ADMIN NOTIFICATION ROUTES
// =========================
router.get("/admin", requireSignIn, isAdmin, getAdminNotificationsController);
router.put(
  "/admin/:id/read",
  requireSignIn,
  isAdmin,
  markAdminNotificationAsReadController
);
router.put(
  "/admin/read-all",
  requireSignIn,
  isAdmin,
  markAllAdminNotificationsAsReadController
);
router.delete(
  "/admin/:id",
  requireSignIn,
  isAdmin,
  deleteAdminNotificationController
);

export default router;