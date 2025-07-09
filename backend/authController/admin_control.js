import User from "../models/users.js"

export const getAllUsers= async (req,res)=>{


    try {
        const userId=req.user.id;

        const allUsers= await User.find({
            $and: [
                {_id: {$ne: userId}},
                {profile_created: true},
            ],
        });

        return res.status(200).json(allUsers);

    } catch (error) {
        console.log(`ERROR IN :${error}`);
        res.status(500).json( {message: "INTERNAL SERVER ERROR"} );
    }
}

export const banUser= async(req,res)=>{
    try {

        const reqId=req.params.id;
        const updatedUser=await User.findByIdAndUpdate(reqId,{
            isBanned:'true',
        },{ new: true , runValidators: true });

        res.status(200).json({
            user: updatedUser,
            message:'success'
        });

    } catch (error) {
         console.log(`ERROR IN : ${error}`);
        res.status(500).json( {message: "INTERNAL SERVER ERROR"} );
    }


}


export const unBanUser= async(req,res)=>{
    try {

        const reqId=req.params.id;
        const updatedUser=await User.findByIdAndUpdate(reqId,{
            isBanned:'false',
        },{ new: true , runValidators: true });

        res.status(200).json({
            user: updatedUser,
            message:'success'
        });

    } catch (error) {
         console.log(`ERROR IN : ${error}`);
        res.status(500).json( {message: "INTERNAL SERVER ERROR"} );
    }


}