import Prescription from "../models/Prescription.js";

export const uploadPrescriptionController = async (req, res) => {
  try {
    const { note } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Prescription file is required",
      });
    }

    const prescription = await Prescription.create({
      user: req.user._id,
      image: req.file.path,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Prescription upload failed",
      error: error.message,
    });
  }
};

export const getAllPrescriptionsController = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("user", "name email phone")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch prescriptions failed",
      error: error.message,
    });
  }
};

export const reviewPrescriptionController = async (req, res) => {
  try {
    const { suggestedMedicines, adminComment, status } = req.body;

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    prescription.suggestedMedicines = suggestedMedicines || [];
    prescription.adminComment = adminComment || "";
    prescription.status = status || "Reviewed";
    prescription.reviewedBy = req.user._id;

    await prescription.save();

    res.status(200).json({
      success: true,
      message: "Prescription reviewed successfully",
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Prescription review failed",
      error: error.message,
    });
  }
};

export const getMyPrescriptionsController = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch my prescriptions failed",
      error: error.message,
    });
  }
};