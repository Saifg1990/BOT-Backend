class ResponseHandler {
  static success(res, data, status = 200) {
    return res.status(status).json({
      success: true,
      data
    });
  }

  static error(res, error) {
    const status = error.status || 500;
    const response = {
      success: false,
      error: {
        message: error.message || 'Internal server error',
        type: error.name || 'Error'
      }
    };

    if (error.fields) {
      response.error.fields = error.fields;
    }

    if (error.details && process.env.NODE_ENV !== 'production') {
      response.error.details = error.details;
    }

    return res.status(status).json(response);
  }
}

module.exports = ResponseHandler;