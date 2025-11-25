import {Router} from 'express';
import {myConnection, getConnectionRequests, sendConnectionRequest, register, login, googleLogin, downloadResume, updateUserProfile, getUserAndProfile, uploadProfilePicture, updateProfileData, getAllUserProfile, acceptConnectionRequest } from '../controllers/user.controller.js';
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
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/auth/google').post(googleLogin);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadResume);

// Protected routes (authentication required)
router.route('/upload_profile_picture').post(authenticate, upload.single('profile_picture'), uploadProfilePicture);
router.route('/user_update').post(authenticate, updateUserProfile);
router.route('/get_user_and_profile').get(authenticate, getUserAndProfile);
router.route('/update_profile_data').post(authenticate, updateProfileData);
router.route('/user/send_connection_request').post(authenticate, sendConnectionRequest);
router.route('/user/get_connection_requests').get(authenticate, getConnectionRequests);
router.route('/user/myConnection').get(authenticate, myConnection);
router.route('/user/accept_connection_request').post(authenticate, acceptConnectionRequest);

export default router;