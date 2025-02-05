import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt; //make sure to set up cookie parser in server.js to use this

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password'); //accessing the userId that was passed as a payload when generating token
      //req.user can be accessed anywhere in the app now

      console.log(req.user);

      next(); //calls either 'updateUserProfile' or 'getUserProfile' depending on the route
    } catch (error) {
      res.status(401);
      throw new Error('Invalid token');
    }
  } else {
    res.status(401);
    throw new Error('No token');
  }
});

export { protect };
