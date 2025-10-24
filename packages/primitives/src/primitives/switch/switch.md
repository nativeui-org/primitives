# Switch Primitive

A component for switching between on/off states.

---

## What is Switch?

Switch provides a way to switch between two states (on/off). It can be used standalone or within a SwitchGroup for coordinated state management. The component is highly customizable and supports the `asChild` pattern for complete control over rendering.

**Platform behavior:**
- **Web & Native**: Consistent rendering with proper accessibility
- **Accessibility**: Full ARIA support and screen reader compatibility
- **State Management**: Controlled and uncontrolled modes
- **Customizable**: Complete control via asChild pattern

---

## API

### Switch

| Prop              | Type                      | Default | Description                                    |
|-------------------|---------------------------|---------|------------------------------------------------|
| `pressed`        | `boolean`                 | -       | Whether the switch is pressed/on               |
| `defaultPressed` | `boolean`                 | `false` | Default pressed state (uncontrolled)           |
| `disabled`       | `boolean`                 | `false` | Whether the switch is disabled                 |
| `value`          | `string`                  | -       | The value (used in groups)                     |
| `onPressedChange`| `(pressed: boolean) => void` | -    | Callback when pressed state changes            |
| `asChild`        | `boolean`                 | `false` | Use Slot pattern                               |

---

## Examples

### Basic usage

```tsx
import { Switch } from "@native-ui-org/primitives";

const [pressed, setPressed] = useState(false);

<Switch 
  pressed={pressed} 
  onPressedChange={setPressed} 
/>
```

### Default pressed state

```tsx
<Switch 
  defaultPressed={true}
  onPressedChange={setPressed} 
/>
```

### Disabled state

```tsx
<Switch 
  pressed={true}
  disabled={true}
/>
```

### With label

```tsx
<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
  <Switch 
    pressed={notificationsEnabled} 
    onPressedChange={setNotificationsEnabled}
  />
  <Text>Enable notifications</Text>
</View>
```

### Custom styling with asChild

```tsx
<Switch asChild pressed={isOn}>
  <Pressable style={styles.customSwitch}>
    <View style={[
      styles.switch,
      isOn && styles.switchOn
    ]}>
      <View style={[
        styles.thumb,
        isOn && styles.thumbOn
      ]} />
    </View>
  </Pressable>
</Switch>
```

---

## Changelog

| Version | Changes                                    |
|---------|--------------------------------------------|
| `0.1.0` | Initial release. Basic switch functionality. |
