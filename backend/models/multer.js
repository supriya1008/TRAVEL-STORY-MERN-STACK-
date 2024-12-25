// // Importing necessary libraries
// const multer = require("multer"); // multer is used for handling multipart/form-data, which is used for file uploads
// const path = require("path"); // path is used to handle and transform file paths

// // Configuring the storage for uploaded files
// const storage = multer.diskStorage({
//     // Destination function specifies where to store the uploaded file
//     destination: function (req, file, cb) {
//         cb(null, "./uploads/"); // The uploaded files will be stored in the 'uploads' folder
//     },
//     // Filename function specifies the naming convention for the uploaded file
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // The file will be named with the current timestamp followed by the original file extension
//     }
// });

// // File filter to accept only image files
// const fileFilter = function (req, file, cb) {
//     // Check if the uploaded file is an image by inspecting its MIME type
//     if (file.mimetype.startsWith("image/")) {
//         cb(null, true); // If the file is an image, it will be accepted
//     } else {
//         cb(new Error("Only images are allowed"), false); // If the file is not an image, it will be rejected
//     }
// };

// // Initialize multer with the storage configuration and file filter
// const upload = multer({ storage, fileFilter });

// // Export the upload middleware so it can be used in other parts of the application
// module.exports = upload;


const multer = require("multer");
const path = require("path");

// Configure the storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
