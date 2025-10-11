const {Router} = require("express");
const crypto = require('crypto');
const User = require("../models/user");
const routerUser = Router();
const jwt_secret = "SUPER_SECRET_KEY";
const {validateLogin, validateSignUp} = require("../validations/userValidations");

routerUser.post("/signup", validateSignUp, async (req, res) => {
    let { username, password, email } = req.body;
    try {
        password = crypto.createHash('sha256').update(password).digest('hex');
        await User.create({username: username, email: email, password: password});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error creating user" });
    }
    res.send("User Created").status(201);
})


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