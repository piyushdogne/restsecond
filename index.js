require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
  
 
mongoose.connect(MONGODB_URI).then(()=>{console.log("connected with mongodb")}).catch((err)=>(console.log(err)));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
const productSchema = new mongoose.Schema({
    name:String,
    description:String,
    price:Number 
})      

const Product = new mongoose.model("Product" , productSchema);



//THIS IS A POST API TO CREATE THE DATA SET
app.post("/api/product/create", async (req , res)=>{
 
    const product = await Product.create(req.body)
    res.status(200).json({success:true , product})
}) 

// NOW THIS IS A GET API IN ORDER TO FIND AND READ THE EXISTING DATA SET
 
app.get("/api/products", async (req , res)=>{
    const products = await Product.find();
    res.status(200).json({success:true , products})
})

//AND THIS IS THE PUT API IN ORDER TO UPDATE THE EXISTING DATA SET


app.put("/api/product/:id" , async (req , res)=>{
    
    let product = await Product.findById(req.params.id);
    
    product = await Product.findByIdAndUpdate(req.params.id , req.body ,{
        new:true,
        useFindAndModify:false,
        runValidators:true
    })  
    res.status(200).json({success:true , product})

})


// FINAL ROUTE FOR THE DELETETION PURPOSE OF DATA

app.delete("/api/product/:id", async (req , res)=>{
    const product = await Product.findById(req.params.id);
    
    if(!product){
        res.status(500).json({success:false , message:"Product not found"})
    }
    await product.deleteOne();

    res.status(200).json({   
        success:true,
        message:"product deleted successfully"
    })  
 
})



app.listen(PORT , ()=>{console.log("server connected on 5000")})
