const express = require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const {default:mongoose} = require("mongoose");
const port =process.env.PORT || 5000;


// app.use(cors())
// app.use(express.json())

const userRoutes=require("./Routes/auth");

app.use("/api/users/",userRoutes);


app.get("/",(req,res)=>{
    res.send('you are ready')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fik8mtj.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri,{useNewUrlParser:true})
mongoose.connection
.once("open",()=>console.log("connected"))
.on("error",(error)=>{
console.log(`ERROR : ${error}`);
})


app.listen(port,()=>{
    console.log('all ok you are go');
})