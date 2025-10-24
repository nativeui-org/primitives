# SwitchGroup Primitive

A component for managing multiple switches with coordinated state.

---

## What is SwitchGroup?

SwitchGroup provides a way to manage multiple related switches as a group. It handles state management, allowing multiple selections and coordinating the pressed state of child Switch components.

**Platform behavior:**
- **Web & Native**: Consistent rendering with proper accessibility
- **Accessibility**: Group semantics with proper ARIA attributes
- **State Management**: Controlled and uncontrolled modes
- **Coordination**: Automatic value management for child switches

---

## API

### SwitchGroup

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
import { SwitchGroup, Switch } from "@native-ui-org/primitives";

const [selectedValues, setSelectedValues] = useState(["option1"]);

<SwitchGroup 
  value={selectedValues} 
  onValueChange={setSelectedValues}
>
  <Switch value="option1" />
  <Switch value="option2" />
  <Switch value="option3" />
</SwitchGroup>
```

### Settings panel

```tsx
<SwitchGroup value={settings} onValueChange={setSettings}>
  <View style={{ gap: 16 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Switch value="notifications" />
      <Text>Push notifications</Text>
    </View>
    
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Switch value="email" />
      <Text>Email updates</Text>
    </View>
    
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Switch value="analytics" />
      <Text>Analytics tracking</Text>
    </View>
  </View>
</SwitchGroup>
```

### Filter controls

```tsx
<SwitchGroup value={activeFilters} onValueChange={setActiveFilters}>
  <Text style={styles.filterTitle}>Filter by category:</Text>
  <View style={{ gap: 8 }}>
    <Switch value="electronics" />
    <Text>Electronics</Text>
    
    <Switch value="clothing" />
    <Text>Clothing</Text>
    
    <Switch value="books" />
    <Text>Books</Text>
  </View>
</SwitchGroup>
```

---

## Changelog

| Version | Changes                                    |
|---------|--------------------------------------------|
| `0.1.0` | Initial release. Group management for switches. |
