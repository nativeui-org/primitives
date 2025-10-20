# Collapsible Primitive

A cross-platform collapsible component (accordion) based on React Native primitives.

This component provides a **minimal, unstyled foundation** for building expandable/collapsible UI elements with proper accessibility.

---

## What is Collapsible?

`Collapsible` is a compound component that manages the open/closed state of expandable content. It consists of three parts:

1. **`Collapsible`** - Root container that manages state and provides context
2. **`CollapsibleTrigger`** - Button that toggles the open/closed state
3. **`CollapsibleContent`** - Content container that shows/hides based on state

---

## When should you use it?

✅ Use `Collapsible` if:
- You need **expandable/collapsible sections** (accordions, dropdowns, etc.)
- You want **proper accessibility** out of the box (ARIA attributes, roles)
- You're building **cross-platform** (iOS, Android, Web) with consistent behavior
- You need **controlled or uncontrolled** state management
- You want a **minimal base** without imposed styles or animations

⚠️ Consider alternatives if:
- You need **pre-styled components** (this is unstyled by design)
- You need **built-in animations** (you'll need to add those yourself)
- You only need a simple show/hide toggle (might be overkill)

---

## Philosophy & Behavior

### 1. **Unstyled by design**
- No default styles, colors, or animations
- You have complete control over appearance
- Styles are applied via the standard `style` prop

### 2. **Controlled and uncontrolled modes**
- **Uncontrolled**: Component manages its own state via `defaultOpen`
- **Controlled**: You manage state externally via `open` + `onOpenChange`

### 3. **Accessibility first**
- **Web**: Proper ARIA attributes (`role`, `aria-expanded`, `aria-controls`)
- **Native**: Correct accessibility roles and states
- Screen reader friendly

### 4. **Composition via Context**
- Components communicate via React Context
- No prop drilling required
- Must be used together (trigger/content need the root)

---

## API

### Collapsible (Root)

The root component that wraps the trigger and content.

| Prop            | Type                      | Default | Description                                                    |
|-----------------|---------------------------|---------|----------------------------------------------------------------|
| `open`          | `boolean`                 | -       | Controlled open state.                                         |
| `defaultOpen`   | `boolean`                 | `false` | Default open state (uncontrolled).                             |
| `onOpenChange`  | `(open: boolean) => void` | -       | Callback when open state changes.                              |
| `disabled`      | `boolean`                 | `false` | Whether the collapsible is disabled.                           |
| `asChild`       | `boolean`                 | `false` | Render child element instead of View wrapper.                  |
| `...ViewProps`  | `ViewProps`               | -       | All other React Native `View` props (style, testID, etc.).     |

### CollapsibleTrigger

The button that toggles the collapsible state.

| Prop              | Type                    | Default | Description                                                    |
|-------------------|-------------------------|---------|----------------------------------------------------------------|
| `asChild`         | `boolean`               | `false` | Render child element instead of Pressable wrapper.             |
| `disabled`        | `boolean`               | -       | Whether the trigger is disabled (inherits from root if not set).|
| `onPress`         | `(event) => void`       | -       | Press handler (called after toggle logic).                     |
| `...PressableProps` | `PressableProps`      | -       | All other React Native `Pressable` props.                      |

**Accessibility:**
- Web: `role="button"`, `aria-expanded`, `aria-controls`, `id`
- Native: `accessibilityRole="button"`, `accessibilityState={{ expanded, disabled }}`

### CollapsibleContent

The content container that shows/hides based on state.

| Prop           | Type          | Default | Description                                                    |
|----------------|---------------|---------|----------------------------------------------------------------|
| `asChild`      | `boolean`     | `false` | Render child element instead of View wrapper.                  |
| `forceMount`   | `boolean`     | `false` | Keep content mounted even when closed (useful for animations). |
| `...ViewProps` | `ViewProps`   | -       | All other React Native `View` props (style, testID, etc.).     |

**Behavior:**
- When closed: Returns `null` (unmounts) by default
- With `forceMount`: Stays mounted but hidden with `display: none`
- When open: Visible and mounted

**Accessibility:**
- Web: `role="region"`, `id`, `aria-labelledby`

---

## Examples

### Basic usage (uncontrolled)

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@native-ui-org/primitives";
import { Text, StyleSheet } from "react-native";

function BasicExample() {
  return (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger style={styles.trigger}>
        <Text>Show more</Text>
      </CollapsibleTrigger>
      
      <CollapsibleContent style={styles.content}>
        <Text>Hidden content that appears when expanded</Text>
      </CollapsibleContent>
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 16,
    backgroundColor: "#fff",
  },
});
```

### Controlled state

```tsx
function ControlledExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <Text>{open ? "Hide" : "Show"} details</Text>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Text>Controlled content</Text>
        </CollapsibleContent>
      </Collapsible>

      <Pressable onPress={() => setOpen(!open)}>
        <Text>Toggle from outside</Text>
      </Pressable>
    </>
  );
}
```

### Using asChild for custom elements

```tsx
function CustomElementExample() {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Pressable style={styles.customButton}>
          <Icon name="chevron-down" />
          <Text>Custom trigger</Text>
        </Pressable>
      </CollapsibleTrigger>
      
      <CollapsibleContent asChild>
        <Animated.View style={animatedStyle}>
          <Text>Content with custom animation</Text>
        </Animated.View>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### FAQ/Accordion pattern

```tsx
function FAQ() {
  return (
    <>
      <Collapsible>
        <CollapsibleTrigger style={styles.question}>
          <Text>What is React Native?</Text>
        </CollapsibleTrigger>
        <CollapsibleContent style={styles.answer}>
          <Text>React Native is a framework for building native apps...</Text>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger style={styles.question}>
          <Text>How does it work?</Text>
        </CollapsibleTrigger>
        <CollapsibleContent style={styles.answer}>
          <Text>It uses native components...</Text>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
```

### With animations (using forceMount)

```tsx
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

function AnimatedExample() {
  const [open, setOpen] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(open ? 1 : 0, { duration: 200 }),
    maxHeight: withTiming(open ? 500 : 0, { duration: 200 }),
  }));

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      
      {/* forceMount keeps it mounted for animation */}
      <CollapsibleContent forceMount asChild>
        <Animated.View style={animatedStyle}>
          <Text>Animated content</Text>
        </Animated.View>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

### Disabled state

```tsx
function DisabledExample() {
  return (
    <Collapsible disabled>
      <CollapsibleTrigger style={styles.disabledTrigger}>
        <Text style={styles.disabledText}>Can't open (disabled)</Text>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Text>This won't show</Text>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

---

## Styling recommendations

Since the component is unstyled, here are some common patterns:

```tsx
const styles = StyleSheet.create({
  // Trigger button
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  
  // Content container
  content: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  
  // Trigger icon (rotates when open)
  icon: {
    transform: [{ rotate: "0deg" }], // animate this
  },
});
```

---

## Accessibility

### Web
- Trigger has `role="button"`, `aria-expanded`, and `aria-controls`
- Content has `role="region"` and `aria-labelledby`
- Proper ID association between trigger and content

### Native
- Trigger has `accessibilityRole="button"`
- State changes announced via `accessibilityState={{ expanded }}`
- Disabled state properly communicated

---

## Changelog

| Version | Changes                                                                 |
|---------|-------------------------------------------------------------------------|
| `0.1.0` | Initial release. Controlled/uncontrolled state, accessibility, asChild support. |

