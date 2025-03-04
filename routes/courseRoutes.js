import express from 'express';
import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} from '../controller/courseController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new course (POST)
router.post('/create', verifyToken, createCourse);

// Get all courses (GET)
router.get('/', getCourses);

// Get a course by ID (GET)
router.get('/:id', getCourseById);

// Update a course by ID (PUT)
router.put('/:id', verifyToken, updateCourse);

// Delete a course by ID (DELETE)
router.delete('/:id', verifyToken, deleteCourse);

export default router;
