# Contributing to NativeUI Primitives

Thank you for your interest in contributing to NativeUI Primitives! We welcome contributions from the community in many ways: bug reports, feature requests, documentation improvements, and code contributions.

## Table of Contents

- [Project Architecture](#project-architecture)
- [File Structure](#file-structure)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Proposing New Components](#proposing-new-components)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Project Architecture

NativeUI Primitives is a **monorepo** managed with the following tools:

- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Turborepo](https://turbo.build/)** - High-performance build system for monorepos
- **[Changesets](https://github.com/changesets/changesets)** - Version management and changelog generation

## File Structure

```
primitives/
├── apps/
│   ├── website/          # Documentation website
│   └── sandbox/          # Testing and development app
├── packages/
│   ├── primitives/       # Core primitives library
│   └── context-menu/     # Context menu native module
└── ...
```

### Project Overview

| Package | Description | Purpose |
|---------|-------------|---------|
| **apps/website** | Documentation website built with Next.js | Hosts component documentation, examples, and guides |
| **apps/sandbox** | React Native Expo application | Development playground for testing components on iOS/Android/Web |
| **packages/primitives** | Core primitives library | Main package containing all primitive components |
| **packages/context-menu** | Context menu native module | Native implementation for context menu functionality |

## Development Setup

### 1. Fork the Repository

Click the "Fork" button on the [GitHub repository](https://github.com/nativeui-org/primitives) to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/primitives.git
cd primitives
```

### 3. Create a Branch

Create a new branch for your contribution:

```bash
git checkout -b feat/my-new-feature
# or
git checkout -b fix/issue-description
```

### 4. Install Dependencies

Install all dependencies using pnpm:

```bash
pnpm install
```

## Development Workflow

### Working with Specific Workspaces

Use pnpm's `--filter` flag to work with specific packages:

#### Run the Documentation Website

```bash
pnpm --filter @nativeui/website dev
```

The website will be available at `http://localhost:3000`

#### Build the Primitives Package

```bash
pnpm --filter @nativeui/primitives build
```

#### Run the Sandbox App

```bash
pnpm --filter sandbox start
```

### Common Commands

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Run type checking across all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Format code with Prettier
pnpm format
```

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention `category(scope or module): message` in your commit message while using one of the following categories:

- **feat / feature**: all changes that introduce completely new code or new features
- **fix**: changes that fix a bug (ideally you will additionally reference an issue if present)
- **refactor**: any code related change that is not a fix nor a feature
- **docs**: changing existing or creating new documentation (i.e. README, docs for usage of a lib or cli usage)
- **build**: all changes regarding the build of the software, changes to dependencies or the addition of new dependencies
- **test**: all changes regarding tests (adding new tests or changing existing ones)
- **ci**: all changes regarding the configuration of continuous integration (i.e. github actions, ci system)
- **chore**: all changes to the repository that do not fit into any of the above categories

### Example

```
fix(context-menu): prevent menu from closing on right-click
```

If you are interested in the detailed specification you can visit [Conventional Commits](https://www.conventionalcommits.org/) or check out the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

## Proposing New Components

Before implementing a new component, please **create a [GitHub Discussion](https://github.com/nativeui-org/primitives/discussions)** to:

1. Explain the use case for the new component
2. Discuss the API design
3. Get feedback from maintainers and the community
4. Ensure it aligns with the project's goals

This helps avoid duplicate work and ensures your contribution will be accepted.

## Testing

We maintain comprehensive test coverage to ensure component reliability.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for primitives package only
pnpm --filter @nativeui/primitives test

# Run tests in watch mode
pnpm --filter @nativeui/primitives test:watch

# Run tests for web platform
pnpm --filter @nativeui/primitives test:web

# Run tests for native platform
pnpm --filter @nativeui/primitives test:native
```

### Writing Tests

- Place tests next to the component file with `.test.tsx` extension
- Test both web and native implementations when applicable
- Include tests for accessibility features
- Cover edge cases and error scenarios

Example test structure:

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // test implementation
  });

  it('should handle user interaction', () => {
    // test implementation
  });

  it('should be accessible', () => {
    // test implementation
  });
});
```

## Additional Resources

- [Project README](./README.md)
- [Component Documentation](https://nativeui.org)
- [GitHub Discussions](https://github.com/nativeui-org/primitives/discussions)
- [Issue Tracker](https://github.com/nativeui-org/primitives/issues)

## Questions?

If you have questions or need help, feel free to:

- Open a [GitHub Discussion](https://github.com/nativeui-org/primitives/discussions)
- Comment on an existing issue
- Reach out to the maintainers

---

Thank you for contributing to NativeUI Primitives!

