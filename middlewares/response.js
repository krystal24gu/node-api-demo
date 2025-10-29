// middlewares/response.js
// {code, data, message}
module.exports = (req, res, next) => {
    res.success = (data, message = 'success') => {
        res.json({
            code: 0,
            data,
            message,
        });
    };
    res.fail = (message = 'error', code = 1) => {
        res.status(400).json({
            code,
            data: null,
            message,
        });
    };
    next();
};

