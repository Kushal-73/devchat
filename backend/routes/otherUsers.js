import express from "express";

import route_authentication from "../middleware/route_authentication.js";
import {getFriends,getRecoUser,sendFriendRequest,acceptFriendRequest,getOutFriendReq,getFriendReq} from "../authController/user_control.js";

const router=express.Router();

router.use(route_authentication);

router.get('/',getRecoUser);

router.get('/friends',getFriends);

router.post('/friend-request/:id',sendFriendRequest);

router.put('/friend-request/:id/accept',acceptFriendRequest);

router.get('/friend-requests', getFriendReq);

router.get('/outgoing-friend-request',getOutFriendReq);

export default router;