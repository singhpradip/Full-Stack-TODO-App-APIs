const successResponse = (res, message, data = null) => {
  return res.status(200).json({
    isSuccess: true,
    message,
    data,
  });
};

const sendError = (res, message, statusCode = 500) => {
  const errorObj = {
    isSuccess: false,
    message,
  };

  return res.status(statusCode).json(errorObj);
};

module.exports = {
  successResponse,
  sendError,
};
