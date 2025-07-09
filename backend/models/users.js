import mongoose from "mongoose";
import hatch_pass from "../middleware/hatch_pass.js";

const userSchema=new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default:"",
        },
        location: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "i love devchat",
        },
        profile_created: {
            type: Boolean,
            default: false,
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        isBanned:{
            type:Boolean,
            default:false
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
    },
    { timestamps: true }
);

//hashing password for security measure
userSchema.pre("save", hatch_pass);

const User=mongoose.model("User",userSchema);

export default User;