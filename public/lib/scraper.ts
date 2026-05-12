import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function getLocalContext(url: string) {
  const scrapeResult = await app.scrapeUrl(url, {
    formats: ['markdown'],
    onlyMainContent: true, // 광고/푸터 제외
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`);
  }

  return scrapeResult.markdown;
}