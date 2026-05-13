import FirecrawlApp from '@mendable/firecrawl-js';

export async function getLocalContext(url: string) {
  // 1. 함수가 실행되는 시점에 환경 변수를 읽습니다.
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "❌ [Scraper Error]: FIRECRAWL_API_KEY가 설정되지 않았습니다. .env.local 파일이나 환경 변수를 확인하세요."
    );
  }

  // 2. 함수 내부에서 인스턴스를 생성하여 키 누락을 방지합니다.
  const app = new FirecrawlApp({ apiKey });

  console.log(`🔍 스크래핑 시작: ${url}`);
  try {
      const scrapeResult = await app.scrapePage(url, {
        formats: ['markdown'],
        onlyMainContent: true,
      });

      if (!scrapeResult.success) {
        throw new Error(`Failed to scrape: ${scrapeResult.error}`);
      }

      return scrapeResult.markdown;
  } catch (error: any) {
    // 만약 scrapePage도 없다면, SDK 버전에 따라 scrape를 시도해볼 수 있습니다.
    console.error("💡 scrapePage가 작동하지 않아 대체 메서드를 시도합니다.");
    const fallbackResult = await (app as any).scrape(url, { formats: ['markdown'] });
    return fallbackResult.markdown;
  }
}