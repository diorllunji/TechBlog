import Post from "../models/post.model.js";
import {errorHandler}  from "../utils/error.js";
import User from "../models/user.model.js";

export const createPost = async (req, res, next) => {
    try {
        // Fetch the user from Sequelize
        const user = await User.findByPk(req.user.id);
        
        if (!user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to create a post'));
        }

        // Check if required fields are provided
        if (!req.body.title || !req.body.content) {
            return next(errorHandler(400, 'Please provide all required fields'));
        }

        // Generate the slug
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');

        // Create a new post with the user id from Sequelize
        const newPost = await Post.create({
            ...req.body,
            slug,
            userId: req.user.id // Use the user id from Sequelize
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};
