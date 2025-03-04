import express from "express";
import { create, login, getProfile, updateProfile, deleteUser } from "../controller/userController.js";
import multer from 'multer';
import path from "path";
import { verifyToken } from "../middleware/auth.js";

const route = express.Router();

// Set up image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder for image storage
        cb(null, 'uploads/'); // Saves the file to the "uploads" folder in your project root
    },
    filename: function (req, file, cb) {
        // Set the file name (you can customize this logic if needed)
        cb(null, Date.now() + path.extname(file.originalname)); // Using current timestamp to avoid duplicate filenames
    }
});

const upload = multer({ storage: storage });

// Routes
route.post("/create", upload.single('image'), create); // POST request for signup with image upload
route.post("/login", login); // POST request for login
route.get("/profile", verifyToken, getProfile);
route.put("/profile", verifyToken, upload.single('image'), updateProfile); // PUT request for updating user profile
route.delete("/profile", verifyToken, deleteUser); 

export default route;
