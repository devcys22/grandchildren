import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"; // 혹은 anthropic

// 1. 상태(State) 정의 방식을 Annotation으로 변경
const AgentState = Annotation.Root({
  context: Annotation<string>,
  script: Annotation<string>,
});

// 2. 노드(Node) 구현: 대본 생성
const generateScript = async (state: typeof AgentState.State) => {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: "지역소식을 바탕으로 행사일정 작성해줘",
    prompt: `지역 소식: ${state.context}`,
  });
  // 변경된 값만 반환하면 LangGraph가 기존 상태에 병합(Update)해줍니다.
  return { script: text };
};

// 3. 그래프 구성 (channels에 Annotation 객체를 그대로 전달)
export const workflow = new StateGraph(AgentState)
  .addNode("generator", generateScript)
  .addEdge(START, "generator")
  .addEdge("generator", END)
  .compile();