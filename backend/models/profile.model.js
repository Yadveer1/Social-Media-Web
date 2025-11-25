import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        default: ""
    },
    degree: {
        type: String,
        default: ""
    },
    fieldOfStudy: {
        type: String,
        default: ""
    }
});

const WorkSchema = new mongoose.Schema({
    company: {
        type: String,
        default: ""
    },
    position : {
        type: String,
        default: ""
    },
    years: {
        type: String,
        default: ""
    }
});

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bio: {
        type: String,
        default: ""
    },
    currentPosition: {
        type: String,
        default: ""
    },
    pastWork: {
        type: [WorkSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    },
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
