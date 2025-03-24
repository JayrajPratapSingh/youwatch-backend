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

export {app};