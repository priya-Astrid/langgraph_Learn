import { START, END, StateGraph, StateSchema } from "@langchain/langgraph";
import z, { compile } from "zod";

export const twoNodeWorkflow = async () => {
  const State = new StateSchema({
    question: z.string(),
    answer: z.string(),
  });

  const questionNode = async (state) => {
    return { question: state.question };
  };
  const answerNode = async (state) => {
    console.log(state.question);
    return {
      answer: "Node js is  javascript runtime enviroment",
    };
  };

  const StateWorkflow = new StateGraph(State)
    .addNode("questionNode", questionNode)
    .addNode("answerNode", answerNode)

    .addEdge(START, "questionNode")
    .addEdge("questionNode", "answerNode")
    .addEdge("answerNode", END);

  const add = StateWorkflow.compile();

  const result = await add.invoke({
    question: "what is node js ",
    answer: "",
  });
  console.log("this is result", result);
};

twoNodeWorkflow();
