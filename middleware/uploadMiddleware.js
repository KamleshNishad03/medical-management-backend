


// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadPath = "uploads";

// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpg|jpeg|png|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = file.mimetype.startsWith("image/");

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

// export default upload;

import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import cloudinaryPkg from "cloudinary";
import pkg from "multer-storage-cloudinary";

const { v2: cloudinary } = cloudinaryPkg;
const { CloudinaryStorage } = pkg;

/*
|--------------------------------------------------------------------------
| Cloudinary Config
|--------------------------------------------------------------------------
*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*
|--------------------------------------------------------------------------
| Cloudinary Storage
|--------------------------------------------------------------------------
*/

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "medical-management",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    public_id: `${Date.now()}-${
      file.originalname.split(".")[0]
    }`,
  }),
});

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/*
|--------------------------------------------------------------------------
| Multer Upload
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;