const express = require('express');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const commentRouter = require('./routes/commentRouter');
const app=express();
const port=process.env.PORT||3000
const dotenv=require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/post',postRouter)
app.use('/user',userRouter)
app.use('/comment',commentRouter)

app.listen(port,()=>{
     console.log(`Server is listening to ${port}`);
})
