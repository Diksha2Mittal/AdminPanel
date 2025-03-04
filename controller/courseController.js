import Course from "../model/courseModel.js";

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        const newCourse = new Course({
            title,
            description,
            createdBy: req.user.id, // Assuming courses are created by users
        });

        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all courses
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('createdBy', 'name email'); // Populate user info
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId).populate('createdBy', 'name email');

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a course
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(courseId, { title, description }, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a course
export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
