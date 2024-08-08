const { validationResult } = require('express-validator');

const valErrors = {
    email: "Invalid email",
    username: "Username is required",
    firstName: "First Name is required",
    lastName: "Last Name is required",
    credential: "Email or username is required",
    password: "Password is required"
}

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach((error) => 
            errors[error.path] = error.msg);
    
        
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        
        for (let key in req.body) {
            err.errors[key] = key
        }

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