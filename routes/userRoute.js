const express=require('express')
const userRouter=express.Router()
const {UserModel}=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

userRouter.post('/register', async(req,res)=>{
    const {name,email,gender,password}=req.body
    try{
        bcrypt.hash(password, 5, async(err,secure_pass)=>{
            if(err){
                console.log(err);
                res.status(400).send({"msg":"Something went wrong!"})
            }else{
                const user=new UserModel({name,email,gender,password:secure_pass})
                await user.save()
                res.status(200).send({"msg":"Registration Done!"})
            }
        })
    }catch(err){
        res.status(400).send({"msg":"Error in Registration!"})
    }

})

userRouter.post('/login', async (req,res)=>{
    const {email,password}=req.body
    try{
        const user= await UserModel.find({email})
        //console.log(user);
        const hashed_pass=user[0].password  
        if(user.length>0){
            bcrypt.compare(password, hashed_pass, (err,result)=>{
                if(result){
                    const token= jwt.sign({userID:user[0]._id}, 'ironman')
                    res.status(200).send({"msg":"Login Successfull", 'token':token})
                }else{
                    res.status(400).send({"msg":"Wrong Credentials!"})
                }
            })
        }else{
            res.status(400).send({"msg":"Wrong Credentials!"})
        }
    }catch(err){
        res.status(400).send({"msg":"Error in Login!"})
    }
})

module.exports={userRouter}