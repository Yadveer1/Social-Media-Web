import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    media: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: true,
    },
    fileType: {
        type: String,
        default: "",
    }


}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

export default Post;
