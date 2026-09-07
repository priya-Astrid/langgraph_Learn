import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const RagPractice = async () => {
  // state
  const State = new StateSchema({
    question: z.string(),
    searchQuery: z.string(),
    document: z.array(z.string()),
    retryCount: z.number(),
    answer: z.string(),
  });
  // rewrite
  const rewriteQuery = (state) => {
    return {
      searchQuery: state.question + "details Explain",
    };
  };
  //   retrieve Node
  const retrieverNode = async (state) => {
    if (state.retryCount === 0) {
      return {
        document: [],
      };
    }

    return {
      document: [
        "Rag stand for retrieval augmented Generation",

        "rag retrieves relevant document before generating an answer.",
      ],
    };
  };
  //    check document
  const checkDocument = async (state) => {
    return {};
  };
  // 5 router
  const routerAfterDocCheck = (state) => {
    if (state.document.length > 0) {
      return "answer";
    }
    if (state.retryCount >= 2) {
      return "end";
    }
    return "retry";
  };
  //  retry count node
  const retryNode = async (state) => {
    return {
      retryCount: state.retryCount + 1,
    };
  };
  //   answer node
  const generateAnswer = async (state) => {
    return {
      answer: "Based on retriever document" + state.document.join(),
    };
  };
  // graph
  const workflow = new StateGraph(State)
    .addNode("rewrite", rewriteQuery)
    .addNode("retriever", retrieverNode)
    .addNode("checkdocument", checkDocument)
    .addNode("retry", retryNode)
    .addNode("generateAnswer", generateAnswer)

    .addEdge(START, "rewrite")
    .addEdge("rewrite", "retriever")
    .addEdge("retriever", "checkdocument")
    .addConditionalEdges("checkdocument", routerAfterDocCheck, {
      answer: "generateAnswer",
      retry: "retry",
      end: END,
    })
    .addEdge("retry", "rewrite")
    .addEdge("generateAnswer", END);
  const app = workflow.compile();
  const result = await app.invoke({
    question: "what is Rag",
    searchQuery: "",
    document: [],
    retryCount: 0,
    answer: "",
  });
  console.log("response", result);
  //  node
};
RagPractice();
