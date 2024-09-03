
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false // Default value set to false
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: Number,
        null: true,
    },
    otpExpiry: {
        type: Date,
        null: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Default value set to current timestamp
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Default value set to current timestamp
        required: true
    }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
