import User from "../models/users.js"

import friendRequest from "../models/friendRequest.js";

export const getRecoUser= async (req,res)=>{

    try {
        const userId=req.user.id;
        const currentUser=await User.findById(userId);

        const recoUsers= await User.find({
            $and: [
                {_id: {$ne: userId}},
                {_id: {$nin: currentUser.friends}},
                {profile_created: true}
            ],
        });

        res.status(200).json( recoUsers);

    } catch (error) {
        console.log(`ERROR IN GETTING RECOMENDED USERS ${error}`);
        res.status(500).json( {message: "INTERNAL SERVER ERROR"} );
    }
}


export const getFriends= async (req,res)=>{
    
    try {
        //to populate user friends with their name and locartion
        const user= await User.findById(req.user.id)
        .select("friends")
        .populate("friends","firstName lastName location profilePic");

        res.status(200).json(user.friends);

    } catch (error) {
        console.log(`ERROR IN GETTING FRIENDS OF USERS ${error}`);
        res.status(500).json( {message: "INTERNAL SERVER ERROR"} );
    }
}


export const sendFriendRequest= async (req,res)=>{

    try {
        const currentUserID=req.user.id;
        const recipientID=req.params.id;

        if(currentUserID ===recipientID){
            return res.status(400).json( {message : "CANNOT SEND FRIEND REQUEST TO YOURSELF"} );
        }

        const recipient= await User.findById(recipientID);
        if(!recipient){
            return res.status(400).json( {message : "USER DOES NOT EXIST"} );
        }
        
        const alreadyFriend= await recipient.friends.includes(currentUserID);
        if(alreadyFriend){
            return res.status(400).json( {message : "USER IS ALREADY FRIEND"} );
        }

        const existingReq= await friendRequest.findOne({
            $or: [
                {sender:currentUserID ,recipient:recipientID},
                {sender:recipientID ,recipient:currentUserID},
            ],
        });
        if(existingReq){
            return res.status(400).json( {message : "THERE IS AN ALREADY EXISTING FRIEND REQUEST"} );
        }

        const friendReq=await friendRequest.create({
            sender:currentUserID,
            recipient:recipientID           
        });

        res.status(201).json(friendReq);

    } catch (error) {
        console.log(`ERROR IN SENDING FRIEND REQUEST ${error}`);
        res.status(500).json( {message : "INTERNAL SERVER ERROR"} );
    }
}


export const acceptFriendRequest= async (req,res)=>{
    try {

        const reqID=req.params.id;
        const friendReq=await friendRequest.findById(reqID);
        if(!friendReq){
            res.status(400).json( {message : "NO FRIEND REQUEST IS FOUND"} );
        }

        if(friendReq.recipient.toString() !== req.user.id){
            res.status(403).json( {message : "UNAUTHORIZED"} );
        }

        friendReq.status="accepted";  
        await friendReq.save();

        //$addToSet adds elements to array only if they do not already exist
        await User.findByIdAndUpdate(friendReq.sender,{
            $addToSet: {friends : friendReq.recipient},
        });

        await User.findByIdAndUpdate(friendReq.recipient,{
            $addToSet: {friends : friendReq.sender},
        });
        
        res.status(200).json( {message : "Friend request is accepted successfully"} );

    } catch (error) {
        console.log(`ERROR IN ACCEPTING FRIEND REQUEST ${error}`);
        res.status(500).json( {message : "INTERNAL SERVER ERROR"} );
    }
}


export const getFriendReq= async (req,res)=>{
    try {
        const incomingReq= await friendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender","firstName lastName profilePic location");

        const acceptedReq= await friendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient","firstName lastName profilePic location");

        res.status(200).json({incomingReq , acceptedReq});

    } catch (error) {
        console.log(`ERROR IN GETTING FRIEND REQUEST AMD ACCEPTED REQUEST : ${error}`);
        res.status(500).json( {message : "INTERNAL SERVER ERROR"} ); 
    }
}


export const getOutFriendReq= async (req,res)=>{
    try {
        
        const sentReq= await friendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","firstName lastName profilePic location");

        res.status(200).json(sentReq);
        
    } catch (error) {
         console.log(`ERROR IN FINDING SENT REQUESTS: ${error}`);
        res.status(500).json( {message : "INTERNAL SERVER ERROR"} );
    }
}