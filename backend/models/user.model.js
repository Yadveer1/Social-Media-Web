import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        },
    },
    profilePicture: {
        type: String,
        default: "default.png",
    },
    token: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
