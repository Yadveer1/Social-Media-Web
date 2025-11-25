import mongoose from "mongoose";    

const ConnectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: Boolean,
        default: null
    }
}, { timestamps: true });

const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionSchema);

export default ConnectionRequest;
