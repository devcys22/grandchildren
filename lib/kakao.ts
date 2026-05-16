import axios from 'axios';

// ⚠️ 최초 1회 토큰 발급을 받아 환경변수에 REFRESH_TOKEN을 등록해야 합니다.
export async function sendKakaoMeMessage(text: string) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  const refreshToken = process.env.KAKAO_REFRESH_TOKEN;

  if (!restApiKey || !refreshToken) {
    throw new Error("❌ 카카오 환경변수(KAKAO_REST_API_KEY 또는 KAKAO_REFRESH_TOKEN)가 없습니다.");
  }

  try {
    // 1. Refresh Token을 사용하여 새로운 Access Token 갱신 요청
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: restApiKey,
          refresh_token: refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. 나에게 메시지 보내기 API 호출 (기본 텍스트 템플릿)
    const messageResponse = await axios.post(
      'https://kapi.kakao.com/v2/api/talk/memo/default/send',
      new URLSearchParams({
        template_object: JSON.stringify({
          object_type: 'text',
          text: text,
          link: {
            web_url: 'https://www.busanjin.go.kr',
            mobile_web_url: 'https://www.busanjin.go.kr',
          },
          button_title: '구청 소식 확인하기',
        }),
      }),
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (messageResponse.data.result_code === 0) {
      console.log('✅ 카카오톡 메시지 발송 성공!');
      return true;
    } else {
      throw new Error(`카카오 응답 실패 code: ${messageResponse.data.result_code}`);
    }
  } catch (error: any) {
    console.error('❌ 카카오톡 발송 중 에러 발생:', error.response?.data || error.message);
    throw error;
  }
}