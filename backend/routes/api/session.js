const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { requireAuth } = require("../../utils/auth");

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
    check('password').exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
    handleValidationErrors
];

router.post('/', validateLogin, async (req, res, next) => {
    try {
        const { credential, password } = req.body;
    
        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });
    
        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            const err = new Error("Login Failed");
            err.status = 401;
            err.title - 'Login Failed';
            err.errors = { credential: 'The provided credentials were invalid.' };
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
    
        const safeUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            email: user.email,
            username: user.username,
        };
    
        await setTokenCookie(res, safeUser);
    
        return res.json({
            user: safeUser
        });
        
    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            errors: {
                credential: "Email or username is required",
                password: "Password is required"
            }
        })
    }
});

router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success '});
});

router.get('/', (req, res) => {
    const { user } = req
    if (user) {
        const safeUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
});


router.post('/', requireAuth, async (req, res, next) => {
    try {
        const { credential, password } = req.body;
    
        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });
    
        if (!user || !bcrypt.compareSync(password,
            user.hashedPassword.toString())) {
                const err = new Error("Login failed");
                err.status = 401;
                err.title = "Login failed";
                err.errors = { credential: 'The provided credentials were invalid.'};
                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }
    
            const safeUser = {
                firstName: firstName,
                lastName: lastName,
                id: user.id,
                email: user.email,
                username: user.username,
            };
    
            await setTokenCookie(res, safeUser);
    
            return res.json({
                user: safeUser
            });
        
    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            errors: {
                credential: "Email or username is required",
                password: "Password is required"
            }
        })
    }
});




module.exports = router;