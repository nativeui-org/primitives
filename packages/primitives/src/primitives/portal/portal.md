# Portal

Render **components outside the React tree** for overlays, modals, and tooltips that escape stacking contexts.

---

## Overview

Portal moves component rendering to a different part of the DOM tree on web, while maintaining normal rendering on mobile.

| Feature       | Description                              | Platforms         |
| ------------- | ---------------------------------------- | ----------------- |
| **Portal**    | Render children outside parent container | Web               |
| **Pass-through** | Normal rendering on mobile            | iOS, Android      |

---

## Setup & Usage Guide

Portal is primarily a web utility for escaping z-index and overflow constraints.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { Portal } from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Render content at document root (web only):

```tsx
<Portal>
  <View style={styles.overlay}>
    <Text>This renders at document.body on web</Text>
  </View>
</Portal>
```

---

### 3. Custom Container

Specify a custom DOM container:

```tsx
const modalRoot = document.getElementById('modal-root');

<Portal container={modalRoot}>
  <View style={styles.modal}>
    <Text>Modal content</Text>
  </View>
</Portal>
```

---

### 4. Building a Modal

Combine Portal with other components:

```tsx
function Modal({ open, children }) {
  if (!open) return null;
  
  return (
    <Portal>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {children}
        </View>
      </View>
    </Portal>
  );
}
```

---

## API Reference

### Portal

Renders children outside the normal React tree.

| Prop        | Type              | Default         | Description                              |
| ----------- | ----------------- | --------------- | ---------------------------------------- |
| `children`  | `React.ReactNode` | —               | Content to render in portal              |
| `container` | `Element \| null` | `document.body` | DOM container (web only)                 |

**Platform notes:**

* On web: Creates a React portal to the specified container
* On mobile: Renders children normally (Portal is transparent)

---

## Platform Behavior

| Platform          | Implementation                    | Characteristics               |
| ----------------- | --------------------------------- | ----------------------------- |
| **Web**           | React.createPortal to DOM node    | Escapes overflow and z-index  |
| **iOS / Android** | Pass-through (renders normally)   | No special behavior needed    |

---

## Accessibility

Portal is transparent to accessibility. All ARIA props and roles are maintained on the rendered children.

**Best practices:**

* Add proper focus management for modals
* Include `aria-modal="true"` on modal content
* Manage focus trap for keyboard navigation
* Restore focus when portal content unmounts

---

## Version History

| Version | Notes                                                    |
| ------- | -------------------------------------------------------- |
| `0.1.0` | Initial release — web portal with mobile pass-through. |

---

**Summary:**
Portal is essential for overlays, modals, and tooltips on web.
Use it to escape z-index stacking contexts and overflow constraints.
On mobile, it's a transparent wrapper with no special behavior.
