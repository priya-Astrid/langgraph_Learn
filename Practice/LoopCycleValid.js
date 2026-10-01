import { END, START, StateGraph, StateSchema } from "@langchain/langgraph"
import z from "zod"


export const loopCycleValid = async () => {
    //  state
    const State = new StateSchema({
        count: z.number(),
        result: z.string(),
        isValid: z.boolean()
    })
    // Node => generate Node, validate Node 

    const generateNode = async (state) => {
        console.log("this is result", state)
        const count = state.count + 1;
        return {
            count,
            result: `${count}`
        }
    }
    // validation Node

    const validateNode = async (state) => {
        const isValid = state.count >= 3
        return {
            isValid
        }
    }
    // Router

    const shouldContinue = async (state) => {
        if (state.isValid) {
            return "end";
        }

        return "retry"
    }
    // graph
    const workFlow = new StateGraph(State)
        .addNode("generate", generateNode)
        .addNode("validate", validateNode)
        .addEdge(START, "generate")
        .addEdge("generate", "validate")
        .addConditionalEdges(
            "validate",
            shouldContinue,
            {
                retry: "generate",
                end: END
            }
        )
    // compile
    const app = workFlow.compile()
    // invoke
    const result = app.invoke({
        count: 0,
        result: "",
        isValid: false
    })
    console.log("result", result);

}
loopCycleValid()