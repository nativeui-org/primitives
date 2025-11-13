# Radio

Create **accessible radio buttons** with **custom styling** and full keyboard support across all platforms.

---

## Overview

Radio is a compound component for building radio buttons with labels and custom indicators. Unlike checkboxes, only one radio in a group can be selected at a time.

| Feature              | Description                        | Platforms         |
| -------------------- | ---------------------------------- | ----------------- |
| **Radio**            | Root container managing state      | iOS, Android, Web |
| **RadioIndicator**   | Visual radio state indicator       | iOS, Android, Web |
| **RadioLabel**       | Clickable label text               | iOS, Android, Web |

---

## Setup & Usage Guide

Radio provides the structure for accessible radio inputs with full control over styling.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { 
  Radio, 
  RadioIndicator,
  RadioLabel 
} from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Simple radio with label:

```tsx
<Radio defaultChecked={false}>
  <RadioIndicator>
    {({ checked }) => (
      <View style={checked ? styles.checked : styles.unchecked}>
        {checked && <View style={styles.dot} />}
      </View>
    )}
  </RadioIndicator>
  <RadioLabel htmlFor="option1">
    <Text>Option 1</Text>
  </RadioLabel>
</Radio>
```

---

### 3. Controlled State

Manage radio state externally:

```tsx
const [checked, setChecked] = useState(false);

<Radio checked={checked} onCheckedChange={setChecked}>
  <RadioIndicator>
    {({ checked }) => (
      <View style={styles.indicator}>
        {checked && <Text>●</Text>}
      </View>
    )}
  </RadioIndicator>
  <RadioLabel htmlFor="option1">
    <Text>Select option</Text>
  </RadioLabel>
</Radio>
```

---

### 4. Disabled State

```tsx
<Radio disabled checked={true}>
  <RadioIndicator>
    {({ checked }) => (
      <View style={styles.indicatorDisabled}>
        {checked && <View style={styles.dotDisabled} />}
      </View>
    )}
  </RadioIndicator>
  <RadioLabel htmlFor="disabled">
    <Text style={styles.labelDisabled}>Disabled option</Text>
  </RadioLabel>
</Radio>
```

---

## API Reference

### Radio

Root container managing radio state.

| Prop              | Type                      | Default | Description                       |
| ----------------- | ------------------------- | ------- | --------------------------------- |
| `checked`         | boolean                   | —       | Controlled checked state          |
| `defaultChecked`  | boolean                   | `false` | Initial state (uncontrolled)      |
| `onCheckedChange` | `(checked: boolean) => void` | —    | Callback when state changes       |
| `disabled`        | boolean                   | `false` | Disable interactions              |
| `required`        | boolean                   | `false` | Mark as required (forms)          |
| `name`            | string                    | —       | Form field name                   |
| `value`           | string                    | —       | Radio value (used in RadioGroup)  |
| `asChild`         | boolean                   | `false` | Use Slot pattern                  |

### RadioIndicator

Visual indicator for radio state.

| Prop          | Type                                  | Default | Description                 |
| ------------- | ------------------------------------- | ------- | --------------------------- |
| `children`    | `function \| React.ReactNode`        | —       | Render function or content  |
| `forceMount`  | boolean                               | `false` | Keep mounted when unchecked |
| `asChild`     | boolean                               | `false` | Use Slot pattern            |

### RadioLabel

Clickable label text.

| Prop       | Type    | Default | Description        |
| ---------- | ------- | ------- | ------------------ |
| `htmlFor`  | string  | —       | ID of radio        |
| `asChild`  | boolean | `false` | Use Slot pattern   |
| `...props` | any     | —       | Standard Text props |

---

## Platform Behavior

| Platform              | Implementation                 | Characteristics                   |
| --------------------- | ------------------------------ | --------------------------------- |
| **iOS / Android**     | Pressable with state           | Native touch feedback             |
| **Web**               | Input radio (hidden) + visual  | Keyboard accessible, form compatible |
| **All Platforms**     | Consistent API                 | Same props, same behavior         |

---

## Accessibility

**Web:**

* Hidden `<input type="radio">` for form compatibility
* Proper `label` association
* Keyboard support (Space/Enter to toggle)
* Focus management
* Radio group semantics

**Mobile:**

* Accessibility role "radio"
* State announced to screen readers
* Works with VoiceOver and TalkBack

---

## Version History

| Version | Notes                                                                        |
| ------- | ---------------------------------------------------------------------------- |
| `0.1.0` | Initial release — radio with label and indicator, controlled/uncontrolled states. |

---

**Summary:**
Radio provides accessible radio button inputs with full styling control.
Use it for single-select forms, option groups, or any exclusive choice input.
Supports both controlled and uncontrolled modes with proper accessibility.

