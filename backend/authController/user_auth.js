import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async(req,res)=>{
   let {email,password,firstName,lastName}=req.body;
    try {
        firstName=firstName.trim()+" ";
        lastName=lastName.trim();
        //validations code
        if( !email || !password || !firstName){
            return res.status(400).json( {message: "All fieds are required , retry" } );
        }
        if( password.length < 6){
            return res.status(400).json( {message : "Password length must be atleast 6 characters long" } );
        }

        //format specifier for email validation check
        const emailCheck=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if( !emailCheck.test(email)){
            return res.status(400).json( {message : "Invalid email format"} );
        }

        //searching users with same email
        const existingEmailUser=await User.findOne({email:email});
        
        if(existingEmailUser){
            return res.status(400).json( {message : "Email already exists , please enter a different one"} );
        }

        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const avatar=`https://avatar.iran.liara.run/public/${randomNumber}.png`;

        const newUser=await User.create({
            email,
            firstName,
            lastName:lastName,
            password,
            profilePic: avatar,
        });

        //signing up stream user
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: (newUser.firstName).concat(newUser.lastName),
                image: newUser.profilePic || "",
            });

            console.log(`Stream user ${newUser.firstName} was successfully created`);

        } catch (error) {
            
            console.log(`ERROR IN CREATING STREAM USER: ${error}`);
        }
        
        const accessToken=jwt.sign({userID:newUser._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"10d"
        });

        //adding accessToken to cookie
        res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV==="production", 
        sameSite: 'Strict', 
        maxAge: 10 * 24 * 60 * 60 * 1000 
        });
     
        res.status(201).json({ succeess: true, user:newUser});

    } catch (error) {

        console.log(`Signin Error ${error}`);
        res.status(500);
    }

}


export const login = async(req,res)=>{
    const {email,password}=req.body;
    try {
        
        if(!email || !password){
            return res.status(400).json( {message: "Both fields are required"} );
        }

        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(401).json( {message : "User does not exists"} );
        }

        const passwordMatches=await bcrypt.compare(password , existingUser.password);
        if(!passwordMatches){
            return res.status(401).json( {message : "Invalid Password"} );
        }

        const accessToken=jwt.sign({userID:existingUser._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"10d"
        });

        //adding accessToken to cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV==="production", 
            sameSite: 'Strict', 
            maxAge: 10 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ succeess: true, user:existingUser});



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}


export const logout = async(req,res)=>{
    res.clearCookie("accessToken");
    res.status(200).json( {message: "Logout Successful"} )
}


export const Profile = async(req,res)=>{

    try {
        const userID= req.user._id;
        const { firstName, lastName, location, bio }=req.body;

        if(!firstName || !location || !bio){
            return res.status(400).json( {message: "Please fill all required fields "} );
        }

        const updatedUser=await User.findByIdAndUpdate(userID,{
            firstName,
            lastName,
            location,
            bio,
            profile_created:true,
        }, {new:true});

        if(!updatedUser){
            return res.status(404).json( {message : "USER NOT FOUND"} );
        }

        //upsert stream user
        try {
            await upsertStreamUser( {
                id: updatedUser._id.toString(),
                name:((updatedUser.firstName).concat(updatedUser.lastName)),
                image:updatedUser.profilePic ||'',
            });
            console.log(`Stream User ${updatedUser.firstName} was updated`);

        } catch (error) {
            console.log(`AN ERROR HAS OCCURED IN UPDATING THE STREAM USER DURING PROFILE CREATION ${error}`);            
        }
      
        res.status(200).json( {succeess:true , user:updatedUser} );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}