import express from "express";

const router=express.Router();

import route_authentication from '../middleware/route_authentication.js';
import { login , logout , signup , Profile } from '../authController/user_auth.js'

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',logout);

router.post('/profile', route_authentication , Profile);

router.get('/me',route_authentication ,(req,res)=>{
    res.status(200).json( {success : true, user : req.user} )
}); 

export default router;