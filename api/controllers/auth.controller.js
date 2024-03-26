import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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

export const signin=async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email||!password||email===''||password===''){
        next(errorHandler(400,'All fields are required'));
    }

    try{
        const validUser=await User.findOne({where:{email}});

        if(!validUser){
            next(errorHandler(404,'User not found!'));
        }

        const validPassword=bcryptjs.compareSync(password,validUser.password);

        if(!validPassword){
            next(errorHandler(400,'Invalid password!'));
        }

        const token=jwt.sign(
            {id:validUser.id}, process.env.JWT_SECRET
        )

        const {password:pass, ...rest}=validUser.toJSON();

        delete rest.password;

        res.status(200).cookie('access_token',token,{
            httpOnly:true
        }).json(rest);

    }catch(error){
        next(error);
    }
}