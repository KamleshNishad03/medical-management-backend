import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  addToCartController,
  getMyCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", requireSignIn, addToCartController);
router.get("/my", requireSignIn, getMyCartController);
router.put("/update", requireSignIn, updateCartItemController);
router.delete("/remove/:medicineId", requireSignIn, removeCartItemController);
router.delete("/clear", requireSignIn, clearCartController);

export default router;