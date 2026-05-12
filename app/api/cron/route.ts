import { NextResponse } from 'next/server';
import { getLocalContext } from '@/lib/scraper';
import { workflow } from '@/lib/agent';

export async function GET(request: Request) {
  // 보안을 위한 CRON_SECRET 체크
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 1. 데이터 수집 (예: 부산진구청)
    const markdown = await getLocalContext("https://www.busanjin.go.kr/index.busanjin?menuCd=DOM_000000101001000000");

    // 2. 에이전트 실행
    const result = await workflow.invoke({ context: markdown });

    // 3. 결과 발송 (텔레그램/알림톡 API 연동부)
    console.log("생성된 대본:", result.script);
    // await sendTelegram(result.script); 

    return NextResponse.json({ success: true, script: result.script });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}