import { END, MemorySaver, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph"
import { generateModel } from "../config/generateModel.js"
import { HumanMessage } from "@langchain/core/messages"

export const threadConfig = async () => {
    // state
    const model = await generateModel();
    const State = new StateSchema({
        messages: MessagesValue
    })
    //  node

    const chatProcess = async (state) => {
        const result = await model.invoke(state.messages);
        return { messages: [result.content] };
    }
    // graph

    const workFlow = new StateGraph(State)
        .addNode("chat", chatProcess)
        .addEdge(START, "chat")
        .addEdge("chat", END)

    const memory = new MemorySaver();


    const app = workFlow.compile({
        checkpointer: memory
    });
    // thread id
    const config = {
        configurable :{
            thread_id : "priya123"
        }
    }

  
    const response1 = await app.invoke({
        messages: [
            new HumanMessage("my name is priya"),
        ],
      
    },
config)
    console.log(response1.messages.at(-1).content);
    
    const response2 = await app.invoke({
        messages:[
            new HumanMessage("what is my name")
        ]
    },
config)
console.log(response2.messages.at(-1).content)
  const state = await app.getState(config)
    console.log("state", state);
      console.log("state", state.values.messages);
    console.log("state", state.values.messages.at(-1).content);
  
}
threadConfig();