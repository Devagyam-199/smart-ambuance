import multer from "multer";

const uploadDriverDocs = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = {
      photo: ["image/jpeg", "image/png", "image/jpg"],
      license: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    };
    if (allowed[file.fieldname]?.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error(`Invalid file type for ${file.fieldname}`), false);
  },
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "license", maxCount: 1 },
]);

export default uploadDriverDocs;