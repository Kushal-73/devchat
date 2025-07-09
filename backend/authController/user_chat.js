import { generate_stream_token } from "../lib/stream.js";

export const getStreamToken= async (req,res)=>{

    try {

        const token= generate_stream_token(req.user.id);

        res.status(200).json({token});

    } catch (error) {
        console.log(`PROBLEM IN getStreamToken : ${error}`);
        res.status(500).json({message : "INTERNAL SERVER ERROR"});
    }
}


