const bcrypt = require('bcrypt');
const {User} = require('./dbModels/dbSchemas.js');
const {
    publishMessageForLogin,
} = require('./messageConn.js');

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function register(req, res) {
    try {
        const {username, password, email, role} = req.body;
        const existingUser = await User.findOne({username});
        const existingEmail = await User.findOne({email});

        if (!validateEmail(email)) {
            return res.status(409).json({error: 'Invalid email'});
        }

        if (existingUser) {
            return res.status(409).json({error: 'Username already exists'});
        }

        if (existingEmail) {
            return res.status(409).json({error: 'Email is already in use'});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);


        const newUser = new User({username, email});
        await newUser.save();

        publishMessageForLogin({
            "username": username,
            "passwordHash": passwordHash,
            "email": email,
            "role": role,
        });

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        console.error("Error occurred while registering user:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {register};
