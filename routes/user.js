const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                error: 'Username & password required'
            })
        }

        const existingUser = await User.findOne({
            username
        })
        if (existingUser) {
            return res.status(409).json({
                error: 'Username already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            username,
            password: hashedPassword
        })
        await user.save()
        res.status(201).json({
            message: 'Registration successful'
        })
    } catch (err) {
        res.status(500).json({
            error: 'Internal server error'
        })
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )
        res.json({ token })
    } catch (err) {
        res.status(500).json({
            error: 'Internal server error'
        })
    }
})

module.exports = router