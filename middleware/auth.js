import jwt from 'jsonwebtoken'; 

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from Authorization header

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store the decoded user information in the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};
