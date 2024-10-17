const { validationResult } = require('express-validator');


const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    console.log(validationErrors)

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach((error) => 
            errors[error.path] = error.msg);
    
        
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        
        return res.status(400).json({
            message: err.message,
            errors: err.errors
        });
    }
    next();
}

module.exports = {
    handleValidationErrors
};