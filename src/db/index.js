
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// 1-approch basic- Connect to MongoDB you can use ifi direct in entry file
/*(async()=>{
try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.error("MongoDB connection error:", error)
    })

    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
} catch (error) {
    console.error("ERROR:",error)
}
})(); */

const connectDB = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`/n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGO_D connection error:",error)
        process.exit(1)
    }
}

export default connectDB;