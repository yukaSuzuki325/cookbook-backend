import express from 'express';
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  bookmarkRecipe,
} from '../controllers/recipeController.js'; // Import controllers
import { protect } from '../middleware/authMiddleware.js'; // Import protect middleware

const router = express.Router();

// Public Routes
router.route('/').get(getRecipes); // Get all recipes
router.route('/:id').get(getRecipeById); // Get a single recipe by ID

// Protected Routes
router.route('/').post(protect, createRecipe); // Create a new recipe
router
  .route('/:id')
  .put(protect, updateRecipe) // Update a recipe
  .delete(protect, deleteRecipe); // Delete a recipe

// Bookmark a Recipe
router.route('/:id/bookmark').post(protect, bookmarkRecipe);

export default router;
