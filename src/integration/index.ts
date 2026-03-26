import type { AstroConfig, AstroIntegration } from "astro";

import type { RobotsTxtOptions } from "@/integration/generators/robots-txt";
import { generateRobotsTxt } from "@/integration/generators/robots-txt";

export type IntegrationOptionsInput = {
	robotsTxt?: boolean | RobotsTxtOptions;
};

export type IntegrationRuntimeContext = {
	config: AstroConfig;
	outDir: URL;
	options: IntegrationOptionsInput;
};

export default function createIntegration(options: IntegrationOptionsInput = {}): AstroIntegration {
	let config: AstroConfig | undefined;

	return {
		name: "eminence-astro-seo",
		hooks: {
			"astro:config:done": ({ config: cfg }) => {
				config = cfg;
			},
			"astro:build:done": async ({ dir }) => {
				if (!config) {
					return;
				}

				await generateRobotsTxt({ config, outDir: dir, options });
			},
		},
	};
}
