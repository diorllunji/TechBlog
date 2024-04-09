import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSguB9wiXHIxPQ-fJDPLgRP5D9vNcokOa2mFbdL9-4nww&s'
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
},{timestamps:true});

const Post=mongoose.model('Post',postSchema);

export default Post;