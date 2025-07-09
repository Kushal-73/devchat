import express from "express";


import route_authentication from "../middleware/route_authentication.js";
import { banUser, getAllUsers, unBanUser } from "../authController/admin_control.js";

const router=express.Router();

router.use(route_authentication);

router.get('/allUsers',getAllUsers);

router.put('/:id/ban',banUser);

router.put('/:id/unban',unBanUser);

export default router;