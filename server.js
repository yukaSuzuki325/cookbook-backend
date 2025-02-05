import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import mongoSanitize from 'express-mongo-sanitize';

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow CORS

app.use(mongoSanitize());

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.get('/', (req, res) => {
  res.send('server is ready');
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server started on ${port}`));
