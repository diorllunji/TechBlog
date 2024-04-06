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

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const query = {};

        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.slug) {
            query.slug = req.query.slug;
        }

        if (req.query.postId) {
            query._id = req.query.postId;
        }

        if (req.query.searchTerm) {
            query.$or = [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ];
        }

        const posts = await Post.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments(query);

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
            ...query, // Include other conditions in the last month count
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.userId);

        if (!user || !user.isAdmin || user.id !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to delete this post'));
        }

        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updatePost=async(req,res,next)=>{
    const user = await User.findByPk(req.params.userId);

    if (!user || !user.isAdmin || user.id !== req.user.id) {
        return next(errorHandler(403, 'You are not allowed to edit this post'));
    }

    try{
        const updatedPost=await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set:{
                    title:req.body.title,
                    content:req.body.content,
                    category:req.body.category,
                    image:req.body.image,
                }},{new:true})
                res.status(200).json(updatedPost);
     }catch(error){
        next(error)
     }
        
    }
