import { Router } from "express";
import { createPost, getAllPosts, deletePost, getMyPosts, commentPost, getCommentsByPost, deleteUserComment, likePost } from "../controllers/posts.controller.js";
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes (no authentication required)
router.route('/get_all_posts').get(getAllPosts);
router.route('/get_comments').post(getCommentsByPost);

// Protected routes (authentication required)
router.route('/create_post').post(authenticate, upload.single('media'), createPost);
router.route('/get_my_posts').post(authenticate, getMyPosts);
router.route('/delete_post').delete(authenticate, deletePost);
router.route('/comment_post').post(authenticate, commentPost);
router.route('/delete_comment').delete(authenticate, deleteUserComment);
router.route('/like_post').post(authenticate, likePost);

export default router;