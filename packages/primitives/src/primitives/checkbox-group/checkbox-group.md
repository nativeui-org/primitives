# Checkbox Group

Coordinate **multiple checkboxes** with shared state management and validation.

---

## Overview

CheckboxGroup manages multiple checkboxes as a coordinated group with array-based value state.

| Feature            | Description                            | Platforms         |
| ------------------ | -------------------------------------- | ----------------- |
| **CheckboxGroup**  | Root container coordinating checkboxes | iOS, Android, Web |

---

## Setup & Usage Guide

CheckboxGroup simplifies managing multiple checkbox selections.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { 
  CheckboxGroup, 
  Checkbox, 
  CheckboxIndicator,
  CheckboxLabel 
} from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Manage multiple checkboxes as a group:

```tsx
<CheckboxGroup defaultValue={['option1']}>
  <Checkbox value="option1">
    <CheckboxIndicator>
      {({ checked }) => <View style={checked ? styles.checked : styles.unchecked} />}
    </CheckboxIndicator>
    <CheckboxLabel><Text>Option 1</Text></CheckboxLabel>
  </Checkbox>
  
  <Checkbox value="option2">
    <CheckboxIndicator>
      {({ checked }) => <View style={checked ? styles.checked : styles.unchecked} />}
    </CheckboxIndicator>
    <CheckboxLabel><Text>Option 2</Text></CheckboxLabel>
  </Checkbox>
  
  <Checkbox value="option3">
    <CheckboxIndicator>
      {({ checked }) => <View style={checked ? styles.checked : styles.unchecked} />}
    </CheckboxIndicator>
    <CheckboxLabel><Text>Option 3</Text></CheckboxLabel>
  </Checkbox>
</CheckboxGroup>
```

---

### 3. Controlled State

Manage group state externally:

```tsx
const [selected, setSelected] = useState(['option1', 'option3']);

<CheckboxGroup value={selected} onValueChange={setSelected}>
  <Checkbox value="option1">
    <CheckboxIndicator>{({ checked }) => /* ... */}</CheckboxIndicator>
    <CheckboxLabel><Text>Option 1</Text></CheckboxLabel>
  </Checkbox>
  
  <Checkbox value="option2">
    <CheckboxIndicator>{({ checked }) => /* ... */}</CheckboxIndicator>
    <CheckboxLabel><Text>Option 2</Text></CheckboxLabel>
  </Checkbox>
</CheckboxGroup>
```

---

### 4. Disabled Group

Disable all checkboxes at once:

```tsx
<CheckboxGroup disabled>
  <Checkbox value="option1">
    <CheckboxIndicator>{({ checked }) => /* ... */}</CheckboxIndicator>
    <CheckboxLabel><Text>Option 1</Text></CheckboxLabel>
  </Checkbox>
</CheckboxGroup>
```

---

## API Reference

### CheckboxGroup

Container coordinating multiple checkboxes.

| Prop              | Type                            | Default | Description                              |
| ----------------- | ------------------------------- | ------- | ---------------------------------------- |
| `value`           | `string[]`                      | —       | Controlled selected values               |
| `defaultValue`    | `string[]`                      | `[]`    | Initial selected values (uncontrolled)   |
| `onValueChange`   | `(value: string[]) => void`     | —       | Callback when selection changes          |
| `disabled`        | boolean                         | `false` | Disable all checkboxes                   |
| `required`        | boolean                         | `false` | At least one must be selected            |
| `name`            | string                          | —       | Form field name                          |
| `asChild`         | boolean                         | `false` | Use Slot pattern                         |

**Note:** Individual checkboxes inside the group use their `value` prop to identify themselves.

---

## Platform Behavior

| Platform              | Implementation                     | Characteristics               |
| --------------------- | ---------------------------------- | ----------------------------- |
| **iOS / Android**     | Context-based state coordination   | Native performance            |
| **Web**               | Fieldset with checkboxes           | Form compatible               |
| **All Platforms**     | Consistent API                     | Same props, same behavior     |

---

## Accessibility

**Web:**

* Wraps in `<fieldset>` for semantic grouping
* Proper keyboard navigation
* Form validation support

**Mobile:**

* Group label announced by screen readers
* Individual checkbox states accessible

---

## Version History

| Version | Notes                                                                   |
| ------- | ----------------------------------------------------------------------- |
| `0.1.0` | Initial release — checkbox group with array-based state management. |

---

**Summary:**
CheckboxGroup simplifies managing multiple checkbox selections.
Use it for multi-select forms, filter options, or settings panels.
Provides coordinated state management with array-based values.
