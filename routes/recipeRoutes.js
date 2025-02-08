import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  bookmarkRecipe,
  isRecipeBookmarked,
  getUserRecipes,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.route('/').get(getRecipes); // Get all recipes
router.route('/:id').get(getRecipeById); // Get a single recipe by ID
router.route('/user/:userId').get(getUserRecipes); // Get recipes created by a specific user

// Protected Routes
router.route('/').post(protect, createRecipe); // Create a new recipe
router
  .route('/:id')
  .put(protect, updateRecipe) // Update a recipe
  .delete(protect, deleteRecipe); // Delete a recipe

// Bookmark a Recipe
router.route('/:id/bookmark').post(protect, bookmarkRecipe);

// Check if a recipe is bookmarked
router.route('/:id/bookmarked').get(protect, isRecipeBookmarked);

export default router;
