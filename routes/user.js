const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const crypto = require('crypto')
const sendMail = require('../utils/mailer')

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
        const confirmationHTML =
            `
            <h1>Welcome to our BOOK API</h1>
            <p>Thank you for registering. ${username}</p>
        `
        await sendMail(username, 'Registration Confirmation', confirmationHTML)
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

// FORGOT PWD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' })

    try {
        const user = await User.findOne({ username: email })
        if (!user) return res.status(404).json({
            error: 'User not found'
        })

        const token = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1hr expiry
        await user.save()

        const html = `
            <p>You requested a password reset.</p>
            <p>Here is your password reset token:</p>
            <h3>${token}</h3>
            <p>This token will expire in 1 hour.</p>
        `;
        await sendMail(email, 'Password Reset Token', html);

        res.json({
            message: 'Password reset link sent to your email'
        })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    if (!newPassword) return res.status(400).json({ error: 'New password is required' })

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router