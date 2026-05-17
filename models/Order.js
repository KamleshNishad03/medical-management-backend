

// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD", "ONLINE"],
//       default: "COD",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid"],
//       default: "Pending",
//     },

//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     city: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     state: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     pincode: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     phone: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     landmark: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     // customer delivery location
//     location: {
//       lat: {
//         type: Number,
//         default: null,
//       },
//       lng: {
//         type: Number,
//         default: null,
//       },
//     },

//     // admin pickup / start point
//     startLocation: {
//       lat: {
//         type: Number,
//         default: null,
//       },
//       lng: {
//         type: Number,
//         default: null,
//       },
//     },

//     // moving marker current position
//     currentLocation: {
//       lat: {
//         type: Number,
//         default: null,
//       },
//       lng: {
//         type: Number,
//         default: null,
//       },
//       updatedAt: {
//         type: Date,
//         default: null,
//       },
//     },

//     // 0 to 100
//     deliveryProgress: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 100,
//     },

//     prescription: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Confirmed",
//         "PickedUp",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//       ],
//       default: "Pending",
//     },

//     statusHistory: [
//       {
//         status: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         note: {
//           type: String,
//           default: "",
//           trim: true,
//         },
//         changedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;





// 2nd check


// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: [
//       {
//         medicine: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Medicine",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD", "ONLINE"],
//       default: "COD",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid"],
//       default: "Pending",
//     },

//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     city: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     state: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     pincode: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     phone: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     landmark: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     // customer delivery location
//     location: {
//       lat: {
//         type: Number,
//         default: null,
//       },
//       lng: {
//         type: Number,
//         default: null,
//       },
//     },

//     // admin pickup / start point
//     startLocation: {
//       lat: {
//         type: Number,
//         default: null,
//       },
//       lng: {
//         type: Number,
//         default: null,
//       },
//     },

//     // moving marker current position
//     currentLocation: {
//       lat: {
//         type: Number,
//         default: null,
//       },
//       lng: {
//         type: Number,
//         default: null,
//       },
//       updatedAt: {
//         type: Date,
//         default: null,
//       },
//     },

//     // 0 to 100
//     deliveryProgress: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 100,
//     },

//     prescription: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Confirmed",
//         "PickedUp",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//       ],
//       default: "Pending",
//     },

//     statusHistory: [
//       {
//         status: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         note: {
//           type: String,
//           default: "",
//           trim: true,
//         },
//         changedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],

//     // admin delivery time message — user ko notification mein dikhega
//     adminMessage: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;






import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // 💳 Payment Method
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    // 💰 Payment Status (UPDATED)
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "RefundFailed"],
      default: "Pending",
    },

    // 🔑 Razorpay Tracking
    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    razorpayRefundId: {
      type: String,
      default: "",
    },

    // 📍 Address Info
    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    // 📍 Customer location
    location: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    // 🚚 Admin start location
    startLocation: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    // 🚗 Live tracking location
    currentLocation: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },

    // 📊 Delivery progress
    deliveryProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 📄 Prescription
    prescription: {
      type: String,
      default: "",
    },

    // 📦 Order Status
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "PickedUp",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // 📜 Status History
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
          trim: true,
        },
        note: {
          type: String,
          default: "",
          trim: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🧑‍💼 Admin message
    adminMessage: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;