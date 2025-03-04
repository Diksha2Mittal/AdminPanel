import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',  // Assuming courses are tied to users, change if needed
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Course = mongoose.model('courses', courseSchema);
export default Course;
