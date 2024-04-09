import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        default:'Uncategorized'
    },
}, { timestamps: true });

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

export default Category;