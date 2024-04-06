import express from 'express';
import { test, update,deleteUser, signout,getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router=express.Router();

router.get('/test',test);
router.put('/update/:userId', verifyToken ,update);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signout);
router.get('/getusers',verifyToken,getUsers);

export default router;