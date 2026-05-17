

// import Medicine from "../models/Medicine.js";

// export const createMedicineController = async (req, res) => {
//   try {
//     const {
//       name,
//       type,
//       category,
//       brand,
//       price,
//       stock,
//       description,
//       expiryDate,
//       prescriptionRequired,
//     } = req.body;

//     if (!name || !type || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, type and price are required",
//       });
//     }

//     const imagePaths = req.files ? req.files.map((file) => file.path) : [];

//     const medicine = await Medicine.create({
//       name,
//       type,
//       category,
//       brand,
//       price,
//       stock,
//       description,
//       expiryDate,
//       prescriptionRequired,
//       images: imagePaths,
//       createdBy: req.user._id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Medicine added successfully",
//       medicine,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Create medicine failed",
//       error: error.message,
//     });
//   }
// };

// export const getAllMedicinesController = async (req, res) => {
//   try {
//     const { keyword } = req.query;

//     let query = {};
//     if (keyword) {
//       query.name = { $regex: keyword, $options: "i" };
//     }

//     const medicines = await Medicine.find(query).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: medicines.length,
//       medicines,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch medicines failed",
//       error: error.message,
//     });
//   }
// };

// export const getSingleMedicineController = async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);

//     if (!medicine) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       medicine,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch single medicine failed",
//       error: error.message,
//     });
//   }
// };

// export const updateMedicineController = async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);

//     if (!medicine) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found",
//       });
//     }

//     const updatedData = {
//       ...req.body,
//     };

//     if (req.files && req.files.length > 0) {
//       updatedData.images = req.files.map((file) => file.path);
//     }

//     const updatedMedicine = await Medicine.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Medicine updated successfully",
//       medicine: updatedMedicine,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Update medicine failed",
//       error: error.message,
//     });
//   }
// };

// export const deleteMedicineController = async (req, res) => {
//   try {
//     const medicine = await Medicine.findById(req.params.id);

//     if (!medicine) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found",
//       });
//     }

//     await Medicine.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: "Medicine deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Delete medicine failed",
//       error: error.message,
//     });
//   }
// };


import Medicine from "../models/Medicine.js";

export const createMedicineController = async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      brand,
      mrp,
      stock,
      description,
      expiryDate,
      prescriptionRequired,
      offer,
    } = req.body;

    if (!name || !type || !mrp) {
      return res.status(400).json({
        success: false,
        message: "Name, type and MRP are required",
      });
    }

    // const imagePaths = req.files ? req.files.map((file) => file.path) : [];
    const imagePaths = req.files
  ? req.files.map((file) => file.path || file.secure_url)
  : [];

    const medicine = await Medicine.create({
      name,
      type,
      category,
      brand,
      mrp,
      offer,
      stock,
      description,
      expiryDate,
      prescriptionRequired,
      images: imagePaths,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create medicine failed",
      error: error.message,
    });
  }
};

export const getAllMedicinesController = async (req, res) => {
  try {
    const { keyword } = req.query;

    let query = {};

    if (keyword && keyword.trim()) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch medicines failed",
      error: error.message,
    });
  }
};

export const getSingleMedicineController = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch single medicine failed",
      error: error.message,
    });
  }
};

export const updateMedicineController = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const updatedData = { ...req.body };

    if (req.files && req.files.length > 0) {
      // updatedData.images = req.files.map((file) => file.path);
      updatedData.images = req.files.map(
  (file) => file.path || file.secure_url
);
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update medicine failed",
      error: error.message,
    });
  }
};

export const deleteMedicineController = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete medicine failed",
      error: error.message,
    });
  }
};