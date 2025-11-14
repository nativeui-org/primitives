# Tabs

Organize **content into tabbed sections** with platform-optimized UI. On web, displays classic tabs. On iOS and Android, shows a beautiful liquid glass dropdown button.

---

## Overview

Tabs is a compound component for organizing content into tabbed sections with platform-specific implementations.

| Feature          | Description                          | Platforms         |
| ---------------- | ------------------------------------ | ----------------- |
| **Tabs**         | Root container managing state        | iOS, Android, Web |
| **TabsList**     | Container for tab triggers           | iOS, Android, Web |
| **TabsTrigger**  | Button that activates a tab           | iOS, Android, Web |
| **TabsContent**  | Content panel for a tab               | iOS, Android, Web |

---

## Platform Behavior

### Web
- Classic horizontal tabs with underline indicator
- Keyboard navigation support
- ARIA attributes for accessibility
- Standard tab UI pattern

### iOS / Android
- **Liquid glass button** with blur effect
- Dropdown menu showing all tabs
- Native menu interaction (UIMenu on iOS, PopupMenu on Android)
- Smooth animations and haptic feedback

---

## Setup & Usage Guide

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Simple tabs with multiple panels:

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    <Text>Content for Tab 1</Text>
  </TabsContent>
  
  <TabsContent value="tab2">
    <Text>Content for Tab 2</Text>
  </TabsContent>
  
  <TabsContent value="tab3">
    <Text>Content for Tab 3</Text>
  </TabsContent>
</Tabs>
```

---

### 3. Controlled State

Manage tab state externally:

```tsx
const [activeTab, setActiveTab] = useState("tab1");

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    <Text>Content 1</Text>
  </TabsContent>
  
  <TabsContent value="tab2">
    <Text>Content 2</Text>
  </TabsContent>
</Tabs>
```

---

### 4. Disabled Tabs

Disable all tabs:

```tsx
<Tabs defaultValue="tab1" disabled>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    <Text>Content 1</Text>
  </TabsContent>
</Tabs>
```

---

## API Reference

### Tabs

Root container managing tab state.

| Prop              | Type                            | Default | Description                              |
| ----------------- | ------------------------------- | ------- | ---------------------------------------- |
| `value`           | `string`                        | —       | Controlled active tab value              |
| `defaultValue`    | `string`                        | —       | Initial active tab (uncontrolled)       |
| `onValueChange`   | `(value: string) => void`       | —       | Callback when tab changes                |
| `disabled`        | boolean                         | `false` | Disable all tabs                         |
| `orientation`     | `"horizontal" \| "vertical"`   | `"horizontal"` | Tab orientation (web only) |
| `asChild`         | boolean                         | `false` | Use Slot pattern                         |

### TabsList

Container for TabsTrigger components.

| Prop       | Type    | Default | Description        |
| ---------- | ------- | ------- | ------------------ |
| `asChild`  | boolean | `false` | Use Slot pattern   |

### TabsTrigger

Button that activates a tab.

| Prop       | Type     | Default | Description        |
| ---------- | -------- | ------- | ------------------ |
| `value`    | `string` | —       | Tab value (required) |
| `asChild`  | boolean  | `false` | Use Slot pattern   |

### TabsContent

Content panel for a tab.

| Prop          | Type     | Default | Description                          |
| ------------- | -------- | ------- | ------------------------------------ |
| `value`       | `string` | —       | Tab value (required)                 |
| `forceMount`  | boolean  | `false` | Keep mounted when not selected       |
| `asChild`     | boolean  | `false` | Use Slot pattern                     |

---

## Accessibility

**Web:**

* Proper ARIA roles (`tablist`, `tab`, `tabpanel`)
* Keyboard navigation (Arrow keys, Home, End)
* Focus management
* Screen reader support

**Mobile:**

* Native accessibility labels
* VoiceOver/TalkBack support
* Haptic feedback on selection

---

## Version History

| Version | Notes                                                                        |
| ------- | ---------------------------------------------------------------------------- |
| `0.1.0` | Initial release — tabs with platform-specific UI (web tabs, native dropdown). |

---

**Summary:**
Tabs provides a unified API for organizing content into tabbed sections.
On web, it displays classic tabs. On iOS and Android, it shows a beautiful liquid glass dropdown button with native menu interactions.

