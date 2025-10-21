# Context Menu

Cross-platform context menu component for React Native and Web. Right-click on web, long-press on mobile.

**Preview:** [Watch the demo](https://xbu6gsnzqpqao6cm.public.blob.vercel-storage.com/context-menu/context-menu.mp4)

## Installation

```bash
npm install @native-ui-org/context-menu
```

**Requirements:** Expo SDK 49+ (built with Expo Modules)

## Quick Start

```tsx
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@native-ui-org/context-menu';

<ContextMenu>
  <ContextMenuTrigger>
    <View style={styles.item}>
      <Text>Right-click me</Text>
    </View>
  </ContextMenuTrigger>
  
  <ContextMenuContent>
    <ContextMenuItem onPress={() => console.log('Edit')}>
      <Text>Edit</Text>
    </ContextMenuItem>
    <ContextMenuItem onPress={() => console.log('Delete')} destructive>
      <Text>Delete</Text>
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## Platform Behavior

| Platform | Trigger | Menu Type | Icons |
|----------|---------|-----------|-------|
| **Web** | Right-click | Custom Portal | Lucidem, Expo Vector Icons, etc. |
| **iOS** | Long-press | Native UIMenuController | SF Symbols |
| **Android** | Long-press | Native PopupMenu | Material Icons |

## Usage

### Web (Lucide Icons)

```tsx
import { Share, Edit, Trash2 } from 'lucide-react-native';

<ContextMenuItem onPress={handleShare}>
  <Share size={16} color="#666" />
  <Text>Share</Text>
</ContextMenuItem>
```

### Mobile (Platform Icons)

```tsx
<ContextMenuItem 
  onPress={handleEdit}
  iosIcon="pencil"
  androidIcon="edit"
>
  <Text>Edit</Text>
</ContextMenuItem>
```

## API

### ContextMenuItem Props

| Prop | Type | Description |
|------|------|-------------|
| `onPress` | `() => void` | Action handler |
| `destructive` | `boolean` | Red styling for dangerous actions |
| `disabled` | `boolean` | Disabled state |
| `iosIcon` | `string` | SF Symbol name (iOS only) |
| `androidIcon` | `string` | Material Icon name (Android only) |

### Other Components

- **ContextMenuTrigger** - Wraps trigger element, accepts `disabled` prop
- **ContextMenuContent** - Container for menu items
- **ContextMenuSeparator** - Visual separator between items

## Example: Chat List

```tsx
<ContextMenu>
  <ContextMenuTrigger>
    <View style={styles.chatItem}>
      <View style={styles.avatar}>
        <Text>AI</Text>
      </View>
      <View>
        <Text>React Native Help</Text>
        <Text>How to implement...</Text>
      </View>
    </View>
  </ContextMenuTrigger>
  
  <ContextMenuContent>
    <ContextMenuItem onPress={handleShare} iosIcon="square.and.arrow.up" androidIcon="share">
      <Text>Share chat</Text>
    </ContextMenuItem>
    <ContextMenuItem onPress={handleRename} iosIcon="pencil" androidIcon="edit">
      <Text>Rename</Text>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem onPress={handleDelete} destructive iosIcon="trash" androidIcon="delete">
      <Text>Delete</Text>
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## License

MIT