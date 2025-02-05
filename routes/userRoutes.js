import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js'; //need '.js' at the end
import { protect } from '../middleware/authMiddleware.js';

//Register
router.post('/', registerUser);

//Login
router.post('/auth', authUser);

//Logout
router.post('/logout', logoutUser);

//Protected
router
  .route('/profile')
  .get(protect, getUserProfile) // Get user profile
  .put(protect, updateUserProfile); // Update user profile

export default router;
