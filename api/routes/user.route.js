import express from 'express';
import { test, update } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router=express.Router();

router.get('/test',test);
router.put('/update/:userId', verifyToken ,update);

export default router;