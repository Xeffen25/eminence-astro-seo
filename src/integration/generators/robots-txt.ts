import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from "../index";

/**
 * Well-known crawler user-agent identifiers.
 * Accepts any string — the listed values are provided for IDE autocompletion.
 */
export type CrawlerAgent =
	| "*"
	| "Googlebot"
	| "Googlebot-Image"
	| "Googlebot-News"
	| "Googlebot-Video"
	| "Bingbot"
	| "Slurp"
	| "DuckDuckBot"
	| "Baiduspider"
	| "YandexBot"
	| "YandexImages"
	| "Sogou"
	| "Exabot"
	| "facebookexternalhit"
	| "LinkedInBot"
	| "Twitterbot"
	| "ia_archiver"
	| "AhrefsBot"
	| "MJ12bot"
	| "SemrushBot"
	| "DotBot"
	| "PetalBot"
	| "GPTBot"
	| "CCBot"
	| "ClaudeBot"
	| "anthropic-ai"
	| (string & {});

export type RobotsTxtRule = {
	/** User-agent(s) this rule block applies to. */
	agent: CrawlerAgent | CrawlerAgent[];
	/** Path(s) the agent is allowed to crawl. */
	allow?: string | string[];
	/** Path(s) the agent is disallowed from crawling. */
	disallow?: string | string[];
	/**
	 * Minimum delay in seconds between successive requests from the crawler.
	 * Supported by Bing, Yandex, Baidu. Not supported by Google.
	 */
	crawlDelay?: number;
	/**
	 * Path(s) the agent should not index.
	 * Supported by Yandex. Not supported by Google.
	 */
	noindex?: string | string[];
	/**
	 * Query parameter(s) to strip when canonicalising duplicate URLs.
	 * Format: `"param1&param2"` or `"param /path"`.
	 * Supported by Yandex. Not supported by Google.
	 */
	cleanParam?: string | string[];
};

export type RobotsTxtOptions = {
	/**
	 * Sitemap URL(s) to include. Relative values are resolved against `config.site`.
	 */
	sitemap?: string | string[];
	/** Crawler rule blocks to include in the generated file. */
	rules?: RobotsTxtRule[];
};

const toArray = <T>(value: T | T[] | undefined): T[] => {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value];
};

const resolveUrl = (url: string, site: string | undefined): string => {
	if (site && !url.startsWith("http")) {
		return new URL(url, site).href;
	}
	return url;
};

const buildRobotsTxt = (rules: RobotsTxtRule[], sitemaps: string[], site: string | undefined): string => {
	const parts: string[] = [];

	for (const rule of rules) {
		const lines: string[] = [];
		for (const agent of toArray(rule.agent)) {
			lines.push(`User-agent: ${agent}`);
		}
		for (const path of toArray(rule.allow)) {
			lines.push(`Allow: ${path}`);
		}
		for (const path of toArray(rule.disallow)) {
			lines.push(`Disallow: ${path}`);
		}
		if (rule.crawlDelay !== undefined) {
			lines.push(`Crawl-delay: ${rule.crawlDelay}`);
		}
		for (const path of toArray(rule.noindex)) {
			lines.push(`Noindex: ${path}`);
		}
		for (const param of toArray(rule.cleanParam)) {
			lines.push(`Clean-param: ${param}`);
		}
		if (lines.length > 0) {
			parts.push(lines.join("\n"));
		}
	}

	if (sitemaps.length > 0) {
		parts.push(sitemaps.map((url) => `Sitemap: ${resolveUrl(url, site)}`).join("\n"));
	}

	return parts.join("\n\n") + "\n";
};

export async function generateRobotsTxt({ config, outDir, options }: IntegrationRuntimeContext): Promise<void> {
	const input = options.robotsTxt;

	if (input === false) {
		return;
	}

	const site = config.site;

	let content: string;

	if (input === true || input === undefined) {
		const sitemapUrl = site ? new URL("sitemap-index.xml", site).href : "sitemap-index.xml";
		content = buildRobotsTxt([{ agent: "*", allow: "/" }], [sitemapUrl], site);
	} else {
		const sitemaps = toArray(input.sitemap);
		const rules = input.rules ?? [];
		content = buildRobotsTxt(rules, sitemaps, site);
	}

	await writeFile(join(fileURLToPath(outDir), "robots.txt"), content, "utf-8");
}
