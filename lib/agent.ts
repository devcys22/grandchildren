import { StateGraph, START, END } from "@langchain/langgraph";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"; // 혹은 anthropic

// 1. 상태(State) 정의
const AgentState = {
  context: "",
  script: "",
};

// 2. 노드(Node) 구현: 대본 생성
const generateScript = async (state: typeof AgentState) => {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: "너는 다정한 디지털 손주야. 제공된 지역 소식을 바탕으로 자녀가 부모님께 드릴 안부 전화 대본을 작성해줘.",
    prompt: `지역 소식: ${state.context}`,
  });
  return { script: text };
};

// 3. 그래프 구성
export const workflow = new StateGraph({ channels: AgentState })
  .addNode("generator", generateScript)
  .addEdge(START, "generator")
  .addEdge("generator", END)
  .compile();