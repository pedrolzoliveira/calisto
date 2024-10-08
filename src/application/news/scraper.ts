import { type HTMLElement } from 'node-html-parser';
import { getHTML } from './utils/get-html';
import { getOpenGraphMetadata } from './utils/get-open-graph-metadata';
import { createNews } from './use-cases/create-news';
import { isNewsCreated } from './utils/is-news-created';
import { logger } from '@/src/infra/logger';
import { AxiosError } from 'axios';
import { newsCreatedQueue } from './queues/news-created';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export interface ScraperArgs {
  sourceCode: string
  blackList?: string[]
  getLinks: () => Promise<string[]>
  getContent: (html: HTMLElement) => string
}

export class Scraper {
  private readonly sourceCode: string;
  private readonly blackList: string[];
  private readonly getLinks: () => Promise<string[]>;
  private readonly getContent: (html: HTMLElement) => string;

  constructor (args: ScraperArgs) {
    this.sourceCode = args.sourceCode;
    this.blackList = args.blackList ?? [];
    this.getLinks = args.getLinks;
    this.getContent = args.getContent;
  }

  public async scrape() {
    logger.info(`scraping ${this.sourceCode}`);
    try {
      const links = await this.getLinks().then(links => {
        if (!this.blackList.length) {
          return links;
        }

        return links.filter(link => !this.blackList.some(blackListedLink => link.includes(blackListedLink)));
      });

      for (const link of links) try {
        if (await isNewsCreated(link)) {
          continue;
        }

        const html = await getHTML(link);

        const ogMetadata = getOpenGraphMetadata(html);
        const content = this.getContent(html);

        const news = await createNews({
          sourceCode: this.sourceCode, link, content, ...ogMetadata
        });

        await newsCreatedQueue.publish({ link: news.link });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // news already exists, probably is shared between sources
          if (error.code === 'P2002') {
            logger.warn(`news for ${link} already exists`);
            continue;
          }
        }
        logger.error(`error creating news for ${link}: ${(error as Error).message}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error({ error: error.toJSON(), response: error.response?.data });
      } else {
        logger.error({ error });
      }
    }
  }
}
