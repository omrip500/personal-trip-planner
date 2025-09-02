const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ✅ Register Page
router.get('/register', (req, res) => {
    if (req.cookies.token) return res.redirect('/plan-route'); // Prevent access if logged in
    res.render('register', { error: null, user: null, title: 'Register - TripPlanner' });
});

// ✅ Handle Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: 'Email already registered', user: null, title: 'Register - TripPlanner' });
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashed });

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('register', { error: 'Server error', user: null, title: 'Register - TripPlanner' });
    }
});

// ✅ Login Page
router.get('/login', (req, res) => {
    if (req.cookies.token) return res.redirect('/plan-route'); // Prevent access if logged in
    res.render('login', { error: null, user: null, title: 'Login - TripPlanner' });
});

// ✅ Handle Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.render('login', { error: 'User not found', user: null, title: 'Login - TripPlanner' });

        // Validate password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.render('login', { error: 'Invalid credentials', user: null, title: 'Login - TripPlanner' });

        // Generate JWT
        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '12h' });

        // ✅ Set secure cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // Protect against CSRF
            maxAge: 1000 * 60 * 60 * 12 // 12 hours
        });

        res.redirect('/plan-route');
    } catch (err) {
        console.error(err);
        res.status(500).render('login', { error: 'Server error', user: null, title: 'Login - TripPlanner' });
    }
});

// ✅ Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.redirect('/login');
});

module.exports = router;
