const express=require('express')
const postRouter=express.Router()
const {PostModel}=require('../models/postModel')
const jwt=require('jsonwebtoken')
// const { userRouter } = require('./userRoute')

postRouter.get('/', async (req,res)=>{
    let device=req.query.device
    let device1=req.query.device1
    let device2=req.query.device2
    const token=req.headers.authorization
    const decoded=jwt.verify(token, 'ironman')
    try{
        if(decoded){
            if(device1 && device2){
                const post= await PostModel.find({$or:[{device:device1},{device:device2}]})
                res.status(200).send(post)
            }else if(device){
                const post= await PostModel.find({device:device})
                res.status(200).send(post)
            }else{
                const post= await PostModel.find({'userID':decoded.userID})
                res.status(200).send(post)
            }
        }
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

postRouter.post('/add', async (req,res)=>{
    try{
        let post=new PostModel(req.body)
        await post.save()
        res.status(200).send({"msg":"New post has been added"})
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

postRouter.patch('/update/:id', async (req,res)=>{
    let id=req.params.id
    const post=await PostModel.findOne({"_id":id})
    const idInPost=post.userID
    const idRequesting=req.body.userID
    try{
        if(idRequesting!=idInPost){
            res.status(400).send({"msg":"You are Not Authorized"})
        }else{
            await PostModel.findByIdAndUpdate({"_id":id}, req.body)
            res.status(200).send({"msg":"Post has been Updated"})
        }
    }catch(err){
        res.status(400).send({"msg":"Something Went Wrong"})
    }
})

postRouter.delete('/delete/:id', async (req,res)=>{
    let id=req.params.id
    const post = await PostModel.findOne({"_id":id})
    const idInPost=post.userID
    const idRequesting=req.body.userID
    console.log(idInPost,idRequesting);
    try{
        if(idRequesting!=idInPost){
            res.status(400).send({"msg":"You are Not Authorized"})
        }else{
            await PostModel.findByIdAndDelete({"_id":id})
            res.status(200).send({"msg":"Post has been deleted"})
        }
    }catch(err){
        res.status(400).send({"msg":"Something Went Wrong"})
    }
})

module.exports={postRouter}