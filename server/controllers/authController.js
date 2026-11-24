// filepath: smart-campus-complaint-system/server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { email, password, role, name, department } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !role || !name || !department) {
            return res.status(400).json({ 
                message: 'All fields are required: email, password, role, name, department' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate role
        if (!['student', 'staff'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be student or staff' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email: email.trim(),
            password: hashedPassword,
            role,
            name: name.trim(),
            department: department.trim()
        });

        await newUser.save();
        console.log('User registered successfully:', { email, role, name, department });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login a user
const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Email, password and role are required'
            });
        }

        // Validate role
        if (!['student', 'staff', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Invalid role'
            });
        }

        // Find user in database
        const user = await User.findOne({
            email: email.trim(),
            role
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or role'
            });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        });
    }
};

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
    try {
        console.log('getUserStats called');
        
        const totalUsers = await User.countDocuments();
        console.log('Total users:', totalUsers);
        
        const studentCount = await User.countDocuments({ role: 'student' });
        console.log('Student count:', studentCount);
        
        const staffCount = await User.countDocuments({ role: 'staff' });
        console.log('Staff count:', staffCount);
        
        const stats = {
            total: totalUsers,
            students: studentCount,
            staff: staffCount
        };
        
        console.log('Returning user stats:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error in getUserStats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, getUserStats };