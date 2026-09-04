const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("video/") && !file.mimetype.startsWith("image/")) {
            return cb(new Error("Only video or image files are allowed"));
        }
        cb(null, true);
    },
});

module.exports = upload;