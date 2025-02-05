const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUlr}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  console.log(err.stack);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    //if you try to get a user with an objectId that doesn't exist
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    message,
    stack: (process.env.NODE_ENV = 'production' ? null : err.stack),
  });
};

export { notFound, errorHandler };
