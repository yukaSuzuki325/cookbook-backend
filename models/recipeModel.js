import mongoose from 'mongoose';

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }, // e.g., "2 cups", "1 tbsp"
});

const stepSchema = mongoose.Schema({
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true },
});

const recipeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User model (owner of the recipe)
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true, // Assuming image upload is required
    },
    cookingTime: {
      type: Number,
      required: true, // Cooking time in minutes
    },
    servings: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Meat', 'Fish', 'Vegetarian', 'Vegan'], // Only one category
    },
    ingredients: [ingredientSchema], // Array of ingredients
    steps: [stepSchema], // Array of steps
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users who liked the recipe
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
