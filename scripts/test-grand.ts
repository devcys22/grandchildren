import * as dotenv from 'dotenv';

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

import { getLocalContext } from '../lib/scraper';
import { workflow } from '../lib/agent';
import { sendKakaoMeMessage } from '@/lib/kakao';
async function testRun() {
  console.log("🚀 손주에이전트 로컬 테스트 시작...");

  try {
    // 1. 스크래핑 테스트 (부산진구청 소식)
    console.log("🔍 데이터 수집 중...");
    const url = "https://www.busanjin.go.kr/index.busanjin";
    const context = await getLocalContext(url);
    console.log("✅ 데이터 수집 완료 (길이: " + context.length + ")");

    // 2. 에이전트 추론 테스트
    console.log("🧠 에이전트 사고 중...");
    const result = await workflow.invoke({ context });

    console.log("\n--- ✨ 생성된 효도 가이드 ---");
    console.log(result.script);
    console.log("---------------------------\n");

    // 3. ✨ [추가] 카카오톡 발송 테스트
    console.log("💬 카카오톡 전송 시도 중...");
    
    // 메시지 상단에 로컬 테스트용 꼬리표를 달아 가독성을 높입니다.
    const kakaoMessage = `🤖 [손주 에이전트 브리핑]\n\n${result.script}`;
    await sendKakaoMeMessage(kakaoMessage);
    
    console.log("🎉 모든 테스트가 성공적으로 완료되었습니다!");

  } catch (error) {
    console.error("❌ 에러 발생:", error);
  }
}

testRun();