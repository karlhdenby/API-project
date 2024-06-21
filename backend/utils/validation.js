const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationResult= validationResult(req);

    if (!handleValidationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach(error => 
            errors[error.path] = err.msg);
    
        
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next(err);
}

module.exports = {
    handleValidationErrors
};