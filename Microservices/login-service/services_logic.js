const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, RefreshTokens} = require('./dbModels/dbSchemas.js');
const {config} = require('./config.js');

async function login(req, res) {
    try {
        const {username, password} = req.body;
        console.log("Login request received for user:", username);

        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({error: 'User does not exist'});
        }
        if (!user.isVerified) {
            return res.status(401).json({error: 'You are not verified.'});
        }

        bcrypt.compare(password, user.passwordHash, async (err, result) => {
            if (result) {
                const accessToken = jwt.sign(makePayload(user), config.ACCESS_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_EXPIRES});
                const refreshToken = jwt.sign(makePayload(user), config.REFRESH_TOKEN_SECRET);

                await RefreshTokens.findOneAndDelete({username});

                const newRefreshTokens = new RefreshTokens({username, refreshToken});
                await newRefreshTokens.save();

                return res.status(200).json({accessToken, refreshToken});
            } else {
                return res.status(401).json({error: 'Password is incorrect'});
            }
        });
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function logout(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token == null) {
            return res.status(401).send("Token is null");
        }

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.error("Error occurred while decoding token:", err);
                return res.sendStatus(401);
            }
            await RefreshTokens.findOneAndDelete({username: decoded.username});
        });
        if (res.statusCode === 401) return res;

        res.status(204).send("Token deleted successfully and user logged out");
    } catch (error) {
        console.error("Error occurred while deleting token:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function token(req, res) {
    try {
        const refreshToken = req.body.token;
        if (refreshToken == null) {
            return res.sendStatus(401);
        }
        const existingToken = await RefreshTokens.findOne({refreshToken});
        console.log("Token request received for user:", existingToken);
        if (!existingToken) {
            return res.sendStatus(401);
        }

        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }
            const accessToken = jwt.sign(makePayload(user), config.ACCESS_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_EXPIRES});
            res.status(201).json({accessToken});
        });
    } catch (error) {
        console.error("Error occurred while verifying refresh token:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function verifyAccount(req, res) {
    try {
        const {username, token} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({error: 'User does not exist'});
        }
        if (user.isVerified) {
            return res.status(401).json({error: 'You are already verified and ready to login with your credentials'});
        }

        let userGeneratedToken = user.verifyToken;
        if (userGeneratedToken !== token) {
            return res.status(401).json({error: 'Invalid verification token'});
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({message: 'Account verified successfully'});
    } catch (error) {
        console.error("Error occurred while verifying account:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function getVerifyStatus(req, res) {

    let verified = false;
    const {username} = req.body;

    const user = await User.findOne({username});

    if (!user) {
        return res.status(401).json({error: 'User does not exist'});
    }

    verified = !!user.isVerified;

    return res.status(200).json({verified: verified, verifyToken: user.verifyToken});
}

function makePayload(user) {
    return {id: user._id, username: user.username, email: user.email, role: user.role};
}

module.exports = {login, logout, token, verifyAccount, getVerifyStatus};
