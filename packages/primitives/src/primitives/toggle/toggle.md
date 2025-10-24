# Toggle Primitive

A component for button-like toggles (like formatting buttons).

---

## What is Toggle?

Toggle provides a way to create button-like toggles that can be pressed/unpressed. Unlike switches, toggles are typically used for actions like formatting (bold, italic, underline) or mode selection. The component stays "pressed" when active and returns to normal when inactive.

**Platform behavior:**
- **Web & Native**: Consistent rendering with proper accessibility
- **Accessibility**: Full ARIA support and screen reader compatibility
- **State Management**: Controlled and uncontrolled modes
- **Customizable**: Complete control via asChild pattern

---

## API

### Toggle

| Prop              | Type                      | Default | Description                                    |
|-------------------|---------------------------|---------|------------------------------------------------|
| `pressed`        | `boolean`                 | -       | Whether the toggle is pressed/active           |
| `defaultPressed` | `boolean`                 | `false` | Default pressed state (uncontrolled)           |
| `disabled`       | `boolean`                 | `false` | Whether the toggle is disabled                 |
| `value`          | `string`                  | -       | The value (used in groups)                     |
| `onPressedChange`| `(pressed: boolean) => void` | -    | Callback when pressed state changes            |
| `asChild`        | `boolean`                 | `false` | Use Slot pattern                               |

---

## Examples

### Basic usage

```tsx
import { Toggle } from "@native-ui-org/primitives";

const [pressed, setPressed] = useState(false);

<Toggle 
  pressed={pressed} 
  onPressedChange={setPressed} 
>
  <Text>Toggle me</Text>
</Toggle>
```

### Formatting buttons

```tsx
const [isBold, setIsBold] = useState(false);
const [isItalic, setIsItalic] = useState(false);

<View style={{ flexDirection: "row", gap: 8 }}>
  <Toggle pressed={isBold} onPressedChange={setIsBold}>
    <Text style={{ fontWeight: 'bold' }}>B</Text>
  </Toggle>
  
  <Toggle pressed={isItalic} onPressedChange={setIsItalic}>
    <Text style={{ fontStyle: 'italic' }}>I</Text>
  </Toggle>
  
  <Toggle pressed={isUnderline} onPressedChange={setIsUnderline}>
    <Text style={{ textDecorationLine: 'underline' }}>U</Text>
  </Toggle>
</View>
```

### Default pressed state

```tsx
<Toggle 
  defaultPressed={true}
  onPressedChange={setPressed} 
>
  <Text>Default active</Text>
</Toggle>
```

### Disabled state

```tsx
<Toggle 
  pressed={true}
  disabled={true}
>
  <Text>Disabled toggle</Text>
</Toggle>
```

### Custom styling with asChild

```tsx
<Toggle asChild pressed={isActive}>
  <Pressable style={[
    styles.toggleButton,
    isActive && styles.toggleButtonActive
  ]}>
    <Text style={[
      styles.toggleText,
      isActive && styles.toggleTextActive
    ]}>
      Format
    </Text>
  </Pressable>
</Toggle>
```

---

## Changelog

| Version | Changes                                    |
|---------|--------------------------------------------|
| `0.1.0` | Initial release. Basic toggle functionality. |
