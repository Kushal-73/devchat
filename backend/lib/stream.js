import {StreamChat} from "stream-chat";
import "dotenv/config";

const apikey=process.env.STREAM_API_KEY;
const apiKeySecret=process.env.STREAM_API_SECRET;

if(!apikey || !apiKeySecret){
    console.error("STREAM API KEY OR SECRET KEY IS MISSING");
}

//creating api client for stream
const streamClient=StreamChat.getInstance(apikey, apiKeySecret);

export const upsertStreamUser= async (userData) =>{
    try {
        //upserting user to stream requires an array of user so [] is necessary
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("ERROR UPSERTING STREAM USER:",error);
    }
}

export const generate_stream_token= (userId)=>{
    try {

        const userIdString=userId.toString();
        return streamClient.createToken(userIdString);

    } catch (error) {
        console.log(`ERROR IN GENERATING STREAM TOKEN : ${error}`);
    }
}
