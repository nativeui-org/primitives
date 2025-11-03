# Toggle

Create **button-style toggles** for pressed/unpressed states, perfect for toolbars and formatting controls.

---

## Overview

Toggle is a button that maintains pressed state, commonly used in toolbars and formatting controls.

| Feature    | Description                          | Platforms         |
| ---------- | ------------------------------------ | ----------------- |
| **Toggle** | Button with persistent pressed state | iOS, Android, Web |

---

## Setup & Usage Guide

Toggle provides button-style controls that stay pressed when activated.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { Toggle } from "@native-ui-org/primitives";
```

---

### 2. Basic Usage (Uncontrolled)

Let the component manage its own state:

```tsx
<Toggle defaultPressed={false}>
  {({ pressed }) => (
    <View style={pressed ? styles.pressed : styles.unpressed}>
      <Icon name="bold" color={pressed ? 'blue' : 'black'} />
    </View>
  )}
</Toggle>
```

---

### 3. Controlled State

Manage toggle state externally:

```tsx
const [isBold, setIsBold] = useState(false);

  <Toggle pressed={isBold} onPressedChange={setIsBold}>
  {({ pressed }) => (
    <View style={pressed ? styles.active : styles.inactive}>
      <Icon name="bold" />
    </View>
  )}
</Toggle>
```

---

### 4. Formatting Toolbar

```tsx
<View style={styles.toolbar}>
  <Toggle pressed={bold} onPressedChange={setBold}>
    {({ pressed }) => (
      <View style={pressed && styles.active}>
        <Icon name="bold" />
      </View>
    )}
  </Toggle>
  
  <Toggle pressed={italic} onPressedChange={setItalic}>
    {({ pressed }) => (
      <View style={pressed && styles.active}>
        <Icon name="italic" />
      </View>
    )}
  </Toggle>
  
  <Toggle pressed={underline} onPressedChange={setUnderline}>
    {({ pressed }) => (
      <View style={pressed && styles.active}>
        <Icon name="underline" />
      </View>
    )}
  </Toggle>
</View>
```

---

### 5. Disabled State

```tsx
<Toggle disabled pressed={true}>
  {({ pressed }) => (
    <View style={styles.disabled}>
      <Icon name="star" />
    </View>
  )}
</Toggle>
```

---

## API Reference

### Toggle

Button with persistent pressed state.

| Prop               | Type                          | Default | Description                         |
| ------------------ | ----------------------------- | ------- | ----------------------------------- |
| `pressed`          | boolean                       | —       | Controlled pressed state            |
| `defaultPressed`   | boolean                       | `false` | Initial state (uncontrolled)        |
| `onPressedChange`  | `(pressed: boolean) => void`  | —       | Callback when state changes         |
| `disabled`         | boolean                       | `false` | Disable interactions                |
| `children`         | `function \| React.ReactNode` | —       | Render function or static content   |

---

## Platform Behavior

| Platform              | Implementation              | Characteristics                   |
| --------------------- | --------------------------- | --------------------------------- |
| **iOS / Android**     | Pressable with state        | Native touch feedback             |
| **Web**               | Button with toggle state    | Keyboard accessible               |
| **All Platforms**     | Consistent API              | Same props, same behavior         |

---

## Accessibility

**Web:**

* `role="button"`
* `aria-pressed` reflects state
* Keyboard support (Space/Enter to toggle)
* Focus management

**Mobile:**

* Accessibility role "togglebutton"
* State announced to screen readers
* Works with VoiceOver and TalkBack

---

## Version History

| Version | Notes                                                                          |
| ------- | ------------------------------------------------------------------------------ |
| `0.1.0` | Initial release — toggle button with controlled/uncontrolled states. |

---

**Summary:**
Toggle provides button-style controls with persistent pressed state.
Use it for toolbars, formatting controls, or any button that stays active.
Different from Switch — Toggle is for actions, Switch is for settings.
