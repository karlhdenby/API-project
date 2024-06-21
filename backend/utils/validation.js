const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationResult = validationResult(req);

    if (!validationResult.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach((error) => 
            errors[error.path] = error.msg);
    
        
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
}

module.exports = {
    handleValidationErrors
};