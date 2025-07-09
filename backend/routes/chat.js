import express from "express";
import route_authentication from "../middleware/route_authentication.js";
import { getStreamToken } from "../authController/user_chat.js";

const router=express.Router();

router.get('/token',route_authentication,getStreamToken);

export default router;