import express from 'express';
import { uploadImage } from '../controllers/imageController.js';
import multer from 'multer';

const upload = multer(); // Configure multer to handle file uploads
const router = express.Router();

// Image upload route
router.post('/upload', upload.single('image'), uploadImage);

export default router;
