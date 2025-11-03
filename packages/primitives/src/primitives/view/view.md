# View

A cross-platform primitive based on React Native’s `View`.  

This component exists to provide a **unified API across iOS, Android, and Web**, with minimal overhead.  

- On **mobile**, it behaves exactly like `react-native`’s `View`.  
- On **web**, it forwards additional props (`role`, `tabIndex`, `dir`, `aria-*`) supported by React Native Web.  
- It also adds an optional `asChild` prop for **polymorphism**, letting you replace the host element without introducing an extra wrapper (similar to Radix UI’s `Slot`).  

---

## When should you use it?

✅ Use `View` if:  
- You are building a **cross-platform design system** (web + mobile).  
- You want a **consistent foundation** for higher-level components (`Card`, `Dialog`, etc.).  
- You need **polymorphism** (`asChild`) to avoid wrappers, e.g. rendering semantic `<section>` or animated `<motion.div>` on web.  

⚠️ If your project is **purely mobile (iOS/Android)**:  
- You can safely use `react-native`’s `View` directly.  
- This primitive is most valuable in cross-platform setups.  

---

## API

| Prop       | Type                   | Platform | Description                                                                 |
|------------|------------------------|----------|-----------------------------------------------------------------------------|
| `asChild` | `boolean`             | all      | Render the child element directly instead of wrapping it in a `View`.       |
| `style`   | `StyleProp<ViewStyle>` | all      | Standard RN `style` prop.                                                   |
| `role`    | `string`              | web      | Landmark or widget role (e.g. `"region"`, `"button"`, `"heading"`).     |
| `tabIndex`| `0 \| -1`              | web      | Controls tab navigation order.                                              |
| `dir`     | `"ltr" \| "rtl" \| "auto"` | web      | Text direction hint for the DOM element.                                    |
| `aria-*`  | `string \| boolean`    | web      | Any ARIA attribute supported by React Native Web.                           |
| `...props`| `RNViewProps`         | all      | All other React Native `View` props (e.g. `onLayout`, `testID`, accessibility). |

---

## Examples

**Basic usage**
```tsx
import { View, Text } from "@native-ui-org/primitives";

<View style={{ padding: 16, backgroundColor: "papayawhip" }}>
  <Text>Hello world</Text>
</View>
```

**Using asChild for semantic DOM element**
```tsx
<View asChild role="region" aria-label="Hero section">
  <section>content</section>
</View>
```

**With Framer Motion (web)**
```tsx
import { motion } from "framer-motion";

<View asChild>
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    Fade in
  </motion.div>
</View>
```

---

## Changelog

| Version | Changes                                                                 |
|---------|-------------------------------------------------------------------------|
| `0.1.0` | Initial release. Based on `react-native`’s `View`, with `asChild` support and cross-platform accessibility props. |
