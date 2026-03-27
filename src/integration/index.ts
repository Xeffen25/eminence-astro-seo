import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from "astro";

import type { RobotsTxtOptions } from "./generators/robots-txt";
import { generateRobotsTxt } from "./generators/robots-txt";
import type { SecurityTxtOptions } from "./generators/security-txt";
import { generateSecurityTxt } from "./generators/security-txt";

export type IntegrationOptionsInput = {
	robotsTxt?: boolean | RobotsTxtOptions;
	securityTxt?: false | SecurityTxtOptions;
};

export type IntegrationInputOptions = IntegrationOptionsInput;

export type IntegrationRuntimeContext = {
	config: AstroConfig;
	outDir: URL;
	options: IntegrationOptionsInput;
	logger: AstroIntegrationLogger;
};

export default function createIntegration(options: IntegrationOptionsInput = {}): AstroIntegration {
	let config: AstroConfig | undefined;

	return {
		name: "eminence-astro-seo",
		hooks: {
			"astro:config:done": ({ config: cfg }) => {
				config = cfg;
			},
			"astro:build:done": async ({ dir, logger }) => {
				if (!config) {
					return;
				}

				await generateRobotsTxt({ config, outDir: dir, options, logger });
				await generateSecurityTxt({ config, outDir: dir, options, logger });
			},
		},
	};
}
