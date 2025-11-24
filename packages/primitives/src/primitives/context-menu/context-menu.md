# ContextMenu

A cross-platform context menu component that provides native context menus on iOS and Android, and a custom menu on web.

## Installation

The `ContextMenu` component is part of `@native-ui-org/primitives` and requires `@native-ui-org/native-modules` to be installed (it's automatically included as a dependency).

```bash
npm install @native-ui-org/primitives
```

## Important: Native Module Setup

**⚠️ The `ContextMenu` component requires native code to work on iOS and Android.**

### Managed Workflow (Expo Go / Development Build)

If you're using Expo's managed workflow:

1. **For development**: You can use `npx expo start` but the native context menu will only work on **web**. On iOS/Android, you'll see a warning and the menu won't appear until you build the native code.

2. **To enable native functionality**, you need to build the native code:
   ```bash
   # Option 1: Prebuild (creates ios/ and android/ folders)
   npx expo prebuild
   
   # Then run on native platforms
   npx expo run:ios
   # or
   npx expo run:android
   ```

3. **Or use EAS Build** (recommended for production):
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

### Bare Workflow

If you already have `ios/` and `android/` folders in your project:

1. Install dependencies:
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

2. Run normally:
   ```bash
   npx expo start
   # Then press 'i' for iOS or 'a' for Android
   ```

### Web

The `ContextMenu` component works immediately on web without any native setup. You can use `npx expo start` and test it in your browser right away.

## Usage

**⚠️ Important**: The `ContextMenu` component does NOT accept an `actions` prop. You must use the composition pattern with `ContextMenuTrigger`, `ContextMenuContent`, and `ContextMenuItem` components.

The `ContextMenu` component uses a composition pattern similar to Radix UI or shadcn/ui. You need to use `ContextMenuTrigger`, `ContextMenuContent`, and `ContextMenuItem` components:

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@native-ui-org/primitives';

function MyComponent() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <View>
          <Text>Right-click or long-press me</Text>
        </View>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onPress={() => console.log('Copy')}
          iosIcon="doc.on.doc"
          androidIcon="content-copy"
        >
          <Text>Copy</Text>
        </ContextMenuItem>
        
        <ContextMenuItem
          onPress={() => console.log('Paste')}
          iosIcon="doc.on.clipboard"
          androidIcon="content-paste"
        >
          <Text>Paste</Text>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem
          onPress={() => console.log('Delete')}
          destructive
          iosIcon="trash"
          androidIcon="delete"
        >
          <Text>Delete</Text>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## API

### ContextMenu

The root component that wraps the trigger and content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `submenuIndicator` | `ReactNode \| ((isOpen: boolean) => ReactNode)` | - | Custom indicator for submenus |

### ContextMenuTrigger

Wraps the content that triggers the context menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable the context menu trigger |

### ContextMenuContent

Wraps the menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceMount` | `boolean` | `false` | Force mount the content even when closed |

### ContextMenuItem

Individual menu item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `() => void` | - | Callback when item is pressed |
| `disabled` | `boolean` | `false` | Disable the menu item |
| `destructive` | `boolean` | `false` | Mark item as destructive (red on iOS) |
| `icon` | `ReactNode` | - | Icon to display (web only) |
| `iosIcon` | `string` | - | SF Symbol name for iOS |
| `androidIcon` | `string` | - | Material icon name for Android |

### ContextMenuSeparator

Visual separator between menu items.

### ContextMenuSubmenu

Nested submenu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label for the submenu |
| `disabled` | `boolean` | `false` | Disable the submenu |
| `icon` | `ReactNode` | - | Icon to display (web only) |
| `iosIcon` | `string` | - | SF Symbol name for iOS |
| `androidIcon` | `string` | - | Material icon name for Android |

### ContextMenuSection

Group menu items into sections (iOS style).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Section title |

## Platform Behavior

- **Web**: Right-click triggers a custom menu with Portal rendering
- **iOS**: Long press triggers native `UIContextMenuInteraction`
- **Android**: Long press triggers native `PopupMenu`

## Examples

### Simple Menu

```tsx
<ContextMenu>
  <ContextMenuTrigger>
    <View style={styles.item}>
      <Text>Long press me</Text>
    </View>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onPress={() => console.log('Copy')}>
      <Text>Copy</Text>
    </ContextMenuItem>
    <ContextMenuItem onPress={() => console.log('Paste')}>
      <Text>Paste</Text>
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### With Separators

```tsx
<ContextMenuContent>
  <ContextMenuItem onPress={handleCopy}>
    <Text>Copy</Text>
  </ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuItem onPress={handleDelete} destructive>
    <Text>Delete</Text>
  </ContextMenuItem>
</ContextMenuContent>
```

### With Submenus

```tsx
<ContextMenuContent>
  <ContextMenuItem onPress={handleShare}>
    <Text>Share</Text>
  </ContextMenuItem>
  <ContextMenuSubmenu label="Export" iosIcon="square.and.arrow.down">
    <ContextMenuItem onPress={handleExportPDF}>
      <Text>Export as PDF</Text>
    </ContextMenuItem>
    <ContextMenuItem onPress={handleExportMarkdown}>
      <Text>Export as Markdown</Text>
    </ContextMenuItem>
  </ContextMenuSubmenu>
</ContextMenuContent>
```

### With Sections

```tsx
<ContextMenuContent>
  <ContextMenuSection title="General">
    <ContextMenuItem onPress={handleWiFi}>
      <Text>Wi-Fi</Text>
    </ContextMenuItem>
    <ContextMenuItem onPress={handleBluetooth}>
      <Text>Bluetooth</Text>
    </ContextMenuItem>
  </ContextMenuSection>
  <ContextMenuSection title="Account">
    <ContextMenuItem onPress={handleProfile}>
      <Text>Profile</Text>
    </ContextMenuItem>
  </ContextMenuSection>
</ContextMenuContent>
```

## Troubleshooting

### Warning: "The native view manager for module(NativeUiOrgContextMenu) isn't exported"

This warning appears when the native module isn't properly linked. This is **normal** if you're using `npx expo start` without building the native code first.

**What it means:**
- ✅ **Web**: The warning is harmless and doesn't affect functionality. The context menu works perfectly on web.
- ⚠️ **iOS/Android**: The native context menu won't work until you build the native code.

**To fix it:**

1. **If using managed workflow**, run:
   ```bash
   npx expo prebuild
   npx expo run:ios  # or npx expo run:android
   ```

2. **If using bare workflow**, make sure:
   - You've run `pod install` in the `ios/` directory
   - You've rebuilt the app after installing `@native-ui-org/primitives`

3. **Restart your development server** after building the native code.

**Note**: You can continue developing on web with `npx expo start` - the warning won't affect web functionality. Only iOS/Android require the native build.

### Common Errors

#### "Property 'actions' does not exist on type 'ContextMenuProps'"

❌ **Wrong:**
```tsx
<ContextMenu actions={[...]}>
  <View>...</View>
</ContextMenu>
```

✅ **Correct:**
```tsx
<ContextMenu>
  <ContextMenuTrigger>
    <View>...</View>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onPress={...}>
      <Text>Action</Text>
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

The `ContextMenu` component uses a composition pattern, not a simple `actions` prop. Always use `ContextMenuTrigger`, `ContextMenuContent`, and `ContextMenuItem`.

