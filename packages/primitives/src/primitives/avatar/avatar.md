# Avatar Primitive

A component for displaying user profile images with fallback text support.

---

## What is Avatar?

Avatar displays user profile images with intelligent fallbacks. When an image fails to load or isn't provided, it shows fallback text (usually initials). It supports multiple sizes, shapes, and integrates seamlessly with the `asChild` pattern.

**Platform behavior:**
- **Web & Native**: Consistent rendering with proper image handling
- **Fallback**: Graceful degradation to text when image unavailable
- **Responsive**: Multiple size options from extra-small to extra-large

---

## When should you use it?

✅ Use Avatar if:
- You need **user profile pictures** in your app
- You're building **comment systems** or **chat interfaces**
- You want **team member displays** or **user lists**
- You need **consistent user representation** across your app
- You're creating **navigation headers** with user info

⚠️ Consider alternatives if:
- You need complex image galleries (use `Image` directly)
- You're building media-heavy interfaces (use `AspectRatio`)

---

## API

### Avatar

| Prop       | Type                              | Default | Description                                    |
|------------|-----------------------------------|---------|------------------------------------------------|
| `src`      | `string`                          | -       | Image source URL                               |
| `fallback` | `string`                          | -       | Fallback text (usually initials)               |
| `size`     | `number \| "xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Avatar size                                    |
| `shape`    | `"circle" \| "square"`           | `"circle"` | Avatar shape                               |
| `asChild`  | `boolean`                         | `false` | Use Slot pattern                              |

**Size mapping:**
- `xs`: 24px
- `sm`: 32px  
- `md`: 40px (default)
- `lg`: 48px
- `xl`: 64px

---

## Examples

### Basic usage

```tsx
import { Avatar } from "@native-ui-org/primitives";

// With image
<Avatar 
  src="https://example.com/user.jpg" 
  fallback="JD" 
/>

// Fallback only
<Avatar fallback="AB" />
```

### Different sizes

```tsx
<Avatar src="..." size="xs" fallback="XS" />
<Avatar src="..." size="sm" fallback="SM" />
<Avatar src="..." size="md" fallback="MD" />
<Avatar src="..." size="lg" fallback="LG" />
<Avatar src="..." size="xl" fallback="XL" />

// Custom size
<Avatar src="..." size={80} fallback="80" />
```

### Different shapes

```tsx
<Avatar src="..." shape="circle" fallback="C" />
<Avatar src="..." shape="square" fallback="S" />
```

### In a user list

```tsx
<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
  <Avatar src={user.avatar} fallback={user.initials} size="sm" />
  <View>
    <Text>{user.name}</Text>
    <Text style={{ color: "#666" }}>{user.email}</Text>
  </View>
</View>
```

### In a comment

```tsx
<View style={{ flexDirection: "row", gap: 12 }}>
  <Avatar src={comment.author.avatar} fallback={comment.author.initials} />
  <View style={{ flex: 1 }}>
    <Text style={{ fontWeight: "600" }}>{comment.author.name}</Text>
    <Text>{comment.content}</Text>
  </View>
</View>
```

### With asChild

```tsx
<Avatar asChild size="lg">
  <Pressable onPress={() => openProfile()}>
    <Image source={{ uri: user.avatar }} />
  </Pressable>
</Avatar>
```

### Team display

```tsx
<View style={{ flexDirection: "row", gap: -8 }}>
  {team.map((member, index) => (
    <Avatar 
      key={member.id}
      src={member.avatar} 
      fallback={member.initials}
      size="sm"
      style={{ 
        marginLeft: index > 0 ? -8 : 0,
        borderWidth: 2,
        borderColor: "#fff"
      }}
    />
  ))}
</View>
```

---

## Platform Differences

### Web
- Uses standard `Image` component with proper error handling
- Fallback text renders with web-optimized fonts
- Supports all CSS properties for styling

### Native (iOS/Android)
- Uses React Native `Image` component
- Fallback text uses system fonts
- Optimized for touch interactions

---

## Implementation Details

### Size Calculation
```tsx
const sizeMap = {
  xs: 24,  // Extra small
  sm: 32,  // Small
  md: 40,  // Medium (default)
  lg: 48,  // Large
  xl: 64,  // Extra large
};
```

### Fallback Text Sizing
```tsx
const textStyle = {
  fontSize: Math.max(sizeValue * 0.4, 12), // Responsive font size
  fontWeight: "600",
  color: "#666",
};
```

### Shape Handling
```tsx
const borderRadius = shape === "circle" 
  ? sizeValue / 2  // Perfect circle
  : 8;             // Rounded square
```

---

## Best Practices

### Fallback Text
- Use **initials** (e.g., "JD" for John Doe)
- Keep it **short** (1-2 characters max)
- Use **uppercase** for better readability
- Consider **user's preferred name** or **first letter**

### Image Sources
- Use **HTTPS** URLs for security
- Provide **fallback** for every avatar
- Consider **image optimization** for performance
- Handle **loading states** gracefully

### Accessibility
- Always provide **meaningful fallback text**
- Use **alt text** equivalent in fallback
- Ensure **sufficient contrast** for text
- Consider **reduced motion** preferences

---

## Changelog

| Version | Changes                                    |
|---------|--------------------------------------------|
| `0.1.0` | Initial release. Basic avatar functionality with image and fallback support. |
