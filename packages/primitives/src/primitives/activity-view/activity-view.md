# ActivityView (Share)

Share content using **native share sheets on mobile** and **Web Share API on web** with a single, unified API.

---

## Overview

ActivityView provides a cross-platform sharing solution that uses the native share sheet on iOS/Android and the Web Share API on web browsers.

| Feature      | Description                                    | Platforms         |
| ------------ | ---------------------------------------------- | ----------------- |
| **`share()`** | Promise-based helper for sharing content       | iOS, Android, Web |
| **`ActivityView`** | Component wrapper that adds share to any button | iOS, Android, Web |

---

## Setup & Usage Guide

ActivityView works out of the box with no configuration needed. The same code works on all platforms.

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

Then import from the package:

```tsx
import { share, ActivityView } from "@native-ui-org/primitives";
```

---

### 2. Using `share()` Function

Share content with a simple message:

```tsx
import { share } from "@native-ui-org/primitives";

const handleShare = async () => {
  try {
    const result = await share({
      message: "Check out this amazing app!",
    });
    
    if (result.action === "sharedAction") {
      console.log("Content shared successfully");
    }
  } catch (error) {
    console.error("Share failed:", error);
  }
};
```

---

### 3. Share with Title and URL

Include a title and URL for richer sharing:

```tsx
await share({
  title: "Amazing App",
  message: "Check out this amazing app!",
  url: "https://example.com",
});
```

---

### 4. Using ActivityView Component

Wrap a button with `ActivityView` to add sharing functionality:

```tsx
import { ActivityView, Button, Text } from "@native-ui-org/primitives";

function ShareButton() {
  return (
    <ActivityView
      shareOptions={{
        title: "My App",
        message: "Check this out!",
        url: "https://example.com",
      }}
      onShareComplete={(result) => {
        if (result.action === "sharedAction") {
          console.log("Shared successfully!");
        }
      }}
    >
      <Button style={{ padding: 12, backgroundColor: "#007AFF" }}>
        <Text style={{ color: "#fff" }}>Share</Text>
      </Button>
    </ActivityView>
  );
}
```

---

## API Reference

### `share(options: ShareOptions): Promise<ShareResult>`

Share content using the native share sheet or Web Share API.

#### Parameters

| Prop      | Type     | Required | Description                    |
| --------- | -------- | -------- | ------------------------------ |
| `message` | `string` | No       | The message to share           |
| `title`   | `string` | No       | The title of the message       |
| `url`     | `string` | No       | URL to share                    |

**Note:** At least one of `message`, `title`, or `url` must be provided.

#### Returns

`Promise<ShareResult>` - A promise that resolves with the share result:

```tsx
type ShareResult = {
  action: "sharedAction" | "dismissedAction";
  activityType?: string; // iOS only
};
```

---

### `ActivityView`

A wrapper component that adds sharing functionality to any child component.

| Prop              | Type                      | Required | Description                    |
| ----------------- | ------------------------- | -------- | ------------------------------ |
| `shareOptions`    | `ShareOptions`            | Yes      | Content to share               |
| `children`        | `React.ReactNode`         | Yes      | Component to wrap (e.g., button) |
| `onShareComplete`| `(result: ShareResult) => void` | No | Callback when share completes |

---

## Platform Behavior

### Mobile (iOS/Android)

- Shows the native share sheet with installed apps
- Returns `activityType` on iOS indicating which app was selected
- URLs are automatically recognized as clickable links
- Deep links open the app directly when tapped

### Web

- Uses the Web Share API (`navigator.share()`)
- Shows the browser's native share dialog
- On macOS, the share sheet appears in the center (system behavior)
- On iOS Safari, the share sheet appears at the bottom
- Deep links work as regular URLs and navigate to the page

---

## Examples

### Share Text Only

```tsx
await share({
  message: "Hello from my app!",
});
```

### Share URL

```tsx
await share({
  title: "Visit my website",
  url: "https://example.com",
});
```

### Share Deep Link

```tsx
import { Platform } from "react-native";

const deepLinkUrl = Platform.select({
  web: typeof window !== "undefined" ? window.location.href : "",
  ios: "myapp://screen/details",
  android: "myapp://screen/details",
});

await share({
  title: "Check out this screen!",
  message: "Tap to open:",
  url: deepLinkUrl,
});
```

### Complete Example

```tsx
import { share, ActivityView, Button, Text, View } from "@native-ui-org/primitives";

export default function ShareExample() {
  const handleShare = async () => {
    try {
      const result = await share({
        title: "My App",
        message: "Check this out!",
        url: "https://example.com",
      });
      
      if (result.action === "sharedAction") {
        console.log("Shared!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <View>
      <Button onPress={handleShare}>
        <Text>Share</Text>
      </Button>

      <ActivityView
        shareOptions={{
          title: "My App",
          message: "Check this out!",
        }}
        onShareComplete={(result) => {
          console.log(result.action);
        }}
      >
        <Button>
          <Text>Share with ActivityView</Text>
        </Button>
      </ActivityView>
    </View>
  );
}
```
