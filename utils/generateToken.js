import jwt from 'jsonwebtoken';

//Generate a token
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  //Save the token in cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Only use secure cookies in production
    sameSite: 'None', // Allows cross-site cookies - set 'None' if using different domains for back/frontend
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
