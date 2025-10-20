# Text Primitive

A cross-platform primitive based on React Native's `Text`.

This component exists to provide a **unified API across iOS, Android, and Web**, with minimal overhead and semantic HTML support.

- On **mobile**, it behaves exactly like `react-native`'s `Text`.
- On **web**, it forwards additional props (`role`, `tabIndex`, `dir`, `aria-*`) supported by React Native Web.
- It adds an optional `as` prop to render semantic HTML elements on web (e.g. `h1`, `p`, `span`).
- It also adds an optional `asChild` prop for **polymorphism**, letting you replace the host element without introducing an extra wrapper (similar to Radix UI's `Slot`).

---

## When should you use it?

✅ Use `Text` if:  
- You are building a **cross-platform design system** (web + mobile).  
- You want **semantic HTML elements** on web without using `asChild`.
- You want a **consistent foundation** for higher-level components (`Heading`, `Paragraph`, etc.).  
- You need **polymorphism** (`asChild`) to avoid wrappers, e.g. rendering custom elements or animated components.

⚠️ If your project is **purely mobile (iOS/Android)**:  
- You can safely use `react-native`'s `Text` directly.  
- This primitive is most valuable in cross-platform setups.  

---

## API

| Prop       | Type                   | Platform | Description                                                                 |
|------------|------------------------|----------|-----------------------------------------------------------------------------|
| `asChild` | `boolean`             | all      | Render the child element directly instead of wrapping it in a `Text`.       |
| `as`      | `string`              | web      | Render as a specific HTML element (e.g. `"h1"`, `"p"`, `"span"`, `"strong"`). On native, this prop is ignored. |
| `style`   | `StyleProp<TextStyle>` | all      | Standard RN `style` prop.                                                   |
| `role`    | `string`              | web      | Landmark or widget role (e.g. `"heading"`, `"text"`).                       |
| `tabIndex`| `0 \| -1`              | web      | Controls tab navigation order.                                              |
| `dir`     | `"ltr" \| "rtl" \| "auto"` | web      | Text direction hint for the DOM element.                                    |
| `aria-*`  | `string \| boolean`    | web      | Any ARIA attribute supported by React Native Web.                           |
| `...props`| `RNTextProps`         | all      | All other React Native `Text` props (e.g. `onPress`, `testID`, accessibility). |

---

## Examples

**Basic usage**
```tsx
import { Text } from "@native-ui-org/primitives";

<Text style={{ fontSize: 16, color: "black" }}>
  Hello world
</Text>
```

**Semantic HTML elements on web**
```tsx
// Renders <h1> on web, <Text> on native
<Text as="h1" style={{ fontSize: 24, fontWeight: "bold" }}>
  Main Title
</Text>

// Renders <p> on web, <Text> on native
<Text as="p" style={{ fontSize: 16, lineHeight: 24 }}>
  This is a paragraph with proper semantic meaning on web.
</Text>

// Renders <span> on web, <Text> on native
<Text as="span" style={{ color: "blue" }}>
  Inline text
</Text>
```

**Using asChild for custom elements**
```tsx
<Text asChild role="heading" aria-level="2">
  <h2>Custom Heading</h2>
</Text>
```

**With Framer Motion (web)**
```tsx
import { motion } from "framer-motion";

<Text asChild>
  <motion.span 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    Animated text
  </motion.span>
</Text>
```

**Accessibility on web**
```tsx
<Text 
  as="h1" 
  role="heading" 
  aria-level="1"
  style={{ fontSize: 32, fontWeight: "bold" }}
>
  Accessible Main Title
</Text>
```

---

## Changelog

| Version | Changes                                                                 |
|---------|-------------------------------------------------------------------------|
| `0.1.0` | Initial release. Based on `react-native`'s `Text`, with `as` and `asChild` support and cross-platform accessibility props. |
