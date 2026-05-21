

// // import express from "express";
// // import dotenv from "dotenv";
// // import cors from "cors";
// // import path from "path";
// // import http from "http";
// // import { Server } from "socket.io";

// // import connectDB from "./config/db.js";
// // import authRoutes from "./routes/authRoutes.js";
// // import medicineRoutes from "./routes/medicineRoutes.js";
// // import prescriptionRoutes from "./routes/prescriptionRoutes.js";
// // import cartRoutes from "./routes/cartRoutes.js";
// // import orderRoutes from "./routes/orderRoutes.js";
// // import notificationRoutes from "./routes/notificationRoute.js";

// // dotenv.config();
// // connectDB();

// // const app = express();

// // app.use(
// //   cors({
// //     origin: process.env.CLIENT_URL || "http://localhost:5173",
// //     credentials: true,
// //   })
// // );

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // app.use("/api/v1/auth", authRoutes);
// // app.use("/api/v1/medicines", medicineRoutes);
// // app.use("/api/v1/prescriptions", prescriptionRoutes);
// // app.use("/api/v1/cart", cartRoutes);
// // app.use("/api/v1/orders", orderRoutes);
// // app.use("/api/v1/notifications", notificationRoutes);

// // // create http server
// // const server = http.createServer(app);

// // // socket.io setup
// // export const io = new Server(server, {
// //   cors: {
// //     origin: process.env.CLIENT_URL || "http://localhost:5173",
// //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
// //     credentials: true,
// //   },
// // });

// // io.on("connection", (socket) => {
// //   console.log("Socket connected:", socket.id);

// //   socket.on("joinUserRoom", (userId) => {
// //     socket.join(`user_${userId}`);
// //     console.log(`Socket ${socket.id} joined user room: user_${userId}`);
// //   });

// //   socket.on("leaveUserRoom", (userId) => {
// //     socket.leave(`user_${userId}`);
// //     console.log(`Socket ${socket.id} left user room: user_${userId}`);
// //   });

// //   socket.on("joinAdminRoom", () => {
// //     socket.join("admin_global");
// //     console.log(`Socket ${socket.id} joined admin room: admin_global`);
// //   });

// //   socket.on("leaveAdminRoom", () => {
// //     socket.leave("admin_global");
// //     console.log(`Socket ${socket.id} left admin room: admin_global`);
// //   });

// //   socket.on("joinOrderRoom", (orderId) => {
// //     socket.join(orderId);
// //     console.log(`Socket ${socket.id} joined order room: ${orderId}`);
// //   });

// //   socket.on("leaveOrderRoom", (orderId) => {
// //     socket.leave(orderId);
// //     console.log(`Socket ${socket.id} left order room: ${orderId}`);
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("Socket disconnected:", socket.id);
// //   });
// // });

// // const PORT = process.env.PORT || 5000;

// // server.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });



// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import http from "http";
// import helmet from "helmet";
// import compression from "compression";
// import cookieParser from "cookie-parser";
// import rateLimit from "express-rate-limit";
// import morgan from "morgan";
// import { Server } from "socket.io";

// import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import medicineRoutes from "./routes/medicineRoutes.js";
// import prescriptionRoutes from "./routes/prescriptionRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import notificationRoutes from "./routes/notificationRoute.js";

// dotenv.config();

// /*
// |--------------------------------------------------------------------------
// | Database Connection
// |--------------------------------------------------------------------------
// */

// await connectDB();

// const app = express();

// /*
// |--------------------------------------------------------------------------
// | Trust Proxy
// |--------------------------------------------------------------------------
// */

// app.set("trust proxy", 1);

// /*
// |--------------------------------------------------------------------------
// | Security Middleware
// |--------------------------------------------------------------------------
// */

// // app.use(helmet());

// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

// app.use(compression());

// app.use(cookieParser());

// /*
// |--------------------------------------------------------------------------
// | Logging
// |--------------------------------------------------------------------------
// */

// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// }

// /*
// |--------------------------------------------------------------------------
// | Rate Limiting
// |--------------------------------------------------------------------------
// */

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 300,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//   },
// });

// app.use(limiter);

// /*
// |--------------------------------------------------------------------------
// | CORS
// |--------------------------------------------------------------------------
// */

// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   "http://localhost:5173",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed"));
//       }
//     },
//     credentials: true,
//   })
// );

// /*
// |--------------------------------------------------------------------------
// | Body Parsers
// |--------------------------------------------------------------------------
// */

// app.use(express.json({ limit: "10mb" }));

// app.use(express.urlencoded({ extended: true }));

// /*
// |--------------------------------------------------------------------------
// | Static Uploads
// |--------------------------------------------------------------------------
// */

// app.use(
//   "/uploads",
//   express.static(path.join(process.cwd(), "uploads"))
// );

// /*
// |--------------------------------------------------------------------------
// | Health Route
// |--------------------------------------------------------------------------
// */

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Medical Management API Running",
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// */

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/medicines", medicineRoutes);
// app.use("/api/v1/prescriptions", prescriptionRoutes);
// app.use("/api/v1/cart", cartRoutes);
// app.use("/api/v1/orders", orderRoutes);
// app.use("/api/v1/notifications", notificationRoutes);

// /*
// |--------------------------------------------------------------------------
// | 404 Handler (Express 5 Compatible)
// |--------------------------------------------------------------------------
// */

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | Global Error Handler
// |--------------------------------------------------------------------------
// */

// app.use((err, req, res, next) => {
//   console.error("Global Error:", err);

//   res.status(err.status || 500).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? "Internal Server Error"
//         : err.message,
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | Create HTTP Server
// |--------------------------------------------------------------------------
// */

// const server = http.createServer(app);

// /*
// |--------------------------------------------------------------------------
// | Socket.IO Setup
// |--------------------------------------------------------------------------
// */

// export const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   },

//   pingTimeout: 60000,
// });

// /*
// |--------------------------------------------------------------------------
// | Socket Events
// |--------------------------------------------------------------------------
// */

// io.on("connection", (socket) => {
//   console.log(`🟢 Socket connected: ${socket.id}`);

//   socket.on("joinUserRoom", (userId) => {
//     socket.join(`user_${userId}`);
//   });

//   socket.on("leaveUserRoom", (userId) => {
//     socket.leave(`user_${userId}`);
//   });

//   socket.on("joinAdminRoom", () => {
//     socket.join("admin_global");
//   });

//   socket.on("leaveAdminRoom", () => {
//     socket.leave("admin_global");
//   });

//   socket.on("joinOrderRoom", (orderId) => {
//     socket.join(orderId);
//   });

//   socket.on("leaveOrderRoom", (orderId) => {
//     socket.leave(orderId);
//   });

//   socket.on("disconnect", () => {
//     console.log(`🔴 Socket disconnected: ${socket.id}`);
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | Start Server
// |--------------------------------------------------------------------------
// */

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// /*
// |--------------------------------------------------------------------------
// | Graceful Shutdown
// |--------------------------------------------------------------------------
// */

// process.on("SIGTERM", () => {
//   console.log("SIGTERM received. Shutting down gracefully.");

//   server.close(() => {
//     console.log("Process terminated.");

//     process.exit(0);
//   });
// });

// process.on("SIGINT", () => {
//   console.log("SIGINT received. Shutting down gracefully.");

//   server.close(() => {
//     console.log("Process terminated.");

//     process.exit(0);
//   });
// });



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoute.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

app.use(limiter);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  "https://medical-management-frontend.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },

    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Medical Management API Running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/medicines", medicineRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server start error:", error);
  }
};

startServer();