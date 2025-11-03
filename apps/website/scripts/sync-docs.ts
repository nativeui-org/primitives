import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const PRIMITIVES_DIR = join(
	process.cwd(),
	"../../packages/primitives/src/primitives",
);
const DOCS_DIR = join(process.cwd(), "docs");
const SANDBOX_PREVIEW_DIR = join(process.cwd(), "../sandbox/app/preview");

async function findMarkdownFiles(
	dir: string,
): Promise<Array<{ path: string; name: string }>> {
	const files: Array<{ path: string; name: string }> = [];
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			const mdFile = join(fullPath, `${entry.name}.md`);
			if (existsSync(mdFile)) {
				files.push({ path: mdFile, name: entry.name });
			}
		}
	}

	return files;
}

async function hasPreview(componentName: string): Promise<boolean> {
	const previewFile = join(SANDBOX_PREVIEW_DIR, `${componentName}.tsx`);
	return existsSync(previewFile);
}

function extractTitle(content: string): string {
	const match = content.match(/^#\s+(.+)$/m);
	return match ? match[1].trim() : "";
}

function extractDescription(content: string): string {
	const lines = content.split("\n");
	let startIndex = 0;

	for (let i = 0; i < lines.length; i++) {
		if (lines[i].match(/^#\s+/)) {
			startIndex = i + 1;
			break;
		}
	}

	let paragraph = "";
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line || line.match(/^---$/)) continue;
		if (line.match(/^#+\s+/)) break;

		paragraph += (paragraph ? " " : "") + line;

		if (paragraph.endsWith(".") && paragraph.length > 50) break;
		if (paragraph.length >= 150) {
			paragraph = paragraph.substring(0, 147) + "...";
			break;
		}
	}

	// Remove markdown formatting
	paragraph = paragraph
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/\*(.+?)\*/g, "$1")
		.replace(/`(.+?)`/g, "$1")
		.replace(/\[(.+?)\]\(.+?\)/g, "$1");

	return paragraph || "";
}

function generateFrontmatter(title: string, description?: string): string {
	let frontmatter = "---\n";
	frontmatter += `title: ${JSON.stringify(title)}\n`;
	if (description) {
		frontmatter += `description: ${JSON.stringify(description)}\n`;
	}
	frontmatter += "---\n\n";
	return frontmatter;
}

function convertMdToMdx(
	content: string,
	componentName: string,
	hasPreviewComponent: boolean,
): string {
	const lines = content.split("\n");
	let result = "";
	let skipFirstH1 = true;
	let skipIntro = true;
	let hasAddedPreview = false;
	let hasAddedInstallSection = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (skipFirstH1 && line.match(/^#\s+/)) {
			skipFirstH1 = false;
			continue;
		}

		if (skipIntro) {
			if (line.match(/^##\s+/) || line.match(/^---$/)) {
				skipIntro = false;
			} else {
				continue;
			}
		}

		if (!hasAddedPreview && !hasAddedInstallSection && line.match(/^##\s+/)) {
			if (hasPreviewComponent) {
				result += `## Preview\n\n`;
				result += `<Preview component="${componentName}" title="Interactive Demo" />\n\n`;
				result += `---\n\n`;
				hasAddedPreview = true;
			}

			result += `## Installation\n\n`;
			result += `<InstallTabs />\n\n`;
			result += `---\n\n`;
			hasAddedInstallSection = true;
		}

		result += line + "\n";
	}

	return result.trimStart();
}

async function syncDocs() {
	try {
		console.log("📚 Syncing documentation files...\n");

		if (!existsSync(DOCS_DIR)) {
			await mkdir(DOCS_DIR, { recursive: true });
		}

		const mdFiles = await findMarkdownFiles(PRIMITIVES_DIR);
		console.log(`Found ${mdFiles.length} markdown files\n`);

		for (const { path: mdPath, name } of mdFiles) {
			console.log(`Processing: ${name}`);

			const hasPreviewComponent = await hasPreview(name);
			if (hasPreviewComponent) {
				console.log(`  ℹ️  Preview available`);
			}

			const content = await readFile(mdPath, "utf-8");
			const title = extractTitle(content);
			const description = extractDescription(content);

			if (!title) {
				console.warn(`⚠️  No title found, skipping`);
				continue;
			}

			const mdxContent = convertMdToMdx(content, name, hasPreviewComponent);
			const frontmatter = generateFrontmatter(title, description);
			const finalContent = frontmatter + mdxContent;

			const outputPath = join(DOCS_DIR, `${name}.mdx`);
			await writeFile(outputPath, finalContent, "utf-8");

			console.log(`✓ Created ${name}.mdx`);
		}

		console.log(
			`\n✅ Successfully synced ${mdFiles.length} documentation files!`,
		);
		console.log('\n💡 Tip: Run "pnpm dev" to see the changes in the website.');
	} catch (error) {
		console.error("❌ Error syncing docs:", error);
		process.exit(1);
	}
}

syncDocs();
