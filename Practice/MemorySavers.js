import { END, MemorySaver, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph"
import { generateModel } from "../config/generateModel.js"
import { HumanMessage } from "@langchain/core/messages"

export const memorySaverData = async () => {
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

    const memory = new MemorySaver();


    const addProcess = workFlow.compile({
        checkpointer: memory
    });
    // thread id
    const config = {
        configurable :{
            thread_id : "priya123"
        }
    }

    const finalResponse = await addProcess.invoke({
        messages: [
            new HumanMessage("mode js and javascript related give me one word"),
        ],
      
    },
config)

}
memorySaverData();