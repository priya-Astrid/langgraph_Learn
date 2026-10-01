import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import dotenv from "dotenv";
dotenv.config();

export const generateModel= async()=>{
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-3-flash-preview",
        apiKey: process.env.Google_API_KEY
    })
   
    return model;
}