import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const PRIMITIVES_DIR = join(process.cwd(), '../../packages/primitives/src/primitives');
const DOCS_DIR = join(process.cwd(), 'docs');

async function findMarkdownFiles(dir: string): Promise<Array<{ path: string; name: string }>> {
  const files: Array<{ path: string; name: string }> = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Check if directory contains a .md file with the same name as the directory
      const mdFile = join(fullPath, `${entry.name}.md`);
      if (existsSync(mdFile)) {
        files.push({
          path: mdFile,
          name: entry.name,
        });
      }
    }
  }

  return files;
}

function extractTitle(content: string): string {
  // Extract title from first h1 (# Title)
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  return '';
}

function extractDescription(content: string): string {
  // Extract first paragraph after the title (skip the h1 line)
  const lines = content.split('\n');
  let startIndex = 0;
  
  // Find where content starts (after h1)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^#\s+/)) {
      startIndex = i + 1;
      break;
    }
  }

  // Skip empty lines and find first meaningful paragraph
  let paragraph = '';
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.match(/^---$/)) continue;
    
    // Stop at first heading or separator
    if (line.match(/^#+\s+/)) break;
    
    paragraph += (paragraph ? ' ' : '') + line;
    
    // If we have a complete sentence (ends with period), take it
    if (paragraph.endsWith('.') && paragraph.length > 50) {
      break;
    }
    
    // Limit to 150 chars
    if (paragraph.length >= 150) {
      paragraph = paragraph.substring(0, 147) + '...';
      break;
    }
  }

  return paragraph || '';
}

function generateFrontmatter(title: string, description?: string): string {
  let frontmatter = '---\n';
  frontmatter += `title: ${JSON.stringify(title)}\n`;
  if (description) {
    frontmatter += `description: ${JSON.stringify(description)}\n`;
  }
  frontmatter += '---\n\n';
  return frontmatter;
}

function convertMdToMdx(content: string): string {
  // Remove the h1 title from content (we'll use it in frontmatter)
  const lines = content.split('\n');
  let withoutTitle = '';
  let skipFirstH1 = true;

  for (const line of lines) {
    if (skipFirstH1 && line.match(/^#\s+/)) {
      skipFirstH1 = false;
      continue;
    }
    withoutTitle += line + '\n';
  }

  return withoutTitle.trimStart();
}

async function syncDocs() {
  try {
    console.log('📚 Syncing documentation files...\n');

    // Ensure docs directory exists
    if (!existsSync(DOCS_DIR)) {
      await mkdir(DOCS_DIR, { recursive: true });
    }

    // Find all markdown files
    const mdFiles = await findMarkdownFiles(PRIMITIVES_DIR);
    console.log(`Found ${mdFiles.length} markdown files\n`);

    // Process each file
    for (const { path: mdPath, name } of mdFiles) {
      console.log(`Processing: ${name}`);

      // Read markdown content
      const content = await readFile(mdPath, 'utf-8');

      // Extract title and description
      const title = extractTitle(content);
      const description = extractDescription(content);

      if (!title) {
        console.warn(`  ⚠️  No title found, skipping`);
        continue;
      }

      // Convert content (remove h1, keep rest)
      const mdxContent = convertMdToMdx(content);

      // Generate frontmatter
      const frontmatter = generateFrontmatter(title, description);

      // Create final MDX content
      const finalContent = frontmatter + mdxContent;

      // Write to docs directory
      const outputPath = join(DOCS_DIR, `${name}.mdx`);
      await writeFile(outputPath, finalContent, 'utf-8');

      console.log(`  ✓ Created ${name}.mdx`);
    }

    console.log(`\n✅ Successfully synced ${mdFiles.length} documentation files!`);
  } catch (error) {
    console.error('❌ Error syncing docs:', error);
    process.exit(1);
  }
}

syncDocs();
