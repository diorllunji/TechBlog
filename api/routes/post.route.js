import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import { createPost,getPosts } from '../controllers/post.controller.js';

const router=express.Router();
router.post('/create',verifyToken, createPost);
router.get('/getposts',getPosts);

export default router;