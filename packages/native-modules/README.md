# @native-ui-org/native-modules

Native modules for NativeUI Primitives (iOS and Android).

This package contains all native modules that require platform-specific code. It's used internally by `@native-ui-org/primitives`.

## Structure

Each native module is organized in its own directory:

```
native-modules/
├── ios/
│   ├── context-menu/          # iOS native code for context-menu
│   └── NativeUiOrgNativeModules.podspec
├── android/
│   └── src/main/java/expo/modules/nativeuiorgnativemodules/
│       └── contextmenu/       # Android native code for context-menu
└── src/
    └── context-menu/          # TypeScript/React code
        ├── components/        # React components
        ├── native/            # Native module bindings
        ├── types/             # TypeScript types
        └── index.ts           # Module exports
```

## Modules

- **ContextMenu** - Native context menu for iOS and Android

## Adding a New Module

When adding a new native module (e.g., `activity-view`):

1. **Create iOS native code**:
   ```
   ios/activity-view/
   ├── NativeUiOrgActivityViewModule.swift
   └── NativeUiOrgActivityViewView.swift
   ```

2. **Create Android native code**:
   ```
   android/src/main/java/expo/modules/nativeuiorgnativemodules/activityview/
   ├── NativeUiOrgActivityViewModule.kt
   └── NativeUiOrgActivityViewView.kt
   ```

3. **Create TypeScript/React code**:
   ```
   src/activity-view/
   ├── components/
   ├── native/
   ├── types/
   └── index.ts
   ```

4. **Update `expo-module.config.json`** to register the new module

5. **Update `src/index.ts`** to export the new module

## Installation

This package is automatically installed as a dependency of `@native-ui-org/primitives`. You typically don't need to install it directly.

```bash
npm install @native-ui-org/primitives
```

## Usage

Import components from `@native-ui-org/primitives`:

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@native-ui-org/primitives";
```

## Development

This package uses Expo Modules for native code compilation.

```bash
# Build
pnpm build

# Clean
pnpm clean
```

## License

MIT
