# Aspect Ratio

Maintain **consistent width-to-height ratios** for responsive images, videos, and containers across all screen sizes.

---

## Overview

Aspect Ratio ensures elements maintain their proportions regardless of container size, perfect for media content.

| Feature          | Description                          | Platforms         |
| ---------------- | ------------------------------------ | ----------------- |
| **AspectRatio**  | Container with fixed aspect ratio    | iOS, Android, Web |

---

## Setup & Usage Guide

AspectRatio provides a simple wrapper that maintains proportions automatically.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { AspectRatio } from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

Create a 16:9 container:

```tsx
<AspectRatio ratio={16 / 9}>
  <Image source={{ uri: 'photo.jpg' }} style={{ width: '100%', height: '100%' }} />
</AspectRatio>
```

---

### 3. Common Ratios

```tsx
// 16:9 (widescreen video)
<AspectRatio ratio={16 / 9}>
  <Video source={videoUrl} />
</AspectRatio>

// 1:1 (square, perfect for avatars)
<AspectRatio ratio={1}>
  <Image source={avatar} />
</AspectRatio>

// 4:3 (standard photo)
<AspectRatio ratio={4 / 3}>
  <Image source={photo} />
</AspectRatio>

// 21:9 (ultra-wide)
<AspectRatio ratio={21 / 9}>
  <View style={styles.banner} />
</AspectRatio>
```

---

### 4. Responsive Images

```tsx
<View style={{ width: '100%', maxWidth: 600 }}>
  <AspectRatio ratio={16 / 9}>
    <Image
      source={{ uri: 'https://example.com/image.jpg' }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  </AspectRatio>
</View>
```

---

## API Reference

### AspectRatio

Container that maintains aspect ratio.

| Prop       | Type     | Default | Description                                 |
| ---------- | -------- | ------- | ------------------------------------------- |
| `ratio`    | number   | —       | **Required.** Width / height (e.g., 16/9)  |
| `style`    | object   | —       | Additional styles                           |
| `asChild`  | boolean  | `false` | Use Slot pattern                            |
| `...props` | any      | —       | Standard View props                         |

---

## Platform Behavior

| Platform              | Implementation                   | Characteristics                   |
| --------------------- | -------------------------------- | --------------------------------- |
| **iOS / Android**     | Calculated height based on width | Native layout performance         |
| **Web**               | CSS aspect-ratio or padding trick | Responsive and fluid              |
| **All Platforms**     | Consistent API                   | Same props, same behavior         |

---

## Accessibility

AspectRatio is a layout utility and transparent to accessibility. All accessibility props are passed through to children.

---

## Version History

| Version | Notes                                                    |
| ------- | -------------------------------------------------------- |
| `0.1.0` | Initial release — aspect ratio container for all platforms. |

---

**Summary:**
AspectRatio maintains consistent proportions for media and containers.
Use it for images, videos, cards, or any content that needs fixed aspect ratios.
Works automatically across all screen sizes and platforms.
