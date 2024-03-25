import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return next(errorHandler(400, 'Email already exists'));
        }

        // Hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

       
        await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        res.json({ message: 'Signup successful' });
    } catch (error) {
        next(error); 
    }
};