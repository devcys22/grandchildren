import { NextResponse } from 'next/server';
import { getLocalContext } from '@/lib/scraper';
import { workflow } from '@/lib/agent';
import { sendKakaoMeMessage } from '@/lib/kakao';

export async function GET(request: Request) {
  // 보안을 위한 CRON_SECRET 체크
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 1. 데이터 수집 (예: 부산진구청)
    const markdown = await getLocalContext("https://www.busanjin.go.kr/index.busanjin");

    // 2. 에이전트 실행
    const result = await workflow.invoke({ context: markdown });

    // ✨ [추가] 생성된 AI 리포트를 카카오톡으로 전송
    const reportText = `🤖 [손주 에이전트 브리핑]\n\n${result.script}`;
    await sendKakaoMeMessage(reportText);

    return NextResponse.json({ success: true, script: result.script });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}