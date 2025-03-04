import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: true,
        default: Date.now
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },

    age: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                // Custom validation: Age must be a positive integer and within a reasonable range
                return Number.isInteger(value) && value > 0 && value < 150;
            },
            message: 'Age must be a positive integer and less than 150.'
        }
    },

    address: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true,
    },

    image: {
        type: String, // Store image path as a string (not binary data)
        required: false
    }
    
}, { versionKey: false });


const User = mongoose.model('users', userSchema);
export default User;
