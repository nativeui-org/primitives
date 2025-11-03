# View

The foundational **layout container for building cross-platform UIs** with native performance and web accessibility.

---

## Overview

View is a cross-platform layout primitive that works identically on mobile and web with optional polymorphism support.

| Feature      | Description                                   | Platforms         |
| ------------ | --------------------------------------------- | ----------------- |
| **Layout**   | Standard container for positioning and style  | iOS, Android, Web |
| **asChild**  | Polymorphic rendering without extra wrappers  | iOS, Android, Web |
| **A11y**     | Full accessibility support (ARIA, roles, etc) | iOS, Android, Web |

---

## Setup & Usage Guide

View works out of the box with no configuration needed. It's a drop-in replacement for React Native's `View` with enhanced web capabilities.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { View } from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Use View just like React Native's View component:

```tsx
<View style={{ padding: 16, backgroundColor: "papayawhip" }}>
  <Text>Hello world</Text>
</View>
```

---

### 3. Semantic HTML (Web Only)

On web, use `asChild` to render semantic HTML elements while keeping React Native's styling:

```tsx
<View asChild role="region" aria-label="Hero section">
  <section>
    <Text>Semantic content</Text>
  </section>
</View>
```

---

### 4. Polymorphic Components

Combine with animation libraries or styled components:

```tsx
import { motion } from "framer-motion";

<View asChild>
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    Animated content
  </motion.div>
</View>
```

---

## API Reference

### View

The base layout container component.

| Prop       | Type                      | Default | Description                                 |
| ---------- | ------------------------- | ------- | ------------------------------------------- |
| `asChild`  | boolean                   | `false` | Render child element without View wrapper   |
| `style`    | `StyleProp<ViewStyle>`    | —       | React Native style prop                     |
| `role`     | string                    | —       | ARIA role (web only)                        |
| `tabIndex` | `0 \| -1`                 | —       | Tab navigation control (web only)           |
| `dir`      | `"ltr" \| "rtl" \| "auto"` | —       | Text direction (web only)                   |
| `aria-*`   | string \| boolean         | —       | Any ARIA attribute (web only)               |
| `...props` | `ViewProps`               | —       | All React Native View props (layout, events, etc) |

---

## Platform Behavior

| Platform              | Implementation                    | Characteristics                   |
| --------------------- | --------------------------------- | --------------------------------- |
| **iOS / Android**     | Standard React Native `View`      | Native rendering and performance  |
| **Web**               | Enhanced with accessibility props | Semantic HTML, ARIA support       |
| **All Platforms**     | Consistent API                    | Same props, same behavior         |

---

## Accessibility

**Web:**

* Supports all ARIA attributes (`aria-label`, `aria-describedby`, etc.)
* Accepts `role` for semantic meaning
* `tabIndex` for keyboard navigation
* Works with screen readers

**Mobile:**

* Standard React Native accessibility props
* VoiceOver and TalkBack compatible

---

## Version History

| Version | Notes                                                                 |
| ------- | --------------------------------------------------------------------- |
| `0.1.0` | Initial release — cross-platform View with `asChild` and A11y props. |

---

**Summary:**
View is the foundation for all layouts in cross-platform apps.
Use it everywhere you'd use React Native's View, with the added benefit of web accessibility and polymorphism.
