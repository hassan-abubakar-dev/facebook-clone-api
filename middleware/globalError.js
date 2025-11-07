
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'something went wrong'
    return res.status(statusCode).json({
        status,
        message
    });
};

export default globalErrorHandler;