const {Router} = require("express");
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require("../models/user");
const routerUser = Router();
const jwt_secret = "SUPER_SECRET_KEY";


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


routerUser.post("/signup", validateSignUp, async (req, res) => {
    let { username, password, email } = req.body;
    try {
        password = crypto.createHash('sha256').update(password).digest('hex');
        const user = await User.create({username: username, email: email, password: password});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error creating user" });
    }
    res.send("User Created").status(201);
})

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

routerUser.post("/login", validateLogin, async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await User.findOne({email: email});

        if (!user) {return res.status(404).json({ error: "User not found" });}

        if (user.password === crypto.createHash('sha256').update(password).digest('hex')) {
            const jwt = require('jsonwebtoken');
            const data = {email: email};

            const token = jwt.sign(data, jwt_secret, { expiresIn: '24h' });
            return res.status(200).json({ message: "Login successful.", "jwt_token": token });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error logging in user");
    }

    res.send("login").status(200);
})

module.exports = routerUser;