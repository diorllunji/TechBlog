import { errorHandler } from "../utils/error.js"
import Category from "../models/category.model.js"
import User from "../models/user.model.js"
import Post from "../models/post.model.js"

export const createCategory=async (req,res,next)=>{
    try{

    const user = await User.findByPk(req.user.id);

    if (!user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a category'));
    }
    
    if (!req.body.name) {
        return next(errorHandler(400, 'Please provide category name'));
    }

    const newCategory=await Category.create({
        userId:req.user.id,
        ...req.body
    });

    res.status(201).json(newCategory);
    }catch(error){
    next(error);
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.userId);

        if (!user || !user.isAdmin || user.id !== req.user.id) {
            return next(errorHandler(403, 'You are not authorized to delete this category'));
        }

        const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);

        if (!deletedCategory) {
            return next(errorHandler(404, 'Category not found'));
        }

        const uncategorizedCategory = await Category.findOne({ name: 'Uncategorized' });

        if (!uncategorizedCategory) {
            return next(errorHandler(500, 'Uncategorized category not found'));
        }

        await Post.updateMany(
            { category: deletedCategory._id },
            { $set: { category: uncategorizedCategory._id } }
        );

        res.status(200).json({ message: 'Category has been deleted' });
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};


export const updateCategory=async (req,res,next)=>{
    const user = await User.findByPk(req.params.userId);

    if (!user || !user.isAdmin || user.id !== req.user.id) {
        return next(errorHandler(403, 'You are not allowed to edit this category'));
    }
    try{
        const updatedCategory=await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                $set:{
                    name:req.body.name,
                }},{new:true})
                res.status(200).json(updatedCategory);
    }catch(error){
        next(error);
    }
}