



// import express from "express";
// import {
//   placeOrderController,
//   getMyOrdersController,
//   getAllOrdersController,
//   updateOrderStatusController,
//   getAdminSingleOrderController,
//   setOrderStartLocationController,
//   updateOrderProgressController,
//   getSingleOrderController,
//   updateAdminMessageController,
// } from "../controllers/orderController.js";
// import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* =========================
//    USER ROUTES
// ========================= */
// router.post("/place", requireSignIn, placeOrderController);
// router.get("/my", requireSignIn, getMyOrdersController);
// router.get("/:id", requireSignIn, getSingleOrderController);

// /* =========================
//    ADMIN ROUTES
// ========================= */
// router.get("/admin/all", requireSignIn, isAdmin, getAllOrdersController);
// router.get("/admin/:id", requireSignIn, isAdmin, getAdminSingleOrderController);
// router.put("/admin/status/:id", requireSignIn, isAdmin, updateOrderStatusController);
// router.put("/admin/start-location/:id", requireSignIn, isAdmin, setOrderStartLocationController);
// router.put("/admin/progress/:id", requireSignIn, isAdmin, updateOrderProgressController);
// router.put("/admin/message/:id", requireSignIn, isAdmin, updateAdminMessageController);

// export default router;





import express from "express";
import {
  placeOrderController,
  getMyOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
  getAdminSingleOrderController,
  setOrderStartLocationController,
  updateOrderProgressController,
  getSingleOrderController,
  updateAdminMessageController,
  createRazorpayOrderController,
  verifyPaymentAndPlaceOrderController,
} from "../controllers/orderController.js";
import {
  cancelOrderByUserController,
} from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   USER ROUTES
========================= */
router.post("/place", requireSignIn, placeOrderController);
router.get("/my", requireSignIn, getMyOrdersController);
router.put("/cancel-order/:id", requireSignIn, cancelOrderByUserController);

// Razorpay payment routes
router.post("/payment/create", requireSignIn, createRazorpayOrderController);
router.post("/payment/verify", requireSignIn, verifyPaymentAndPlaceOrderController);

router.get("/:id", requireSignIn, getSingleOrderController);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/admin/all", requireSignIn, isAdmin, getAllOrdersController);
router.get("/admin/:id", requireSignIn, isAdmin, getAdminSingleOrderController);
router.put("/admin/status/:id", requireSignIn, isAdmin, updateOrderStatusController);
router.put("/admin/start-location/:id", requireSignIn, isAdmin, setOrderStartLocationController);
router.put("/admin/progress/:id", requireSignIn, isAdmin, updateOrderProgressController);
router.put("/admin/message/:id", requireSignIn, isAdmin, updateAdminMessageController);

export default router;