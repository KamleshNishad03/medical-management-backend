import express from "express";
import {
  uploadPrescriptionController,
  getAllPrescriptionsController,
  reviewPrescriptionController,
  getMyPrescriptionsController,
} from "../controllers/prescriptionController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  requireSignIn,
  upload.single("prescription"),
  uploadPrescriptionController
);

router.get("/my", requireSignIn, getMyPrescriptionsController);

router.get("/all", requireSignIn, isAdmin, getAllPrescriptionsController);

router.put("/review/:id", requireSignIn, isAdmin, reviewPrescriptionController);

export default router;