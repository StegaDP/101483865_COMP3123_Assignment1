const {body, validationResult} = require("express-validator");

const validateCreateEmployee = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('salary').isNumeric().withMessage('Salary is required'),
    body('date_of_joining').notEmpty().withMessage('Date of joining is required'),
    body('department').notEmpty().withMessage('Date of birth is required'),

    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: validationResult(req).array() });
        }
        next();
    }
]

const validateUpdateEmployee = [
    body('first_name').optional().notEmpty().withMessage('First name is required'),
    body('last_name').optional().notEmpty().withMessage('Last name is required'),
    body('email').optional().isEmail().withMessage('Email is required'),
    body('position').optional().notEmpty().withMessage('Position is required'),
    body('salary').optional().isNumeric().withMessage('Salary is required'),
    body('date_of_joining').optional().notEmpty().withMessage('Date of joining is required'),
    body('department').optional().notEmpty().withMessage('Date of birth is required'),

    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: validationResult(req).array() });
        }
        next();
    }
]

module.exports = {validateCreateEmployee, validateUpdateEmployee};