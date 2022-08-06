const Router=require("express").Router();

const admin=require("../config/firebase.config");

const user=require("../models/user")


Router.get("/login", async(req,res)=>{
    if(!req.headers.authorization){
        return res.status(500).send({message: "Invaild Token"})
    }
    const token=req.headers.authorization.split(" ")[1];
    try{
        const decodedValue=await admin.auth().verifyIdToken(token);
        if(!decodedValue){
            return res.status(505).json({message:"UnAuthorization"})
        }
        else{
            // return res.status(200).json(decodedValue)
            const userExists=await user.findOne({"user_id":decodedValue.user_id})
            if(!userExists){
                newUserData(decodedValue,req,res)
                // return res.send("hello")
            }
            else{
                UpdateNewUserData(decodedValue,req,res)
            }
        }
    }
    catch(error){
        return res.status(505).json({message:error})
    }

   
})

const newUserData=async (decodedValue,req,res)=>{
    const newUser=new user({
        name:decodedValue.name,
        email:decodedValue.email,
        imageURL:decodedValue.picture,
        user_id:decodedValue.user_id,
        email_verified:decodedValue.email_verified,
        role:"member",
        auth_time:decodedValue.auth_time
    })
    try{
        const savedUser=await newUser.save();
        res.status(200).send({user:savedUser})
    }
    catch(error){
        res.status(400).send({success:false,msg:error})
    }
}

const UpdateNewUserData=async(decodedValue,req,res)=>{
    const filter={user_id:decodedValue.user_id};

    const options={
         upsert:true,
         new:true
    };
    try{
        const result=await user.findOneAndUpdate(
            filter,
            {auth_time:decodedValue.auth_time},
            options
        );
        res.status(200).send({user:result})

    }catch(error){
        res.status(400).send({success:false,msg:error})
    }
}

module.exports=Router;