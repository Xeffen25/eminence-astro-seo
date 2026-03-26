// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.
import Alternate from "@/components/Alternate.astro";
import AppleWebApp from "@/components/AppleWebApp.astro";
import AppLinks from "@/components/AppLinks.astro";
import Archives from "@/components/Archives.astro";
import Assets from "@/components/Assets.astro";
import Base from "@/components/Base.astro";
import Bookmarks from "@/components/Bookmarks.astro";
import Canonical from "@/components/Canonical.astro";
import ColorScheme from "@/components/ColorScheme.astro";
import Description from "@/components/Description.astro";
import Facebook from "@/components/Facebook.astro";
import Head from "@/components/Head.astro";
import Manifest from "@/components/Manifest.astro";
import Pinterest from "@/components/Pinterest.astro";
import Robots from "@/components/Robots.astro";
import ThemeColor from "@/components/ThemeColor.astro";
import Title from "@/components/Title.astro";
import Verification from "@/components/Verification.astro";
import type { IntegrationOptionsInput } from "@/integration/index";
import createIntegration from "@/integration/index";

export {
	Alternate,
	AppleWebApp,
	AppLinks,
	Archives,
	Assets,
	Base,
	Bookmarks,
	Canonical,
	ColorScheme,
	Description,
	createIntegration as eminenceAstroSeo,
	Facebook,
	Head,
	Manifest,
	Pinterest,
	Robots,
	ThemeColor,
	Title,
	Verification,
};

export type EminenceAstroSeoOptions = IntegrationOptionsInput;
