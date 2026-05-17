



// import mongoose from "mongoose";

// const medicineSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     type: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     category: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//     brand: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     description: {
//       type: String,
//       default: "",
//     },
//     expiryDate: {
//       type: Date,
//     },
//     prescriptionRequired: {
//       type: Boolean,
//       default: false,
//     },
//     images: {
//       type: [String],
//       default: [],
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// const Medicine = mongoose.model("Medicine", medicineSchema);

// export default Medicine;



import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    offer: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    expiryDate: {
      type: Date,
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;