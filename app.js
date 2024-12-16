
const cors = require("cors")
const express = require("express")
const app = express()
app.use(cors())
const userRouter = require("./routers/userRouter")
const productRouter = require("./routers/productesRouter")
const connectDB = require("./config/mongodb");


require("dotenv").config();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

connectDB();

app.use("/user",userRouter)
app.use("/product",productRouter)

app.listen(3000,()=>{
    console.log("Server Running on port 3000")
})

