# Eminence Astro Seo

SEO components for Astro with a composable `Head` component and focused leaf components.

## Installation

```bash
pnpm add eminence-astro-seo
```

Peer dependencies:

- `astro@^6`
- `schema-dts@^1.1.5`

## Quick Start

Use `Head` in your page or layout and pass the metadata you need.

```astro
---
import { Head } from "eminence-astro-seo/components";
---

<html lang="en">
	<Head
		title={{ value: "Home", template: "%s | Eminence" }}
		description="A practical Astro SEO component library."
		canonical="https://example.com/"
		robots={{ index: true, follow: true }}
		themeColor="#0a7c66"
		colorScheme="light dark"
	/>
	<body>
		<slot />
	</body>
</html>
```

## Head Component

`Head` renders your common SEO tags and composes the leaf components in this package.

### Props

| Prop           | Type                                          | Required | Description                                            |
| :------------- | :-------------------------------------------- | :------- | :----------------------------------------------------- |
| `title`        | `ComponentProps<typeof Title>`                | Yes      | Title metadata.                                        |
| `charset`      | `string`                                      | No       | Defaults to `"utf-8"`.                                 |
| `viewport`     | `string`                                      | No       | Defaults to `"width=device-width, initial-scale=1.0"`. |
| `base`         | `ComponentProps<typeof Base>`                 | No       | Renders `<base>`.                                      |
| `description`  | `string`                                      | No       | Renders meta description.                              |
| `manifest`     | `string`                                      | No       | Renders web app manifest link.                         |
| `verification` | `ComponentProps<typeof Verification>`         | No       | Site verification tags.                                |
| `appleWebApp`  | `ComponentProps<typeof AppleWebApp>`          | No       | Apple web app tags.                                    |
| `canonical`    | `string`                                      | No       | Canonical URL.                                         |
| `alternate`    | `ComponentProps<typeof Alternate>`            | No       | Alternate links (language/media/types).                |
| `appLinks`     | `ComponentProps<typeof AppLinks>`             | No       | App links metadata.                                    |
| `archives`     | `string`                                      | No       | Archive URL metadata.                                  |
| `assets`       | `string`                                      | No       | Asset URL metadata.                                    |
| `bookmarks`    | `string`                                      | No       | Bookmark URL metadata.                                 |
| `facebook`     | `ComponentProps<typeof Facebook>`             | No       | Open Graph/Facebook tags.                              |
| `pinterest`    | `ComponentProps<typeof Pinterest>["richPin"]` | No       | Pinterest rich pin metadata.                           |
| `robots`       | `ComponentProps<typeof Robots>`               | No       | Robots directives.                                     |
| `themeColor`   | `string`                                      | No       | Browser theme color.                                   |
| `colorScheme`  | `string`                                      | No       | Preferred color scheme metadata.                       |

### Slot Usage

`Head` includes a default `<slot />` inside `<head>`, so you can manually inject extra tags that are not covered by built-in props.

```astro
---
import { Head } from "eminence-astro-seo/components";
---

<Head title={{ value: "Docs" }}>
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
	<noscript>This site works best with JavaScript enabled.</noscript>
	<script is:inline>
		console.log("inline analytics bootstrap");
	</script>
	<link rel="preload" as="image" href="/hero.webp" />
</Head>
```

## Individual Components

You can also import and render leaf components directly:

```astro
---
import { Canonical, Description, Facebook, Robots, Title } from "eminence-astro-seo/components";
---

<head>
	<Title value="Article" template="%s | Blog" />
	<Description value="Long-form article about Astro SEO." />
	<Canonical href="https://example.com/blog/article" />
	<Facebook title="Article" description="Long-form article" type="article" />
	<Robots index={true} follow={true} />
</head>
```

## Integration

Import the integration from the dedicated integration subpath:

```ts
import { eminenceAstroSeo } from "eminence-astro-seo/integration";
```

## Custom Metadata

This package is intentionally opinionated and focuses on up-to-date, relevant SEO metadata. For this reason, there are no dedicated options for browserconfig.xml and other outdated tags.

I only recommend adding the specific tags listed below. Any other custom tag is not recommended in `Head`:

- `<noscript>`
- `<style>`
- `<script>`
- `<link rel="stylesheet" />`
- `<link rel="preload" />`
- `<link rel="preconnect" />`
- `<link rel="dns-prefetch" />`

> Do not use `<meta http-equiv="...">` instead use appropriate HTTP Headers instead, via `Astro.redirect()`, proxy configuration, and security headers.

Before adding any other tag, do actual research to confirm whether it should be in `<head>` and whether it is still relevant for modern SEO.

If you think an important tag is missing from this package, please create an Issue I will financially reward you.

### Custom Metadata Examples

```astro
<Head title={{ value: "Example" }}>
	<noscript>Enable JavaScript for a richer experience.</noscript>
	<style is:inline>
		:root {
			color-scheme: light dark;
		}
	</style>
	<script is:inline>
		window.__featureFlag = true;
	</script>
	<link rel="stylesheet" href="/fonts.css" />
	<link rel="preload" as="font" href="/fonts/Acme.woff2" type="font/woff2" crossorigin="anonymous" />
	<link rel="preconnect" href="https://cdn.example.com" crossorigin="anonymous" />
	<link rel="dns-prefetch" href="https://api.example.com" />
</Head>
```
