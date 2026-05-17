import Notification from "../models/Notification.js";

export const createUserNotification = async ({
  io,
  userId,
  title,
  message,
  type = "order",
  orderId = null,
  meta = {},
}) => {
  try {
    const notification = await Notification.create({
      recipientType: "user",
      user: userId,
      title,
      message,
      type,
      order: orderId,
      meta,
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate("order", "status paymentStatus totalAmount")
      .lean();

    if (io) {
      io.to(`user_${userId}`).emit("newNotification", populatedNotification);
    }

    return populatedNotification;
  } catch (error) {
    console.error("Create User Notification Error:", error.message);
    return null;
  }
};

export const createAdminNotification = async ({
  io,
  title,
  message,
  type = "order",
  orderId = null,
  meta = {},
}) => {
  try {
    const notification = await Notification.create({
      recipientType: "admin",
      title,
      message,
      type,
      order: orderId,
      meta,
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate("order", "status paymentStatus totalAmount address city phone")
      .lean();

    if (io) {
      io.to("admin_global").emit("newAdminNotification", populatedNotification);
    }

    return populatedNotification;
  } catch (error) {
    console.error("Create Admin Notification Error:", error.message);
    return null;
  }
};