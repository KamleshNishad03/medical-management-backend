// import Cart from "../models/Cart.js";
// import Medicine from "../models/Medicine.js";

// const calculateTotalPrice = (items) => {
//   return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
// };

// // Add to cart
// export const addToCartController = async (req, res) => {
//   try {
//     const { medicineId, quantity } = req.body;

//     if (!medicineId) {
//       return res.status(400).json({
//         success: false,
//         message: "Medicine ID is required",
//       });
//     }

//     const qty = Number(quantity) || 1;

//     if (qty < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Quantity must be at least 1",
//       });
//     }

//     const medicine = await Medicine.findById(medicineId);

//     if (!medicine) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found",
//       });
//     }

//     if (medicine.stock < qty) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient stock available",
//       });
//     }

//     let cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       cart = await Cart.create({
//         user: req.user._id,
//         items: [],
//         totalPrice: 0,
//       });
//     }

//     const existingItemIndex = cart.items.findIndex(
//       (item) => item.medicine.toString() === medicineId
//     );

//     if (existingItemIndex > -1) {
//       const newQty = cart.items[existingItemIndex].quantity + qty;

//       if (medicine.stock < newQty) {
//         return res.status(400).json({
//           success: false,
//           message: "Requested quantity exceeds available stock",
//         });
//       }

//       cart.items[existingItemIndex].quantity = newQty;
//       cart.items[existingItemIndex].price = medicine.price;
//     } else {
//       cart.items.push({
//         medicine: medicine._id,
//         quantity: qty,
//         price: medicine.price,
//       });
//     }

//     cart.totalPrice = calculateTotalPrice(cart.items);
//     await cart.save();

//     const populatedCart = await Cart.findById(cart._id).populate(
//       "items.medicine",
//       "name type price stock image brand"
//     );

//     res.status(200).json({
//       success: true,
//       message: "Medicine added to cart",
//       cart: populatedCart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Add to cart failed",
//       error: error.message,
//     });
//   }
// };

// // Get my cart
// export const getMyCartController = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.medicine",
//       "name type price stock image brand"
//     );

//     if (!cart) {
//       return res.status(200).json({
//         success: true,
//         message: "Cart is empty",
//         cart: {
//           user: req.user._id,
//           items: [],
//           totalPrice: 0,
//         },
//       });
//     }

//     res.status(200).json({
//       success: true,
//       cart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Fetch cart failed",
//       error: error.message,
//     });
//   }
// };

// // Update cart item quantity
// export const updateCartItemController = async (req, res) => {
//   try {
//     const { medicineId, quantity } = req.body;

//     if (!medicineId || quantity === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "Medicine ID and quantity are required",
//       });
//     }

//     const qty = Number(quantity);

//     if (qty < 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Quantity must be at least 1",
//       });
//     }

//     const medicine = await Medicine.findById(medicineId);

//     if (!medicine) {
//       return res.status(404).json({
//         success: false,
//         message: "Medicine not found",
//       });
//     }

//     if (medicine.stock < qty) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient stock available",
//       });
//     }

//     const cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.medicine.toString() === medicineId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found in cart",
//       });
//     }

//     cart.items[itemIndex].quantity = qty;
//     cart.items[itemIndex].price = medicine.price;

//     cart.totalPrice = calculateTotalPrice(cart.items);
//     await cart.save();

//     const populatedCart = await Cart.findById(cart._id).populate(
//       "items.medicine",
//       "name type price stock image brand"
//     );

//     res.status(200).json({
//       success: true,
//       message: "Cart updated successfully",
//       cart: populatedCart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Update cart failed",
//       error: error.message,
//     });
//   }
// };

// // Remove item from cart
// export const removeCartItemController = async (req, res) => {
//   try {
//     const { medicineId } = req.params;

//     const cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.medicine.toString() !== medicineId
//     );

//     cart.totalPrice = calculateTotalPrice(cart.items);
//     await cart.save();

//     const populatedCart = await Cart.findById(cart._id).populate(
//       "items.medicine",
//       "name type price stock image brand"
//     );

//     res.status(200).json({
//       success: true,
//       message: "Item removed from cart",
//       cart: populatedCart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Remove item failed",
//       error: error.message,
//     });
//   }
// };

// // Clear cart
// export const clearCartController = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       return res.status(200).json({
//         success: true,
//         message: "Cart already empty",
//       });
//     }

//     cart.items = [];
//     cart.totalPrice = 0;
//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: "Cart cleared successfully",
//       cart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Clear cart failed",
//       error: error.message,
//     });
//   }
// };

import Cart from "../models/Cart.js";
import Medicine from "../models/Medicine.js";

const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const getFinalPrice = (medicine) => {
  if (medicine.offer && medicine.offer > 0) {
    return Math.round(medicine.mrp - (medicine.mrp * medicine.offer) / 100);
  }
  return medicine.mrp;
};

// Add to cart
export const addToCartController = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;

    if (!medicineId) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID is required",
      });
    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    if (medicine.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    const finalPrice = getFinalPrice(medicine);

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + qty;

      if (medicine.stock < newQty) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      cart.items[existingItemIndex].quantity = newQty;
      cart.items[existingItemIndex].price = finalPrice;
    } else {
      cart.items.push({
        medicine: medicine._id,
        quantity: qty,
        price: finalPrice,
      });
    }

    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.medicine",
      "name type mrp offer stock images brand category"
    );

    res.status(200).json({
      success: true,
      message: "Medicine added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Add to cart failed",
      error: error.message,
    });
  }
};

// Get my cart
export const getMyCartController = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.medicine",
      "name type mrp offer stock images brand category"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          user: req.user._id,
          items: [],
          totalPrice: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetch cart failed",
      error: error.message,
    });
  }
};

// Update cart item quantity
export const updateCartItemController = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;

    if (!medicineId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID and quantity are required",
      });
    }

    const qty = Number(quantity);

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    if (medicine.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    const finalPrice = getFinalPrice(medicine);

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items[itemIndex].quantity = qty;
    cart.items[itemIndex].price = finalPrice;

    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.medicine",
      "name type mrp offer stock images brand category"
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update cart failed",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeCartItemController = async (req, res) => {
  try {
    const { medicineId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.medicine.toString() !== medicineId
    );

    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.medicine",
      "name type mrp offer stock images brand category"
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Remove item failed",
      error: error.message,
    });
  }
};

// Clear cart
export const clearCartController = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Clear cart failed",
      error: error.message,
    });
  }
};