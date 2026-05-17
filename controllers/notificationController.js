import Notification from "../models/Notification.js";

// =========================
// USER NOTIFICATIONS
// =========================
export const getMyNotificationsController = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientType: "user",
      user: req.user._id,
    })
      .populate("order", "status paymentStatus totalAmount")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipientType: "user",
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const markNotificationAsReadController = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipientType: "user",
        user: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

export const markAllNotificationsAsReadController = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipientType: "user",
        user: req.user._id,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipientType: "user",
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// =========================
// ADMIN NOTIFICATIONS
// =========================
export const getAdminNotificationsController = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientType: "admin",
    })
      .populate("order", "status paymentStatus totalAmount address city phone")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipientType: "admin",
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin notifications",
      error: error.message,
    });
  }
};

export const markAdminNotificationAsReadController = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipientType: "admin",
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Admin notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update admin notification",
      error: error.message,
    });
  }
};

export const markAllAdminNotificationsAsReadController = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipientType: "admin",
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All admin notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all admin notifications as read",
      error: error.message,
    });
  }
};

export const deleteAdminNotificationController = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipientType: "admin",
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Admin notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete admin notification",
      error: error.message,
    });
  }
};