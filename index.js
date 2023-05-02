const express=require('express')
const {connection}=require('./db')
require('dotenv').config()
const {userRouter}=require('./routes/userRoute')
const {postRouter}=require('./routes/postRoute')
const {auth}=require('./middlewares/auth.middleware')

const app=express()
app.use(express.json())

app.get('/', (req,res)=>{
    res.status(200).send('Welcome to Homepage')
})

app.use('/users', userRouter)
app.use(auth)
app.use('/posts', postRouter)

app.listen(process.env.port, async ()=>{
    try{
        await connection
        console.log('Connected to Database');
    }catch(err){
        console.log(err);
        console.log('Something went wrong');
    }
    console.log(`Server is running on ${process.env.port}`);
})