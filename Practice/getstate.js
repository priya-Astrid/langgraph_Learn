import { END, MemorySaver, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph"
import { generateModel } from "../config/generateModel.js"
import { HumanMessage } from "@langchain/core/messages"
import { MongoClient } from "mongodb"
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb"
// import { mongoDBConnection } from "../config/mondodb"
import dotenv from "dotenv";
dotenv.config()
export const getStateData = async () => {
    const client = new MongoClient(process.env.MONGODB_URL)
    const checkpointer = new MongoDBSaver({
        client
    })
    await checkpointer.setup();
    // state
    const model = await generateModel();
    const State = new StateSchema({
        messages: MessagesValue
    })
    //  node

    const chatProcess = async (state) => {
        const result = await model.invoke(state.messages);
        console.log("result data", result.content);

        return { messages: [result.content] };
    }
    // graph

    const workFlow = new StateGraph(State)
        .addNode("chat", chatProcess)
        .addEdge(START, "chat")
        .addEdge("chat", END)

    // const memory = new MemorySaver();


    const addProcess = workFlow.compile({
        // checkpointer: memory
        checkpointer
    });
    // thread id
    const config = {
        configurable: {
            thread_id: "priya123"
        }
    }

    const finalResponse = await addProcess.invoke({
        messages: [
            new HumanMessage("what is my name"),
        ],

    },
        config);
    // const state = await addProcess.getState(config);
    // state.values.messages.forEach((message)=>{
    //     console.log(`${message.getType()}: ${message.content}`)
    // })

    const history = await addProcess.getStateHistory(config)
    console.log("data history", history)
    for await (const checkpoint of history) {
        console.log("data", checkpoint.values.messages.at(-1)?.content);
        console.log("config", checkpoint.config);
        console.log("metadata", checkpoint.metadata);
        console.log(
            "Checkpoint ID:",
            checkpoint.config.configurable.checkpoint_id
        );
    }

}
getStateData();