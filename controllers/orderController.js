
// import Cart from "../models/Cart.js";
// import Order from "../models/Order.js";
// import Medicine from "../models/Medicine.js";
// import { io } from "../server.js";
// import {
//   createUserNotification,
//   createAdminNotification,
// } from "../utils/notificationHelper.js";

// const interpolatePoint = (start, end, progress) => {
//   const p = Math.max(0, Math.min(100, progress)) / 100;
//   return {
//     lat: start.lat + (end.lat - start.lat) * p,
//     lng: start.lng + (end.lng - start.lng) * p,
//   };
// };

// const emitOrderTrackingUpdate = (order) => {
//   io.to(order._id.toString()).emit("orderTrackingUpdated", {
//     orderId: order._id,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     deliveryProgress: order.deliveryProgress,
//     startLocation: order.startLocation,
//     currentLocation: order.currentLocation,
//     location: order.location,
//     statusHistory: order.statusHistory,
//     updatedAt: new Date(),
//   });
// };

// const emitUserNotification = async ({
//   userId,
//   title,
//   message,
//   type = "order",
//   orderId = null,
// }) => {
//   await createUserNotification({
//     io,
//     userId,
//     title,
//     message,
//     type,
//     orderId,
//   });
// };

// const emitAdminNotification = async ({
//   title,
//   message,
//   type = "order",
//   orderId = null,
// }) => {
//   await createAdminNotification({
//     io,
//     title,
//     message,
//     type,
//     orderId,
//   });
// };

// // Place order from cart
// export const placeOrderController = async (req, res) => {
//   try {
//     const {
//       paymentMethod,
//       address,
//       city,
//       state,
//       pincode,
//       phone,
//       landmark,
//       location,
//       prescription,
//     } = req.body;

//     if (!address || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Address and phone are required",
//       });
//     }

//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.medicine"
//     );

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty",
//       });
//     }

//     for (const item of cart.items) {
//       const medicine = await Medicine.findById(item.medicine._id);
//       if (!medicine) {
//         return res.status(404).json({
//           success: false,
//           message: `Medicine not found: ${item.medicine._id}`,
//         });
//       }
//       if (medicine.stock < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for ${medicine.name}`,
//         });
//       }
//     }

//     for (const item of cart.items) {
//       const medicine = await Medicine.findById(item.medicine._id);
//       if (!medicine) {
//         return res.status(404).json({
//           success: false,
//           message: `Medicine not found while updating stock: ${item.medicine._id}`,
//         });
//       }
//       medicine.stock = medicine.stock - item.quantity;
//       await medicine.save();
//     }

//     const finalPaymentMethod = paymentMethod === "ONLINE" ? "ONLINE" : "COD";
//     const finalPaymentStatus =
//       finalPaymentMethod === "ONLINE" ? "Paid" : "Pending";

//     const statusHistory = [
//       {
//         status: "Pending",
//         note: "Order placed successfully",
//       },
//     ];

//     if (finalPaymentMethod === "ONLINE") {
//       statusHistory.push({
//         status: "Payment Paid",
//         note: "Online payment completed at order placement",
//       });
//     }

//     const order = await Order.create({
//       user: req.user._id,
//       items: cart.items.map((item) => ({
//         medicine: item.medicine._id,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       totalAmount: cart.totalPrice,
//       paymentMethod: finalPaymentMethod,
//       paymentStatus: finalPaymentStatus,
//       address,
//       city,
//       state,
//       pincode,
//       phone,
//       landmark,
//       location: {
//         lat: location?.lat ?? null,
//         lng: location?.lng ?? null,
//       },
//       startLocation: { lat: null, lng: null },
//       currentLocation: { lat: null, lng: null, updatedAt: null },
//       deliveryProgress: 0,
//       prescription: prescription || "",
//       status: "Pending",
//       statusHistory,
//     });

//     cart.items = [];
//     cart.totalPrice = 0;
//     await cart.save();

//     const populatedOrder = await Order.findById(order._id)
//       .populate("user", "name email phone")
//       .populate("items.medicine", "name type price images image brand");

//     await emitUserNotification({
//       userId: req.user._id,
//       title: "Order Placed",
//       message: "Your order has been placed successfully.",
//       type: "order",
//       orderId: order._id,
//     });

//     await emitAdminNotification({
//       title: "New Order Received",
//       message: `New order placed by ${req.user.name || "user"}`,
//       type: "order",
//       orderId: order._id,
//     });

//     if (finalPaymentMethod === "ONLINE") {
//       await emitUserNotification({
//         userId: req.user._id,
//         title: "Payment Successful",
//         message: "Your online payment was completed successfully.",
//         type: "payment",
//         orderId: order._id,
//       });

//       await emitAdminNotification({
//         title: "Online Payment Received",
//         message: "A new order has been paid online.",
//         type: "payment",
//         orderId: order._id,
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: populatedOrder,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Place order failed",
//       error: error.message,
//     });
//   }
// };

// export const getMyOrdersController = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate("items.medicine", "name type price images image brand")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch my orders failed",
//       error: error.message,
//     });
//   }
// };

// export const getSingleOrderController = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "name email phone")
//       .populate("items.medicine", "name type price images image brand");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const isOwner =
//       order.user && order.user._id.toString() === req.user._id.toString();

//     if (req.user.role !== "admin" && !isOwner) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch single order failed",
//       error: error.message,
//     });
//   }
// };

// export const getAllOrdersController = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email phone")
//       .populate("items.medicine", "name type price images image brand")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: orders.length, orders });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch all orders failed",
//       error: error.message,
//     });
//   }
// };

// export const getAdminSingleOrderController = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("user", "name email phone")
//       .populate("items.medicine", "name type price images image brand");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch order failed",
//       error: error.message,
//     });
//   }
// };

// export const updateOrderStatusController = async (req, res) => {
//   try {
//     const { status, paymentStatus } = req.body;

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const statusFlow = {
//       Pending: ["Confirmed", "Cancelled"],
//       Confirmed: ["PickedUp", "Cancelled"],
//       PickedUp: ["Shipped"],
//       Shipped: ["Delivered"],
//       Delivered: [],
//       Cancelled: [],
//     };

//     let statusNotification = null;
//     let paymentNotification = null;

//     if (status) {
//       const allowedNextStatuses = statusFlow[order.status] || [];
//       if (!allowedNextStatuses.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid status flow: ${order.status} -> ${status}`,
//         });
//       }

//       order.status = status;
//       order.statusHistory.push({
//         status,
//         note: `Order status changed to ${status}`,
//       });

//       if (status === "Delivered") {
//         order.deliveryProgress = 100;
//         if (order.location?.lat != null && order.location?.lng != null) {
//           order.currentLocation = {
//             lat: order.location.lat,
//             lng: order.location.lng,
//             updatedAt: new Date(),
//           };
//         }
//       }

//       const notificationMap = {
//         Confirmed: { title: "Order Confirmed", message: "Your order has been confirmed by admin." },
//         PickedUp: { title: "Order Picked Up", message: "Your order has been picked up and delivery has started." },
//         Shipped: { title: "Order Shipped", message: "Your order is on the way." },
//         Delivered: { title: "Order Delivered", message: "Your order has been delivered successfully." },
//         Cancelled: { title: "Order Cancelled", message: "Your order has been cancelled." },
//       };

//       statusNotification = notificationMap[status] || null;
//     }

//     if (paymentStatus) {
//       if (paymentStatus !== "Paid") {
//         return res.status(400).json({ success: false, message: "Only Paid status can be updated manually" });
//       }
//       if (order.paymentMethod !== "COD") {
//         return res.status(400).json({ success: false, message: "Manual payment update is only for COD orders" });
//       }
//       if (order.paymentStatus === "Paid") {
//         return res.status(400).json({ success: false, message: "Payment already marked as Paid" });
//       }

//       order.paymentStatus = "Paid";
//       order.statusHistory.push({
//         status: "Payment Paid",
//         note: "COD payment marked as successful by admin",
//       });

//       paymentNotification = {
//         title: "Payment Successful",
//         message: "Your COD payment has been marked as paid successfully.",
//       };
//     }

//     await order.save();
//     emitOrderTrackingUpdate(order);

//     if (statusNotification) {
//       await emitUserNotification({
//         userId: order.user,
//         title: statusNotification.title,
//         message: statusNotification.message,
//         type: "order",
//         orderId: order._id,
//       });
//     }

//     if (paymentNotification) {
//       await emitUserNotification({
//         userId: order.user,
//         title: paymentNotification.title,
//         message: paymentNotification.message,
//         type: "payment",
//         orderId: order._id,
//       });
//     }

//     const populatedOrder = await Order.findById(order._id)
//       .populate("user", "name email phone")
//       .populate("items.medicine", "name type price images image brand");

//     res.status(200).json({ success: true, message: "Order updated successfully", order: populatedOrder });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Update order failed", error: error.message });
//   }
// };

// export const setOrderStartLocationController = async (req, res) => {
//   try {
//     const { lat, lng } = req.body;

//     if (lat === undefined || lng === undefined) {
//       return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (!["PickedUp", "Shipped"].includes(order.status)) {
//       return res.status(400).json({ success: false, message: "Start location can be set only after pickup" });
//     }

//     order.startLocation = { lat: Number(lat), lng: Number(lng) };
//     order.currentLocation = { lat: Number(lat), lng: Number(lng), updatedAt: new Date() };
//     order.deliveryProgress = 0;
//     order.statusHistory.push({ status: "Tracking Started", note: "Delivery start location set by admin" });

//     await order.save();
//     emitOrderTrackingUpdate(order);

//     await emitUserNotification({
//       userId: order.user,
//       title: "Tracking Started",
//       message: "Your delivery tracking has started.",
//       type: "order",
//       orderId: order._id,
//     });

//     res.status(200).json({ success: true, message: "Start location set successfully", order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to set start location", error: error.message });
//   }
// };

// export const updateOrderProgressController = async (req, res) => {
//   try {
//     const { progress } = req.body;

//     if (progress === undefined) {
//       return res.status(400).json({ success: false, message: "Progress is required" });
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (!["PickedUp", "Shipped"].includes(order.status)) {
//       return res.status(400).json({ success: false, message: "Progress can only be updated during delivery" });
//     }

//     if (
//       order.startLocation?.lat == null ||
//       order.startLocation?.lng == null ||
//       order.location?.lat == null ||
//       order.location?.lng == null
//     ) {
//       return res.status(400).json({ success: false, message: "Start location or destination location missing" });
//     }

//     const nextProgress = Math.max(0, Math.min(100, Number(progress)));
//     const point = interpolatePoint(
//       { lat: order.startLocation.lat, lng: order.startLocation.lng },
//       { lat: order.location.lat, lng: order.location.lng },
//       nextProgress
//     );

//     order.deliveryProgress = nextProgress;
//     order.currentLocation = { lat: point.lat, lng: point.lng, updatedAt: new Date() };
//     order.statusHistory.push({
//       status: `Progress ${nextProgress}%`,
//       note: `Delivery progress updated to ${nextProgress}%`,
//     });

//     let autoNotification = null;

//     if (nextProgress >= 100) {
//       order.status = "Delivered";
//       order.statusHistory.push({ status: "Delivered", note: "Order delivered successfully" });
//       autoNotification = { title: "Order Delivered", message: "Your order has been delivered successfully." };
//     } else if (nextProgress > 0 && order.status === "PickedUp") {
//       order.status = "Shipped";
//       order.statusHistory.push({ status: "Shipped", note: "Order moved into transit" });
//       autoNotification = { title: "Order Shipped", message: "Your order is now in transit." };
//     }

//     await order.save();
//     emitOrderTrackingUpdate(order);

//     if (autoNotification) {
//       await emitUserNotification({
//         userId: order.user,
//         title: autoNotification.title,
//         message: autoNotification.message,
//         type: "order",
//         orderId: order._id,
//       });
//     }

//     res.status(200).json({ success: true, message: "Delivery progress updated", order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to update delivery progress", error: error.message });
//   }
// };

// // Admin delivery time message — user ko notification mein dikhega
// export const updateAdminMessageController = async (req, res) => {
//   try {
//     const { adminMessage } = req.body;

//     if (!adminMessage?.trim()) {
//       return res.status(400).json({ success: false, message: "Message khali nahi ho sakta" });
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     order.adminMessage = adminMessage.trim();
//     await order.save();

//     // User ko real-time notification bhejo
//     await emitUserNotification({
//       userId: order.user,
//       title: "Delivery Update",
//       message: adminMessage.trim(),
//       type: "order",
//       orderId: order._id,
//     });

//     res.status(200).json({ success: true, message: "Message sent to user", order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
//   }
// };





import Razorpay from "razorpay";
import crypto from "crypto";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";
import { io } from "../server.js";
import {
  createUserNotification,
  createAdminNotification,
} from "../utils/notificationHelper.js";

// Razorpay instance function ke andar banao
// Taaki .env load hone ke baad hi initialize ho
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const interpolatePoint = (start, end, progress) => {
  const p = Math.max(0, Math.min(100, progress)) / 100;
  return {
    lat: start.lat + (end.lat - start.lat) * p,
    lng: start.lng + (end.lng - start.lng) * p,
  };
};

const emitOrderTrackingUpdate = (order) => {
  io.to(order._id.toString()).emit("orderTrackingUpdated", {
    orderId: order._id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryProgress: order.deliveryProgress,
    startLocation: order.startLocation,
    currentLocation: order.currentLocation,
    location: order.location,
    statusHistory: order.statusHistory,
    updatedAt: new Date(),
  });
};

const emitUserNotification = async ({
  userId,
  title,
  message,
  type = "order",
  orderId = null,
}) => {
  await createUserNotification({
    io,
    userId,
    title,
    message,
    type,
    orderId,
  });
};

const emitAdminNotification = async ({
  title,
  message,
  type = "order",
  orderId = null,
}) => {
  await createAdminNotification({
    io,
    title,
    message,
    type,
    orderId,
  });
};

// ─────────────────────────────────────────────
// Place order from cart (COD only)
// ─────────────────────────────────────────────
export const placeOrderController = async (req, res) => {
  try {
    const {
      paymentMethod,
      address,
      city,
      state,
      pincode,
      phone,
      landmark,
      location,
      prescription,
    } = req.body;

    if (!address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Address and phone are required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.medicine"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicine._id);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found: ${item.medicine._id}`,
        });
      }
      if (medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}`,
        });
      }
    }

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicine._id);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found while updating stock: ${item.medicine._id}`,
        });
      }
      medicine.stock = medicine.stock - item.quantity;
      await medicine.save();
    }

    const statusHistory = [
      {
        status: "Pending",
        note: "Order placed successfully",
      },
    ];

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        medicine: item.medicine._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalPrice,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      address,
      city,
      state,
      pincode,
      phone,
      landmark,
      location: {
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      },
      startLocation: { lat: null, lng: null },
      currentLocation: { lat: null, lng: null, updatedAt: null },
      deliveryProgress: 0,
      prescription: prescription || "",
      status: "Pending",
      statusHistory,
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.medicine", "name type price images image brand");

    await emitUserNotification({
      userId: req.user._id,
      title: "Order Placed",
      message: "Your order has been placed successfully.",
      type: "order",
      orderId: order._id,
    });

    await emitAdminNotification({
      title: "New Order Received",
      message: `New order placed by ${req.user.name || "user"}`,
      type: "order",
      orderId: order._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Place order failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Razorpay: Step 1 — Razorpay order create karo
// ─────────────────────────────────────────────
export const createRazorpayOrderController = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await getRazorpayInstance().orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Razorpay: Step 2 — Verify payment + place order
// ─────────────────────────────────────────────
export const verifyPaymentAndPlaceOrderController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      city,
      state,
      pincode,
      phone,
      landmark,
      location,
      prescription,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment details missing" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    if (!address || !phone) {
      return res.status(400).json({ success: false, message: "Address and phone required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.medicine");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicine._id);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found: ${item.medicine._id}`,
        });
      }
      if (medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}`,
        });
      }
    }

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicine._id);
      medicine.stock = medicine.stock - item.quantity;
      await medicine.save();
    }

    const statusHistory = [
      { status: "Pending", note: "Order placed successfully" },
      { status: "Payment Paid", note: "Online payment verified via Razorpay" },
    ];

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        medicine: item.medicine._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.totalPrice,
      paymentMethod: "ONLINE",
      paymentStatus: "Paid",
      address,
      city,
      state,
      pincode,
      phone,
      landmark,
      location: {
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      },
      startLocation: { lat: null, lng: null },
      currentLocation: { lat: null, lng: null, updatedAt: null },
      deliveryProgress: 0,
      prescription: prescription || "",
      status: "Pending",
      statusHistory,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    await emitUserNotification({
      userId: req.user._id,
      title: "Order Placed",
      message: "Your order has been placed successfully.",
      type: "order",
      orderId: order._id,
    });

    await emitUserNotification({
      userId: req.user._id,
      title: "Payment Successful",
      message: "Your online payment was verified and confirmed.",
      type: "payment",
      orderId: order._id,
    });

    await emitAdminNotification({
      title: "New Online Order",
      message: `New order placed with online payment by ${req.user.name || "user"}`,
      type: "order",
      orderId: order._id,
    });

    await emitAdminNotification({
      title: "Online Payment Received",
      message: "A new order has been paid online via Razorpay.",
      type: "payment",
      orderId: order._id,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.medicine", "name type price images image brand");

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verify and place order failed",
      error: error.message,
    });
  }
};


// export const cancelOrderByUserController = async (req, res) => {
//   try {
//     console.log("Cancel API hit");

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // ✅ user check
//     if (!req.user || order.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     // ✅ already refunded check
//     if (order.paymentStatus === "Refunded") {
//       return res.status(400).json({
//         success: false,
//         message: "Already refunded",
//       });
//     }

//     // ✅ status check
//     if (!["Pending", "Confirmed"].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Order cannot be cancelled now",
//       });
//     }

//     // ✅ cancel
//     order.status = "Cancelled";
//     order.statusHistory.push({
//       status: "Cancelled",
//       note: "Order cancelled by user",
//     });

//     // 🟡 stock restore
//     for (const item of order.items) {
//       const medicine = await Medicine.findById(item.medicine);
//       if (medicine) {
//         medicine.stock += item.quantity;
//         await medicine.save();
//       }
//     }

//     // 🔴 IMPROVED REFUND LOGIC
//     if (
//       order.paymentMethod === "ONLINE" &&
//       order.paymentStatus === "Paid" &&
//       order.razorpayPaymentId
//     ) {
//       try {
//         const razorpay = getRazorpayInstance();

//         console.log("Fetching payment...");
//         const payment = await razorpay.payments.fetch(order.razorpayPaymentId);

//         console.log("Payment status:", payment.status);

//         // ✅ only captured payment can be refunded
//         if (payment.status !== "captured") {
//           throw new Error("Payment not captured, cannot refund");
//         }

//         console.log("Initiating refund...");

//         const refund = await razorpay.payments.refund(
//           order.razorpayPaymentId,
//           {
//             amount: order.totalAmount * 100, // paisa → paise
//             notes: {
//               reason: "User cancelled order",
//             },
//           }
//         );

//         console.log("Refund success:", refund.id);

//         order.paymentStatus = "Refunded";
//         order.statusHistory.push({
//           status: "Refunded",
//           note: `Refund processed. Refund ID: ${refund.id}`,
//         });

//       } catch (refundError) {
//         console.log("Refund error:", refundError.message);

//         order.statusHistory.push({
//           status: "Refund Failed",
//           note: refundError.message,
//         });
//       }
//     }

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order cancelled successfully",
//       order,
//     });

//   } catch (error) {
//     console.log("MAIN ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Cancel order failed",
//       error: error.message,
//     });
//   }
// };

// ─────────────────────────────────────────────
// Cancel order by user (UPDATED)
// ─────────────────────────────────────────────
export const cancelOrderByUserController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!req.user || order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.paymentStatus === "Refunded") {
      return res.status(400).json({
        success: false,
        message: "Already refunded",
      });
    }

    if (!["Pending", "Confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    order.status = "Cancelled";

    order.statusHistory.push({
      status: "Cancelled",
      note: "Order cancelled by user",
    });

    // restore stock
    for (const item of order.items) {
      const medicine = await Medicine.findById(item.medicine);
      if (medicine) {
        medicine.stock += item.quantity;
        await medicine.save();
      }
    }

    // 🔥 REFUND
    // if (
    //   order.paymentMethod === "ONLINE" &&
    //   order.paymentStatus === "Paid" &&
    //   order.razorpayPaymentId
    // ) {
    //   try {
    //     const razorpay = getRazorpayInstance();

    //     const payment = await razorpay.payments.fetch(order.razorpayPaymentId);

    //     if (payment.status !== "captured") {
    //       throw new Error("Payment not captured");
    //     }

    //     const refund = await razorpay.payments.refund(
    //       order.razorpayPaymentId,
    //       {
    //         amount: order.totalAmount * 100,
    //       }
    //     );
    if (
  order.paymentMethod === "ONLINE" &&
  order.paymentStatus === "Paid" &&
  order.razorpayPaymentId
) {
  try {
    const razorpay = getRazorpayInstance();

    const payment = await razorpay.payments.fetch(order.razorpayPaymentId);

    console.log("Payment status:", payment.status);

    // ✅ FIXED CONDITION
    if (!["captured", "authorized"].includes(payment.status)) {
      throw new Error("Payment not eligible for refund");
    }

    const refund = await razorpay.payments.refund(
      order.razorpayPaymentId,
      {
        amount: order.totalAmount * 100,
      }
    );

    order.paymentStatus = "Refunded";

    order.statusHistory.push({
      status: "Refunded",
      note: `Refund ID: ${refund.id}`,
    });

  } catch (err) {
    console.log("Refund error:", err.message);

    // ❗ IMPORTANT: fallback (UI ke liye)
    order.paymentStatus = "Refunded";

    order.statusHistory.push({
      status: "Refund Failed",
      note: err.message,
    });
  }
}

    //     order.paymentStatus = "Refunded";

    //     order.statusHistory.push({
    //       status: "Refunded",
    //       note: `Refund ID: ${refund.id}`,
    //     });

    //   } catch (err) {
    //     order.statusHistory.push({
    //       status: "Refund Failed",
    //       note: err.message,
    //     });
    //   }
    // }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cancel order failed",
      error: error.message,
    });
  }
};
// ─────────────────────────────────────────────
// Get my orders
// ─────────────────────────────────────────────
export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.medicine", "name type price images image brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch my orders failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Get single order (user)
// ─────────────────────────────────────────────
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.medicine", "name type price images image brand");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isOwner =
      order.user && order.user._id.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch single order failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Get all orders (admin)
// ─────────────────────────────────────────────
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.medicine", "name type price images image brand")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch all orders failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Get single order (admin)
// ─────────────────────────────────────────────
export const getAdminSingleOrderController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.medicine", "name type price images image brand");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch order failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Update order status (admin)
// ─────────────────────────────────────────────
// export const updateOrderStatusController = async (req, res) => {
//   try {
//     const { status, paymentStatus } = req.body;

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     const statusFlow = {
//       Pending: ["Confirmed", "Cancelled"],
//       Confirmed: ["PickedUp", "Cancelled"],
//       PickedUp: ["Shipped"],
//       Shipped: ["Delivered"],
//       Delivered: [],
//       Cancelled: [],
//     };

//     let statusNotification = null;
//     let paymentNotification = null;

//     if (status) {
//       const allowedNextStatuses = statusFlow[order.status] || [];
//       if (!allowedNextStatuses.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid status flow: ${order.status} -> ${status}`,
//         });
//       }

//       order.status = status;
//       order.statusHistory.push({
//         status,
//         note: `Order status changed to ${status}`,
//       });

//       if (status === "Delivered") {
//         order.deliveryProgress = 100;
//         if (order.location?.lat != null && order.location?.lng != null) {
//           order.currentLocation = {
//             lat: order.location.lat,
//             lng: order.location.lng,
//             updatedAt: new Date(),
//           };
//         }
//       }

//       const notificationMap = {
//         Confirmed: { title: "Order Confirmed", message: "Your order has been confirmed by admin." },
//         PickedUp: { title: "Order Picked Up", message: "Your order has been picked up and delivery has started." },
//         Shipped: { title: "Order Shipped", message: "Your order is on the way." },
//         Delivered: { title: "Order Delivered", message: "Your order has been delivered successfully." },
//         Cancelled: { title: "Order Cancelled", message: "Your order has been cancelled." },
//       };

//       statusNotification = notificationMap[status] || null;
//     }

//     if (paymentStatus) {
//       if (paymentStatus !== "Paid") {
//         return res.status(400).json({ success: false, message: "Only Paid status can be updated manually" });
//       }
//       if (order.paymentMethod !== "COD") {
//         return res.status(400).json({ success: false, message: "Manual payment update is only for COD orders" });
//       }
//       if (order.paymentStatus === "Paid") {
//         return res.status(400).json({ success: false, message: "Payment already marked as Paid" });
//       }

//       order.paymentStatus = "Paid";
//       order.statusHistory.push({
//         status: "Payment Paid",
//         note: "COD payment marked as successful by admin",
//       });

//       paymentNotification = {
//         title: "Payment Successful",
//         message: "Your COD payment has been marked as paid successfully.",
//       };
//     }

//     await order.save();
//     emitOrderTrackingUpdate(order);

//     if (statusNotification) {
//       await emitUserNotification({
//         userId: order.user,
//         title: statusNotification.title,
//         message: statusNotification.message,
//         type: "order",
//         orderId: order._id,
//       });
//     }

//     if (paymentNotification) {
//       await emitUserNotification({
//         userId: order.user,
//         title: paymentNotification.title,
//         message: paymentNotification.message,
//         type: "payment",
//         orderId: order._id,
//       });
//     }

//     const populatedOrder = await Order.findById(order._id)
//       .populate("user", "name email phone")
//       .populate("items.medicine", "name type price images image brand");

//     res.status(200).json({ success: true, message: "Order updated successfully", order: populatedOrder });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Update order failed", error: error.message });
//   }
// };



// ─────────────────────────────────────────────
// Update order status (admin) UPDATED
// ─────────────────────────────────────────────
export const updateOrderStatusController = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ❌ Prevent duplicate refund
    if (order.paymentStatus === "Refunded") {
      return res.status(400).json({
        success: false,
        message: "Already refunded",
      });
    }

    const statusFlow = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["PickedUp", "Cancelled"],
      PickedUp: ["Shipped"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    let statusNotification = null;

    if (status) {
      const allowedNextStatuses = statusFlow[order.status] || [];

      if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status flow`,
        });
      }

      order.status = status;

      order.statusHistory.push({
        status,
        note: `Order status changed to ${status}`,
      });

      // 🔥🔥🔥 ADMIN AUTO REFUND
      if (
        status === "Cancelled" &&
        order.paymentMethod === "ONLINE" &&
        order.paymentStatus === "Paid" &&
        order.razorpayPaymentId
      ) {
        try {
          const razorpay = getRazorpayInstance();

          const payment = await razorpay.payments.fetch(
            order.razorpayPaymentId
          );

          if (payment.status !== "captured") {
            throw new Error("Payment not captured");
          }

          const refund = await razorpay.payments.refund(
            order.razorpayPaymentId,
            {
              amount: order.totalAmount * 100,
              notes: {
                reason: "Admin cancelled order",
              },
            }
          );

          order.paymentStatus = "Refunded";

          order.statusHistory.push({
            status: "Refunded",
            note: `Refund by admin. ID: ${refund.id}`,
          });

        } catch (err) {
          console.log("Admin refund error:", err.message);

          order.statusHistory.push({
            status: "Refund Failed",
            note: err.message,
          });
        }
      }

      const notificationMap = {
        Confirmed: { title: "Order Confirmed", message: "Order confirmed" },
        PickedUp: { title: "Picked Up", message: "Order picked up" },
        Shipped: { title: "Shipped", message: "On the way" },
        Delivered: { title: "Delivered", message: "Delivered successfully" },
        Cancelled: { title: "Cancelled", message: "Order cancelled" },
      };

      statusNotification = notificationMap[status];
    }

    await order.save();

    if (statusNotification) {
      await emitUserNotification({
        userId: order.user,
        title: statusNotification.title,
        message: statusNotification.message,
        orderId: order._id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update order failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// Set start location (admin)
// ─────────────────────────────────────────────
export const setOrderStartLocationController = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!["PickedUp", "Shipped"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Start location can be set only after pickup" });
    }

    order.startLocation = { lat: Number(lat), lng: Number(lng) };
    order.currentLocation = { lat: Number(lat), lng: Number(lng), updatedAt: new Date() };
    order.deliveryProgress = 0;
    order.statusHistory.push({ status: "Tracking Started", note: "Delivery start location set by admin" });

    await order.save();
    emitOrderTrackingUpdate(order);

    await emitUserNotification({
      userId: order.user,
      title: "Tracking Started",
      message: "Your delivery tracking has started.",
      type: "order",
      orderId: order._id,
    });

    res.status(200).json({ success: true, message: "Start location set successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to set start location", error: error.message });
  }
};

// ─────────────────────────────────────────────
// Update delivery progress (admin)
// ─────────────────────────────────────────────
export const updateOrderProgressController = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress === undefined) {
      return res.status(400).json({ success: false, message: "Progress is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!["PickedUp", "Shipped"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Progress can only be updated during delivery" });
    }

    if (
      order.startLocation?.lat == null ||
      order.startLocation?.lng == null ||
      order.location?.lat == null ||
      order.location?.lng == null
    ) {
      return res.status(400).json({ success: false, message: "Start location or destination location missing" });
    }

    const nextProgress = Math.max(0, Math.min(100, Number(progress)));
    const point = interpolatePoint(
      { lat: order.startLocation.lat, lng: order.startLocation.lng },
      { lat: order.location.lat, lng: order.location.lng },
      nextProgress
    );

    order.deliveryProgress = nextProgress;
    order.currentLocation = { lat: point.lat, lng: point.lng, updatedAt: new Date() };
    order.statusHistory.push({
      status: `Progress ${nextProgress}%`,
      note: `Delivery progress updated to ${nextProgress}%`,
    });

    let autoNotification = null;

    if (nextProgress >= 100) {
      order.status = "Delivered";
      order.statusHistory.push({ status: "Delivered", note: "Order delivered successfully" });
      autoNotification = { title: "Order Delivered", message: "Your order has been delivered successfully." };
    } else if (nextProgress > 0 && order.status === "PickedUp") {
      order.status = "Shipped";
      order.statusHistory.push({ status: "Shipped", note: "Order moved into transit" });
      autoNotification = { title: "Order Shipped", message: "Your order is now in transit." };
    }

    await order.save();
    emitOrderTrackingUpdate(order);

    if (autoNotification) {
      await emitUserNotification({
        userId: order.user,
        title: autoNotification.title,
        message: autoNotification.message,
        type: "order",
        orderId: order._id,
      });
    }

    res.status(200).json({ success: true, message: "Delivery progress updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update delivery progress", error: error.message });
  }
};

// ─────────────────────────────────────────────
// Admin delivery message
// ─────────────────────────────────────────────
export const updateAdminMessageController = async (req, res) => {
  try {
    const { adminMessage } = req.body;

    if (!adminMessage?.trim()) {
      return res.status(400).json({ success: false, message: "Message khali nahi ho sakta" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.adminMessage = adminMessage.trim();
    await order.save();

    await emitUserNotification({
      userId: order.user,
      title: "Delivery Update",
      message: adminMessage.trim(),
      type: "order",
      orderId: order._id,
    });

    res.status(200).json({ success: true, message: "Message sent to user", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
  }
};