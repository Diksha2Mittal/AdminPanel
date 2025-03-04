import User from "../model/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


// Signup Controller
export const create = async (req, res) => {
    try {
        const { name, dateOfBirth, email, age, address, password } = req.body;

        const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@!#$%^&*()_+={}\[\]:;"'<>,.?~`-]{6,}$/;

        if (!regexPassword.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one letter, one number, and be at least 6 characters long." });
        }

        // Check if user already exists
        const usersExist = await User.findOne({ email });
        if (usersExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Handle image path correctly
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const users = new User({
            name,
            dateOfBirth,
            email,
            age,
            address,
            password: hashedPassword,
            image: imagePath // Save image path (not binary data)
        });

        // Save user to database
        await users.save();
        res.status(201).json({ message: "User created successfully", 
            data: {name: users.name,
                email: users.email,
                dateOfBirth: users.dateOfBirth,
                isActive: users.isActive,
                image: imagePath,
             },
            });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message || "Internal Server Error." });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

        const users = await User.findOne({ email });
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        // Use the compare method for password validation
        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: users._id, email: users.email, name: users.name, age: users.age, address: users.address },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
            res.json({ message: "Login successful", token});

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};


// Get Profile Controller

export const getProfile = async (req, res) => {
    try {
        // Extract the user ID from the request (from the decoded JWT token)
        const userId = req.user.id; // The decoded user data is stored in 'req.user'

        // Find the user in the database using the decoded user ID
        const users = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user's details
        res.status(200).json({
            id: users._id,
            name: users.name,
            email: users.email,
            age: users.age,
            address: users.address,
            dateOfBirth: users.dateOfBirth,
            image: users.image, // If you want to return the image as well
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Update Profile Controller
export const updateProfile = async (req, res) => {
    try {
        // Extract user ID from the request (from the decoded JWT token)
        const userId = req.user.id;

        // Get the updated details from the request body
        const { name, dateOfBirth, age, address } = req.body;

        // Create an object to store the fields to be updated
        const updatedFields = {};

        // Check if each field is provided and update it
        if (name) updatedFields.name = name;
        if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
        if (age) updatedFields.age = age;
        if (address) updatedFields.address = address;

        // If an image is provided, handle the image path
        if (req.file) {
            updatedFields.imagePath = `/uploads/${req.file.filename}`; // Set image path
        }

        // Find the user by their ID and update the user data
        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the updated user details
        res.status(200).json({
            message: "Profile updated successfully",
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                age: updatedUser.age,
                address: updatedUser.address,
                dateOfBirth: updatedUser.dateOfBirth,
                image: updatedUser.image, // If image is updated
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Delete User Controller
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;  // Get the user ID from the JWT token
        
        // Find the user and remove from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return success message
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

