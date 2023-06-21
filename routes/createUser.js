const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = "bcdefghi"


//sign up
router.post('/createUser', [
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password', 'incorrect password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10)
        const securePassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: securePassword,
        });

        res.json({ success: true, user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.json({ success: false, error: error.message });
    }
});


    // log in
router.post('/loginUser', [
    body('email').isEmail(),

    body('password', 'incorrect password').isLength({ min: 5 })],
    async (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let email = req.body.email
        try {
            // Find the user in the database based on the provided email
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: "try loggin in with correct credentials" })
            }
            // Compare the provided password with the hashed password stored in the database

            const pwdCompare = await bcrypt.compare(req.body.password, userData.password)
            if (!pwdCompare) {
                return res.status(400).json({ errors: "try loggin in with correct credentials" })

            }
            // If the password is correct, create a payload containing the user's ID

            const data = {
                user: {
                    id: userData.id
                }
            }
            // Generate a JSON Web Token (JWT) using the payload and a secret key

            const authToken = jwt.sign(data, jwtSecret)
            return res.json({ success: true, authToken: authToken })


        } catch (error) {
            console.error('Error creating user:', error);
            res.json({ success: false, error: error.message });
        }
    });


module.exports = router;
