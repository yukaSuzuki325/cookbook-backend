import Recipe from '../models/recipeModel.js';
import User from '../models/userModel.js';

//Get all recipes
const getRecipes = async (req, res) => {
  try {
    //Find all recipes, with newest first
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Get a specific recipe
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);

    //Handle invalid objectID errors
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

//Post a recipe
const createRecipe = async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    ingredients,
    steps,
    cookingTime,
    servings,
    category,
  } = req.body;

  if (
    !title ||
    !imageUrl ||
    !ingredients ||
    !steps ||
    !cookingTime ||
    !servings ||
    !category
  ) {
    return res.status(400).jason({ message: 'All fields are required' });
  }

  try {
    const recipe = new Recipe({
      user: req.user._id,
      title,
      description,
      imageUrl,
      ingredients,
      steps,
      cookingTime,
      servings,
      category,
    });

    const createdRecipe = await recipe.save();

    res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Edit a recipe
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params; // Get recipe ID from the request parameters

    // Find the recipe by ID
    const recipe = await Recipe.findById(id);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the logged-in user is the creator of the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this recipe' });
    }

    // Update the recipe fields with the request body
    const updatedFields = {
      title: req.body.title || recipe.title,
      description: req.body.description || recipe.description,
      imageUrl: req.body.imageUrl || recipe.imageUrl,
      cookingTime: req.body.cookingTime || recipe.cookingTime,
      servings: req.body.servings || recipe.servings,
      category: req.body.category || recipe.category,
      ingredients: req.body.ingredients || recipe.ingredients,
      steps: req.body.steps || recipe.steps,
    };

    // Update the recipe document in the database
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updates
    });

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error(error);

    // Handle invalid ObjectID errors
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

//Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params; // Get recipe ID from the request parameters
    console.log('req.params', req.params);

    // Find the recipe by ID
    const recipe = await Recipe.findById(id);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the logged-in user is the creator of the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this recipe' });
    }

    // Delete the recipe
    await recipe.deleteOne();

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error);

    // Handle invalid ObjectID errors
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Bookmark a Recipe
const bookmarkRecipe = async (req, res) => {
  console.log('Request params:', req.params); // Log params
  console.log('Request user:', req.user); // Log authenticated user
  const { id: recipeId } = req.params;
  const user = req.user;

  try {
    // Check if the recipe is already bookmarked
    let alreadyBookmarked = user.bookmarks.includes(recipeId);
    let message;

    if (alreadyBookmarked) {
      // Remove the bookmark if it already exists
      user.bookmarks.pull(recipeId);
      message = 'Bookmark removed';
      alreadyBookmarked = false;
    } else {
      // If not bookmarked, add it
      user.bookmarks.push(recipeId);
      message = 'Bookmark added successfully';
      alreadyBookmarked = true;
    }

    await user.save();

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if a recipe is bookmarked
const isRecipeBookmarked = async (req, res) => {
  const userId = req.user._id;
  const { id: recipeId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const alreadyBookmarked = user.bookmarks.includes(recipeId);

    res.status(200).json({ bookmarked: alreadyBookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookmarked recipes for the logged-in user
const getBookmarkedRecipes = async (req, res) => {
  const userId = req.user._id; // Get the logged-in user's ID from the `protect` middleware
  console.log('Fetching bookmarked recipes for user:', userId);

  try {
    const { bookmarks } = await User.findById(userId).populate('bookmarks');
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarked recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recipes created by user
const getUserRecipes = async (req, res) => {
  //const { userId } = req.params;

  const userId = req.user._id;
  console.log('userId:', userId);

  try {
    const recipes = await Recipe.find({ user: userId }); // Find recipes by user ID
    res.status(200).json(recipes); // Return recipes
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  bookmarkRecipe,
  getRecipes,
  getRecipeById,
  getUserRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  isRecipeBookmarked,
  getBookmarkedRecipes,
};
