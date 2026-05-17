



// import express from "express";
// import {
//   createMedicineController,
//   getAllMedicinesController,
//   getSingleMedicineController,
//   updateMedicineController,
//   deleteMedicineController,
// } from "../controllers/medicineController.js";
// import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
// import upload from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// router.get("/all", getAllMedicinesController);
// router.get("/:id", getSingleMedicineController);

// router.post(
//   "/create",
//   requireSignIn,
//   isAdmin,
//   upload.array("images", 3),
//   createMedicineController
// );

// router.put(
//   "/update/:id",
//   requireSignIn,
//   isAdmin,
//   upload.array("images", 3),
//   updateMedicineController
// );

// router.delete(
//   "/delete/:id",
//   requireSignIn,
//   isAdmin,
//   deleteMedicineController
// );

// export default router;




import express from "express";
import {
  createMedicineController,
  getAllMedicinesController,
  getSingleMedicineController,
  updateMedicineController,
  deleteMedicineController,
} from "../controllers/medicineController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/all", getAllMedicinesController);
router.get("/:id", getSingleMedicineController);

router.post(
  "/create",
  requireSignIn,
  isAdmin,
  upload.array("images", 5),
  createMedicineController
);

router.put(
  "/update/:id",
  requireSignIn,
  isAdmin,
  upload.array("images", 5),
  updateMedicineController
);

router.delete(
  "/delete/:id",
  requireSignIn,
  isAdmin,
  deleteMedicineController
);

export default router;