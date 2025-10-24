# ToggleGroup Primitive

A component for managing multiple toggles with coordinated state.

---

## What is ToggleGroup?

ToggleGroup provides a way to manage multiple related toggles as a group. It handles state management, allowing multiple selections and coordinating the pressed state of child Toggle components. Perfect for toolbar buttons, formatting controls, or any set of related toggle actions.

**Platform behavior:**
- **Web & Native**: Consistent rendering with proper accessibility
- **Accessibility**: Group semantics with proper ARIA attributes
- **State Management**: Controlled and uncontrolled modes
- **Coordination**: Automatic value management for child toggles

---

## API

### ToggleGroup

| Prop            | Type                        | Default | Description                                    |
|-----------------|-----------------------------|---------|------------------------------------------------|
| `value`         | `string[]`                  | -       | Array of pressed values                         |
| `defaultValue`  | `string[]`                  | `[]`    | Default pressed values                          |
| `disabled`      | `boolean`                   | `false` | Whether the group is disabled                   |
| `onValueChange` | `(value: string[]) => void` | -       | Callback when group value changes              |
| `asChild`       | `boolean`                   | `false` | Use Slot pattern                               |

---

## Examples

### Basic usage

```tsx
import { ToggleGroup, Toggle } from "@native-ui-org/primitives";

const [selectedValues, setSelectedValues] = useState(["bold"]);

<ToggleGroup 
  value={selectedValues} 
  onValueChange={setSelectedValues}
>
  <Toggle value="bold">Bold</Toggle>
  <Toggle value="italic">Italic</Toggle>
  <Toggle value="underline">Underline</Toggle>
</ToggleGroup>
```

### Text formatting toolbar

```tsx
<ToggleGroup value={formatting} onValueChange={setFormatting}>
  <View style={{ flexDirection: "row", gap: 8 }}>
    <Toggle value="bold">
      <Text style={{ fontWeight: 'bold' }}>B</Text>
    </Toggle>
    
    <Toggle value="italic">
      <Text style={{ fontStyle: 'italic' }}>I</Text>
    </Toggle>
    
    <Toggle value="underline">
      <Text style={{ textDecorationLine: 'underline' }}>U</Text>
    </Toggle>
    
    <Toggle value="strikethrough">
      <Text style={{ textDecorationLine: 'line-through' }}>S</Text>
    </Toggle>
  </View>
</ToggleGroup>
```

### Alignment controls

```tsx
<ToggleGroup value={alignment} onValueChange={setAlignment}>
  <View style={{ flexDirection: "row", gap: 8 }}>
    <Toggle value="left">
      <Text>Left</Text>
    </Toggle>
    
    <Toggle value="center">
      <Text>Center</Text>
    </Toggle>
    
    <Toggle value="right">
      <Text>Right</Text>
    </Toggle>
    
    <Toggle value="justify">
      <Text>Justify</Text>
    </Toggle>
  </View>
</ToggleGroup>
```

### Theme selection

```tsx
<ToggleGroup value={themes} onValueChange={setThemes}>
  <View style={{ gap: 8 }}>
    <Toggle value="light">
      <Text>Light Theme</Text>
    </Toggle>
    
    <Toggle value="dark">
      <Text>Dark Theme</Text>
    </Toggle>
    
    <Toggle value="auto">
      <Text>Auto Theme</Text>
    </Toggle>
  </View>
</ToggleGroup>
```

---

## Changelog

| Version | Changes                                    |
|---------|--------------------------------------------|
| `0.1.0` | Initial release. Group management for toggles. |
