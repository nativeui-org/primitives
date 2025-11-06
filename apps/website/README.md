# NativeUI Website

Documentation website for NativeUI Primitives, powered by [Fumadocs](https://fumadocs.dev) and [Next.js](https://nextjs.org).

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Sync documentation from primitives
pnpm sync-docs

# Start development server
pnpm dev
```

Visit http://localhost:3000

## 📚 Documentation System

### Automatic Documentation Generation

This website features an automated documentation system that converts markdown files from the primitives package into rich, interactive MDX documentation.

**Key Features:**
- 📦 **Installation tabs** (npm/pnpm/yarn/bun)
- 🎮 **Interactive previews** (embedded sandbox)
- 📝 **Auto-generated** from source markdown
- 🎨 **Modern UI** with dark mode
- 🔍 **Full-text search**

### Commands

```bash
# Sync documentation from packages/primitives
pnpm sync-docs

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📖 Documentation Workflow

### 1. Write Documentation

Edit markdown files in `packages/primitives/src/primitives/{component}/{component}.md`

```md
# Component Name

Brief description here.

## When should you use it?

...

## API

...

## Examples

...
```

### 2. Sync to Website

```bash
pnpm sync-docs
```

This automatically:
- Extracts frontmatter (title, description)
- Adds `<Preview />` component first (if preview exists)
- Adds `<InstallTabs />` component after preview
- Converts to MDX format
- Outputs to `docs/` directory

### 3. Preview

```bash
pnpm dev
```

Visit http://localhost:3000/docs/{component}

## 🎨 Custom MDX Components

### `<InstallTabs />`

Interactive package manager tabs.

```mdx
<InstallTabs />
<InstallTabs package="@native-ui-org/native-modules" />
```

### `<Preview component="name" />`

Embedded sandbox preview.

```mdx
<Preview component="alert" title="Interactive Demo" />
```

## 📁 Project Structure

```
apps/website/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/mdx/   # Custom MDX components
│   ├── lib/              # Utilities
│   └── mdx-components.tsx
├── docs/                 # Documentation files (generated)
├── scripts/              # Build scripts
│   ├── sync-docs.ts      # Documentation sync script
│   ├── README.md         # Script documentation
│   └── EXAMPLE.md        # Before/after example
├── public/               # Static assets
└── DOCUMENTATION_SYSTEM.md  # System overview
```

## 🔧 Configuration

### Fumadocs

Configuration in `source.config.ts`:

```ts
export const docs = defineDocs({
  dir: 'docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});
```

### Next.js

Standard Next.js configuration in `next.config.mjs`.

### MDX

Custom components are registered in `src/mdx-components.tsx`.

## 📚 Additional Resources

- **[DOCUMENTATION_SYSTEM.md](./DOCUMENTATION_SYSTEM.md)** - Complete system overview
- **[scripts/README.md](./scripts/README.md)** - Script documentation
- **[scripts/EXAMPLE.md](./scripts/EXAMPLE.md)** - Before/after examples
- **[../packages/primitives/DOCUMENTATION_GUIDE.md](../../packages/primitives/DOCUMENTATION_GUIDE.md)** - Writing guide

## 🛠️ Development

### Adding New Components

1. Create markdown: `packages/primitives/src/primitives/{name}/{name}.md`
2. (Optional) Create preview: `apps/sandbox/app/preview/{name}.tsx`
3. Sync docs: `pnpm sync-docs`
4. Preview: `pnpm dev`

### Modifying MDX Components

Edit files in `src/components/mdx/`:
- `InstallTabs.tsx` - Installation tabs component
- `Preview.tsx` - Preview iframe component

### Changing Documentation Layout

Edit `src/app/docs/layout.tsx` and related files.

## 🐛 Troubleshooting

**Documentation not updating?**
- Run `pnpm sync-docs` again
- Restart dev server (`pnpm dev`)

**Preview not showing?**
- Verify sandbox URL is accessible
- Check preview file exists in `apps/sandbox/app/preview/`

**Build errors?**
- Run `pnpm install`
- Check TypeScript errors: `tsc --noEmit`

## 📝 License

MIT
