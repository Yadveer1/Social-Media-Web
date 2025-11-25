import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const createPost = async(req,res) => {

    try {
        const post = new Post({
            userId: req.user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })

        await post.save();

        return res.status(200).json({status: true, message: "Post created successfully"});


    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const getAllPosts = async(req,res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate('userId', 'name username email profilePicture');

        if(!posts ||posts.length === 0) {
            return res.status(404).json({status: false, message: "No posts found"});
        }

        return res.status(200).json({status: true, data: posts});
    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const deletePost = async(req,res) => {
    try {
        const {post_id} = req.body;

        const post = await Post.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({status: false, message: "Post not found"});
        }

        if(req.user._id.toString() !== post.userId._id.toString()) {
            return res.status(401).json({status: false, message: "Unauthorized"});
        }

        await Post.deleteOne({_id: post_id});
        return res.status(200).json({status: true, message: "Post deleted"});
        

    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const getMyPosts = async(req,res) => {
    try {
        const posts = await Post.find({userId: req.user._id}).sort({createdAt: -1}).populate('userId', 'name username email profilePicture');
        if(!posts || posts.length === 0) {
            return res.status(404).json({status: false, message: "Post not found"});
        }

        return res.status(200).json({status: true, data: posts});
    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const commentPost = async(req,res) => {
    try {
        const {post_id, comment} = req.body;

        const post = await Post.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({status: false, message: "Post not found"});
        }

        const newComment = new Comment({
            postId: post_id,
            userId: req.user._id,
            body: comment
        });

        await newComment.save();

        return res.status(200).json({status: true, message: "Comment added successfully"});

    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const getCommentsByPost = async(req,res) => {
    try {
        const {post_id} = req.body;
        const comments = await Comment.find({postId: post_id}).populate('userId', 'name username email profilePicture');
        if(!comments || comments.length === 0) {
            return res.status(404).json({status: false, message: "No comments found"});
        }

        return res.status(200).json({status: true, data: comments});
    } catch (error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const deleteUserComment = async(req,res) => {
    try {
        const {comment_id} = req.body;

        const comment = await Comment.findOne({_id: comment_id});

        if(!comment) {
            return res.status(404).json({status: false, message: "Comment not found"});
        }

        if(req.user._id.toString() !== comment.userId.toString()) {
            return res.status(401).json({status: false, message: "Unauthorized - You can only delete your own comments"});
        }

        await Comment.deleteOne({_id: comment_id});

        return res.status(200).json({status: true, message: "Comment deleted successfully"});

    } catch(error) {
        return res.status(500).json({status: false, message: error.message});
    }
}

export const likePost = async(req,res) => {
    try {
        const {post_id, msg} = req.body;

        const post = await Post.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({status: false, message: "Post not found"});
        }
        
        if(msg === "like") {
            post.likes += 1;
        } else if(msg === "unlike") {
            post.likes = Math.max(0, post.likes - 1); // Prevent negative likes
        } else {
            return res.status(400).json({status: false, message: "Invalid msg value. Use 'like' or 'unlike'"});
        }
        
        await post.save();

        return res.status(200).json({
            status: true, 
            message: msg === "like" ? "Post liked successfully" : "Post unliked successfully"
        });

    } catch(error) {
        return res.status(500).json({status: false, message: error.message});
    }
}
