const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
);

exports.register = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const validRoles = ['admin', 'seller', 'client'];
        const userRole = validRoles.includes(role) ? role : 'client';

        if (await User.findOne({ where: { username, role: userRole } })) {
            res.status(400); 
            throw new Error(`An account with the role '${userRole}' already exists for this email.`);
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.create({ username, password, verificationCode, role: userRole });

        const emailHTML = `
            <h2>Welcome to our App!</h2>
            <p>Your ${userRole} account has been created. Please use the OTP code below to verify your account:</p>
            <h1 style="color: blue; letter-spacing: 5px;">${verificationCode}</h1>
            <p>This code is valid right now.</p>
        `;

        try {
            await sendEmail({
                email: user.username,
                subject: `Account Verification (${userRole}) - Your OTP Code`,
                html: emailHTML,
            });

            res.status(201).json({ 
                success: true, 
                message: `Registration successful. An email has been sent.`
            });

        } catch (emailError) {
            await user.destroy();
            console.error('Email Error:', emailError);
            res.status(500);
            throw new Error('Could not send verification email. Please try again.');
        }
    } catch (error) { 
        next(error); 
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const userRole = role || 'client';
        
        const user = await User.findOne({ where: { username, role: userRole } });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                res.status(403);
                throw new Error('Please verify your account first. Check your email for the OTP.');
            }

            const token = generateToken(user.id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 
            }).status(200).json({ 
                success: true, 
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } else {
            res.status(401);
            throw new Error('Incorrect email, password, or role.');
        }
    } catch (error) { 
        next(error); 
    }
};

exports.verifyAccount = async (req, res, next) => {
    try {
        const { username, verificationCode } = req.body;
        
        const user = await User.findOne({ where: { username, verificationCode } });

        if (!user) {
            res.status(404);
            throw new Error('Invalid verification code or user not found');
        }

        if (user.isVerified) {
            res.status(400);
            throw new Error('Account already verified');
        }

        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 
            }).status(200).json({ 
                success: true, 
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        next(error);
    }
};

exports.resendOTP = async (req, res, next) => {
    try {
        const { username, role } = req.body;
        const userRole = role || 'client';

        const user = await User.findOne({ where: { username, role: userRole } });

        if (!user) {
            res.status(404);
            throw new Error('User not found.');
        }

        if (user.isVerified) {
            res.status(400);
            throw new Error('Account is already verified. You can log in.');
        }

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = newCode;
        await user.save();

        const emailHTML = `
            <h2>Welcome back to Luxe.</h2>
            <p>You requested a new verification code for your ${userRole} account.</p>
            <h1 style="color: blue; letter-spacing: 5px;">${newCode}</h1>
            <p>This code is valid right now.</p>
        `;

        await sendEmail({
            email: user.username,
            subject: `Account Verification (${userRole}) - Your New OTP`,
            html: emailHTML,
        });

        res.status(200).json({
            success: true,
            message: 'A new verification code has been sent to your email.'
        });
    } catch (error) {
        next(error);
    }
};