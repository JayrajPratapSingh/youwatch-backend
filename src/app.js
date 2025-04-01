import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({    // for cross origin resorce sharing 
    origin: "process.env.CORS_ORIGIN",
    credentials: true
}))

app.use(express.json({limit: "16kb"})); //for from data

app.use(express.urlencoded({extended: true, limit:"16kb"})); // for url encoded data like if pram data from frontend url

app.use(express.static("public")); // for static files like: images, pdf etc

app.use(cookieParser()); // for cookies reading
// route import
import userRouter from "./routes/user.routes.js"


// routes declarations

app.use("/api/v1/users", userRouter) // the first is for on which route(it will work as prefix route) and second is for which router do you want to activate it will be inside a middlewatre app.use because we seperated router and controllers


export {app};