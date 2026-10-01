import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb"
import { MongoClient } from "mongodb"

export const mongoDBConnection = () => {
    const client = new MongoClient(process.env.MONGODB_URL)
    const checkpointer = new MongoDBSaver({
        client
    })
    return checkpointer;
} 