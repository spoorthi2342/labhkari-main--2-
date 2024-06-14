// controllers/auth.controller.ts
import { RequestHandler } from 'express';
import User from '../models/User.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRegister: RequestHandler = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const userId = ((length, chars) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))(5, '0123456789');

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        // Insert new user into the database
        const newUser = new User({
            userId,
            username,
            email,
            phone,
            password: hashedPassword
        });
        await newUser.save();

        // Create JWT token for session management, and user management
        const token = jwt.sign({ userId }, 'secret123', { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000), // Expires in 1 hour
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            users: { userId: userId },
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal server error");
    }
};

const userRef: RequestHandler = async (req, res) => {
    try {
        const { ref } = req.body;

        const user = await User.findOne({ userId: ref });
        if (user) {
            return res.status(200).json({
                success: true,
                message: "User related ref",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "User unrelated ref",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal server error");
    }
};

const userLogin: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).select('userId password');
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("Found user:", user);

        // Compare the hashed password from the database with the provided password
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", passwordMatch);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Provided password:", hashedPassword);
        console.log("Stored hashed password:", user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const uid = user.userId;
        const token = jwt.sign({ uid }, 'secret123', { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000), // Expires in 1 hour
        });

        return res.status(200).json({
            success: true,
            message: "Passwords Matched",
            userIds: { uid }
        });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).send("Internal server error");
    }
};

export { userLogin, userRegister, userRef };
