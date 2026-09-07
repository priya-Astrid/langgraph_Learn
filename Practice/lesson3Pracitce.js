import z from "zod";

import { StateGraph, START, END } from "@langchain/langgraph";

export const multipleNode = async () => {
  const State = z.object({
    question: z.string(),
    processQuestion: z.string(),
    answer: z.string(),
  });
  const inputNode = async (state) => {
    return {
      processQuestion: state.question,
    };
  };
  const processNode = async (state) => {
    return {
      answer: state.processQuestion,
    };
  };
  const responseNode = async (state) => {
    console.log("final answer", state.answer);
    return {
         answer: "Node js is  javascript runtime enviroment",
  
    };
  };

  const workflow = new StateGraph(State)
    .addNode("input", inputNode)
    .addNode("process", processNode)
    .addNode("response", responseNode)

    .addEdge(START, "input")
    .addEdge("input", "process")
    .addEdge("process", "response")
    .addEdge("response", END);

  const add = workflow.compile();

  const result = await add.invoke({
    question: "what is Node",
    answer: "",
  });
  console.log("response", result);
};
multipleNode();
