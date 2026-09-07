import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const conditionalCase = async () => {
  // define state
  const State = new StateSchema({
    question: z.string(),
    type: z.string(),
    answer: z.string(),
  });

  //   analyse question
  const inputProcess = async (state) => {
    const question = state.question.toLowerCase();
    if (question.includes("rag")) {
      return {
        type: "rag",
      };
    }
    return {
      type: "direct",
    };
  };
  //  rag node
  const retrieverNode = async (state) => {
    return {
      answer: "Search document for: " + state.question,
    };
  };
  //   direct answer node
  const directAnswerNode = async (state) => {
    return {
      answer: "direct Answer" + state.question,
    };
  };
  //   router function
  const routerQuestion = (state) => {
    if (state.type == "rag") {
      return "retrieve";
    }
    return "direct";
  };
  const workflow = new StateGraph(State)
    .addNode("analyse", inputProcess)
    .addNode("retrieve", retrieverNode)
    .addNode("direct", directAnswerNode)

    .addEdge(START, "analyse")
    .addConditionalEdges("analyse", routerQuestion, {
      retrieve: "retrieve",
      direct: "direct",
    })
    .addEdge("retrieve", END)
    .addEdge("direct", END);

  const add = workflow.compile();

  const result = await add.invoke({
    question: "What is Node",
    type: "",
    answer: "",
  });
  console.log(" this response", result);
};

conditionalCase();
