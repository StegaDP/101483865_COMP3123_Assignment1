const {body, validationResult} = require("express-validator");

const validateLogin = [
    body('email').isEmail().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required'),

    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: validationResult(req).array() });
        }
        next();
    }
]

const validateSignUp = [
    body('username').notEmpty().withMessage('username is required'),

    body('password').notEmpty().withMessage('password is required'),

    body('email').isEmail().withMessage('email is invalid'),

    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: validationResult(req).array() });
        }
        next();
    }
];

module.exports = {validateLogin, validateSignUp};