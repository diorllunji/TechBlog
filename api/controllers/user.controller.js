import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js";
import { Sequelize } from "sequelize";

export const test=(req,res)=>{
    res.json({message:'API is working'});
};

export const update = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const loggedInUserId = req.user.id.toString(); // Convert to string

        if (userId.toString() !== loggedInUserId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
        }

        const { password, username, email, profilePicture } = req.body;

        const updatedFields = {};

        if (password) {
            if (password.length < 6) {
                return next(errorHandler(400, 'Password must be at least 6 characters'));
            }
            updatedFields.password = bcryptjs.hashSync(password, 10);
        }

        if (username) {
            if (username.length < 7 || username.length > 20) {
                return next(errorHandler(401, 'Username must be between 7 and 20 characters long'));
            }
            if (username.includes(' ')) {
                return next(errorHandler(400, 'Username must not contain spaces'));
            }
            if (username !== username.toLowerCase()) {
                return next(errorHandler(400, 'Username must be lowercase'));
            }
            if (!username.match(/^[a-zA-Z0-9]+$/)) {
                return next(errorHandler(400, 'Username can only contain letters and numbers'));
            }
            updatedFields.username = username;
        }

        if (email) {
            updatedFields.email = email;
        }

        if (profilePicture) {
            updatedFields.profilePicture = profilePicture;
        }

        // Update the user record in the database
        const [updatedRowsCount] = await User.update(updatedFields, {
            where: { id: userId }
        });

        if (updatedRowsCount === 0) {
            return next(errorHandler(404, 'User not found'));
        }

        // Fetch the updated user after the update operation
        const updatedUser = await User.findByPk(userId);

        const { password: updatedPassword, ...rest } = updatedUser.toJSON();
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    const loggedInUserId = req.user.id.toString();

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        if (user.id.toString() !== loggedInUserId) {
            return next(errorHandler(403, 'You are not allowed to update this user'));
        }

        await User.destroy({ where: { id: userId } });

        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const signout=async(req,res,next)=>{
    try{
        res.clearCookie('access_token').status(200).json('User has been signed out');
    }
    catch(error){
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const order = req.query.sort === 'asc' ? 'ASC' : 'DESC'; // Adjusting for Sequelize order syntax

        const users = await User.findAll({
            order: [['createdAt', order]],
            offset: startIndex,
            limit: limit
        });

        const usersWithoutPassword = users.map(user => {
            const { password, ...rest } = user.toJSON(); // Sequelize models use toJSON to get the plain object
            return rest;
        });

        const totalUsers = await User.count();

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthUsers = await User.count({
            where: {
                createdAt: { [Sequelize.Op.gte]: oneMonthAgo }
            }
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        });
    } catch (error) {
        next(error);
    }
}