import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const countLoopCycle = async () => {
  // state define
  const State = new StateSchema({
    count: z.number(),
  });
  // node
  const increNode = async (state) => {
    return {
      count: state.count + 1,
    };
  };
  // router
  const shouldContinues = (state) => {
    if (state.count < 3) {
      return "continue";
    }
    return "end";
  };
  // graph
  const workFlow = new StateGraph(State)
    .addNode("increment", increNode)
    .addEdge(START, "increment")
    .addConditionalEdges("increment", shouldContinues, {
      continue: "increment",
      end: END,
    });
  const app = workFlow.compile();
  const result = await app.invoke({
    count: 0,
  });
  console.log(result);
};
countLoopCycle();
