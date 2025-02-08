import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  bookmarkRecipe,
  getUserRecipes,
  getBookmarkedRecipes,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define specific routes before dynamic routes
router.route('/bookmarked').get(protect, getBookmarkedRecipes);
router.route('/user/:userId').get(protect, getUserRecipes);

router.route('/').get(getRecipes).post(protect, createRecipe);

router
  .route('/:id')
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

router.route('/:id/bookmark').post(protect, bookmarkRecipe);

export default router;
