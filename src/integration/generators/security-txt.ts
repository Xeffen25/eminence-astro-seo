import { constants } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from "../index";

export type SecurityTxtExpiresPreset = "1 week" | "1 month" | "1 year" | "10 years" | "100 years";

export type SecurityTxtOptions = {
	contact: string | string[];
	expires: Date | string | SecurityTxtExpiresPreset;
	encryption?: string | string[];
	acknowledgments?: string | string[];
	preferredLanguages?: string | string[];
	canonical?: string | string[];
	policy?: string | string[];
	hiring?: string | string[];
	csaf?: string | string[];
};

const toArray = <T>(value: T | T[] | undefined): T[] => {
	if (value === undefined) {
		return [];
	}

	return Array.isArray(value) ? value : [value];
};

const assertHttpsUrl = (value: string, fieldName: string): string => {
	let parsed: URL;

	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`Invalid ${fieldName} value \"${value}\": expected a valid absolute URL.`);
	}

	if (parsed.protocol !== "https:") {
		throw new Error(`Invalid ${fieldName} value \"${value}\": only https:// URLs are allowed.`);
	}

	return value;
};

const assertContact = (value: string): string => {
	if (value.startsWith("mailto:")) {
		return value;
	}

	return assertHttpsUrl(value, "Contact");
};

const addPreset = (now: Date, preset: SecurityTxtExpiresPreset): Date => {
	const result = new Date(now.getTime());

	switch (preset) {
		case "1 week":
			result.setUTCDate(result.getUTCDate() + 7);
			return result;
		case "1 month":
			result.setUTCMonth(result.getUTCMonth() + 1);
			return result;
		case "1 year":
			result.setUTCFullYear(result.getUTCFullYear() + 1);
			return result;
		case "10 years":
			result.setUTCFullYear(result.getUTCFullYear() + 10);
			return result;
		case "100 years":
			result.setUTCFullYear(result.getUTCFullYear() + 100);
			return result;
	}
};

const normalizeExpires = (value: SecurityTxtOptions["expires"], now: Date = new Date()): string => {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) {
			throw new Error("Invalid Expires value: received an invalid Date instance.");
		}

		return value.toISOString();
	}

	const presets: SecurityTxtExpiresPreset[] = ["1 week", "1 month", "1 year", "10 years", "100 years"];
	if (presets.includes(value as SecurityTxtExpiresPreset)) {
		return addPreset(now, value as SecurityTxtExpiresPreset).toISOString();
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(
			`Invalid Expires value \"${value}\": expected an ISO 8601 date string, Date object, or one of ${presets.join(", ")}.`,
		);
	}

	return parsed.toISOString();
};

const buildSecurityTxt = (options: SecurityTxtOptions, now: Date = new Date()): string => {
	const lines: string[] = [];

	for (const value of toArray(options.contact)) {
		lines.push(`Contact: ${assertContact(value)}`);
	}

	if (lines.length === 0) {
		throw new Error("Missing required securityTxt.contact value.");
	}

	lines.push(`Expires: ${normalizeExpires(options.expires, now)}`);

	for (const value of toArray(options.encryption)) {
		lines.push(`Encryption: ${assertHttpsUrl(value, "Encryption")}`);
	}

	for (const value of toArray(options.acknowledgments)) {
		lines.push(`Acknowledgments: ${assertHttpsUrl(value, "Acknowledgments")}`);
	}

	const preferredLanguages = toArray(options.preferredLanguages).join(", ");
	if (preferredLanguages.length > 0) {
		lines.push(`Preferred-Languages: ${preferredLanguages}`);
	}

	for (const value of toArray(options.canonical)) {
		lines.push(`Canonical: ${assertHttpsUrl(value, "Canonical")}`);
	}

	for (const value of toArray(options.policy)) {
		lines.push(`Policy: ${assertHttpsUrl(value, "Policy")}`);
	}

	for (const value of toArray(options.hiring)) {
		lines.push(`Hiring: ${assertHttpsUrl(value, "Hiring")}`);
	}

	for (const value of toArray(options.csaf)) {
		lines.push(`CSAF: ${assertHttpsUrl(value, "CSAF")}`);
	}

	return `${lines.join("\n")}\n`;
};

export async function generateSecurityTxt({ outDir, options, logger }: IntegrationRuntimeContext): Promise<void> {
	const input = options.securityTxt;

	if (input === undefined || input === false) {
		return;
	}

	if (typeof input !== "object" || input === null) {
		logger.error("Invalid securityTxt configuration: expected an object with Contact and Expires fields.");
		throw new Error("Invalid securityTxt configuration: expected an object.");
	}

	const outputPath = join(fileURLToPath(outDir), ".well-known", "security.txt");

	try {
		await access(outputPath, constants.F_OK);
		logger.error(
			'Cannot generate ".well-known/security.txt" because it already exists in the build output directory.',
		);
		throw new Error('Output file already exists: ".well-known/security.txt".');
	} catch (error) {
		if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
			throw error;
		}
	}

	const content = buildSecurityTxt(input);

	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, content, "utf-8");
}
