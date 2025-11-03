# Context Menu

Display **native context menus** with **right-click on web** and **long-press on mobile** using one unified API.

---

## Overview

Context Menu provides platform-native context menus with consistent behavior across all platforms.

| Feature          | Description                          | Platforms         |
| ---------------- | ------------------------------------ | ----------------- |
| **ContextMenu**  | Native context menu integration      | iOS, Android, Web |

---

## Setup & Usage Guide

ContextMenu adapts automatically to each platform's native implementation.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { ContextMenu } from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Add a context menu to any element:

```tsx
<ContextMenu
  actions={[
    { title: 'Copy', onPress: () => console.log('Copy') },
    { title: 'Paste', onPress: () => console.log('Paste') },
    { title: 'Delete', onPress: () => console.log('Delete'), destructive: true },
  ]}
>
  <View style={styles.content}>
    <Text>Right-click or long-press me</Text>
  </View>
</ContextMenu>
```

---

### 3. With Icons and Submenus

Add icons and nested menus:

```tsx
<ContextMenu
  actions={[
    { 
      title: 'Edit', 
      icon: 'edit',
      onPress: () => handleEdit() 
    },
    { 
      title: 'Share',
      icon: 'share',
      children: [
        { title: 'Email', onPress: () => shareEmail() },
        { title: 'Twitter', onPress: () => shareTwitter() },
      ]
    },
    {
      title: 'Delete',
      icon: 'trash',
      destructive: true,
      onPress: () => handleDelete()
    },
  ]}
>
  <View style={styles.card}>
    <Text>Item content</Text>
  </View>
</ContextMenu>
```

---

### 4. Disabled Actions

```tsx
<ContextMenu
  actions={[
    { title: 'Copy', onPress: handleCopy },
    { title: 'Paste', onPress: handlePaste, disabled: !hasClipboard },
    { title: 'Delete', onPress: handleDelete },
  ]}
>
  <Text>Content</Text>
</ContextMenu>
```

---

## API Reference

### ContextMenu

Container that adds context menu to its children.

| Prop       | Type              | Default | Description                          |
| ---------- | ----------------- | ------- | ------------------------------------ |
| `actions`  | `Action[]`        | —       | **Required.** Menu actions           |
| `children` | `React.ReactNode` | —       | **Required.** Trigger element        |
| `title`    | string            | —       | Menu title (mobile only)             |
| `disabled` | boolean           | `false` | Disable context menu                 |

**Action:**

| Property      | Type         | Description                         |
| ------------- | ------------ | ----------------------------------- |
| `title`       | string       | **Required.** Action label          |
| `onPress`     | `function`   | Action handler                      |
| `icon`        | string       | Icon name (platform dependent)      |
| `destructive` | boolean      | Mark as destructive (red on iOS)    |
| `disabled`    | boolean      | Disable this action                 |
| `children`    | `Action[]`   | Submenu items                       |

---

## Platform Behavior

| Platform          | Implementation                        | Characteristics                |
| ----------------- | ------------------------------------- | ------------------------------ |
| **iOS**           | UIContextMenuInteraction              | Native iOS context menu        |
| **Android**       | PopupMenu                             | Native Android popup           |
| **Web**           | Right-click event + custom menu       | Browser context menu override  |

**Triggers:**

* **Web:** Right-click
* **Mobile:** Long-press

---

## Accessibility

**All Platforms:**

* Native accessibility built-in
* Keyboard support on web (context menu key)
* Screen reader announces menu items

---

## Version History

| Version | Notes                                                              |
| ------- | ------------------------------------------------------------------ |
| `0.1.0` | Initial release — native context menus with unified API. |

---

**Summary:**
ContextMenu provides native context menus across all platforms.
Right-click on web, long-press on mobile — same API, same behavior.
Perfect for item actions, quick access menus, and contextual operations.

