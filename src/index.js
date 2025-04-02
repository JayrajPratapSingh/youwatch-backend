import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 8000;
connectDB().then(()=>{

    app.on("error", (error)=>{
        console.error("MongoDB connection error:", error)
        throw error;
    })
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
}).catch((err)=>{
    consol.log("MongoDB connection failed:", err)
})







