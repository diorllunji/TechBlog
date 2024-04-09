import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createCategory,updateCategory,deleteCategory,getCategories } from "../controllers/category.controller.js";

const router=express.Router();

router.post('/createcategory',verifyToken,createCategory);
router.get('/getcategory',getCategories);
router.delete('/deletecategory/:categoryId/:userId',verifyToken,deleteCategory);
router.put('/updatecategory/:categoryId/:userId',verifyToken,updateCategory);


export default router;