const multer = require("multer");
const uuid = require("uuid/v4");

// const MIME_TYPE_MAP = new Map.set("image/png", "png")
//   .set("image/jpeg", "jpeg")
//   .set("image/jpg", "jpg");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; //MIME_TYPE_MAP.get(file.mimetype);
      cb(null, uuid() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; //MIME_TYPE_MAP.get(file.mimetype);
    const error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
