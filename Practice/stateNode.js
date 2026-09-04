import { START, END, StateGraph, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const simpleState = async () => {
  const State = new StateSchema({
    question: z.string(),
    answer: z.string(),
  });
  const processQuestion = async (state) => {
    console.log(state.question);
    return {
      answer: "mongoDB is a nosql database. it store data in bson format",
    };
  };

  const workflow =new StateGraph(State)
    .addNode("processQuestion", processQuestion)
    .addEdge(START, "processQuestion")
    .addEdge("processQuestion", END);

  const app = workflow.compile();
  const result = await app.invoke({
    question: "what is mongodb",
    answer: "",
  });
  console.log("result", result);
};
simpleState();

// Correct flow

// Tumhara intended graph:

// START
//   ↓
// processQuestion
//   ↓
// END