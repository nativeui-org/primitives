# InputFile

Cross-platform file input component for selecting images and files. Uses `expo-image-picker` on native platforms and native file input on web.

---

## Overview

InputFile provides a consistent API for file selection across iOS, Android, and Web. It handles platform-specific implementations automatically, so you can use the same component everywhere.

| Feature      | Description                                | Platforms         |
| ------------ | ------------------------------------------ | ----------------- |
| **Image Selection** | Select images from gallery or camera | iOS, Android, Web |
| **File Selection** | Select any file type (web only) | Web |
| **Preview** | Automatic image preview after selection | iOS, Android, Web |
| **Permissions** | Automatic permission handling on native | iOS, Android |
| **Customizable** | Control media types, quality, editing | iOS, Android, Web |

---

## Setup & Usage Guide

### 1. Install and Import

Install from npm:

```bash
npm install @native-ui-org/primitives
```

**For Native Platforms (iOS/Android):**

You also need to install `expo-image-picker`:

```bash
npx expo install expo-image-picker
```

Then import from the package:

```tsx
import { InputFile } from "@native-ui-org/primitives";
```

---

### 2. Basic Usage

```tsx
import { InputFile } from "@native-ui-org/primitives";
import { useState } from "react";

function MyForm() {
  const [file, setFile] = useState<string | File | null>(null);
  
  return (
    <InputFile 
      placeholder="Select image"
      onFileSelect={(selectedFile) => {
        setFile(selectedFile);
        console.log("Selected file:", selectedFile);
      }}
    />
  );
}
```

---

### 3. Controlled Component

Use the `value` prop to control the selected file:

```tsx
import { InputFile } from "@native-ui-org/primitives";

function MyForm() {
  const [fileUri, setFileUri] = useState<string | null>(null);
  
  return (
    <InputFile 
      value={fileUri}
      onFileSelect={setFileUri}
      placeholder="Choose image"
    />
  );
}
```

---

### 4. Web-Specific Props

On web, you can control file types and multiple selection:

```tsx
<InputFile 
  accept="image/*"           // Accept only images
  multiple={false}            // Single file selection
  onFileSelect={(file) => {
    if (file instanceof File) {
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File type:", file.type);
    }
  }}
/>
```

```tsx
<InputFile 
  accept=".pdf,.doc,.docx"   // Accept specific file types
  multiple={true}             // Multiple file selection
  onFileSelect={(files) => {
    // Handle multiple files
  }}
/>
```

---

### 5. Native-Specific Props

On native platforms, you can control media types, editing, and quality:

```tsx
<InputFile 
  mediaTypes="images"         // "images" | "videos" | "all"
  allowsEditing={true}         // Allow cropping/editing
  aspect={[16, 9]}            // Aspect ratio for editing
  quality={0.8}                // Image quality (0-1)
  onFileSelect={(uri) => {
    console.log("Image URI:", uri);
  }}
/>
```

---

### 6. Using with Forms

InputFile works well with form libraries:

```tsx
import { useForm, Controller } from "react-hook-form";
import { InputFile } from "@native-ui-org/primitives";

function MyForm() {
  const { control } = useForm();
  
  return (
    <Controller
      control={control}
      name="avatar"
      render={({ field: { onChange, value } }) => (
        <InputFile
          value={value}
          onFileSelect={onChange}
          placeholder="Upload avatar"
        />
      )}
    />
  );
}
```

---

### 7. Custom Styling with asChild

Use `asChild` to customize the button appearance:

```tsx
import { InputFile, Button, Text } from "@native-ui-org/primitives";

<InputFile 
  asChild
  onFileSelect={(file) => console.log(file)}
>
  <Button style={{ backgroundColor: "#007AFF" }}>
    <Text style={{ color: "white" }}>Custom Upload Button</Text>
  </Button>
</InputFile>
```

---

## Mobile Setup (iOS/Android)

### Dependencies

InputFile requires `expo-image-picker` on native platforms. Install it:

```bash
npx expo install expo-image-picker
```

### iOS Configuration

Add the following to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "This app needs access to your photo library to let you select and upload images.",
          "cameraPermission": "This app needs access to your camera to take photos."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to let you select and upload images.",
        "NSPhotoLibraryAddUsageDescription": "This app needs access to save photos to your photo library."
      }
    }
  }
}
```

After adding the configuration, rebuild your app:

```bash
npx expo prebuild --clean
```

### Android Configuration

Android permissions are handled automatically by `expo-image-picker`. No additional configuration is needed.

### Permissions

InputFile automatically requests media library permissions when needed. The component handles permission states internally, but you can check the permission status:

```tsx
import * as ImagePicker from "expo-image-picker";

// Check permission status
const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
if (status !== "granted") {
  // Permission not granted
}
```

---

## API Reference

### InputFile

The file input component for all platforms.

| Prop            | Type                      | Default | Description                                    |
| --------------- | ------------------------- | ------- | ---------------------------------------------- |
| `onFileSelect`  | `(file: string \| File \| null) => void` | — | Callback when file is selected. On native, receives URI string. On web, receives File object. |
| `value`         | `string \| null`           | —       | Controlled value (file URI)                    |
| `placeholder`   | string                    | `"Select file"` | Placeholder text for the button                |
| `asChild`       | boolean                   | `false` | Render child element without InputFile wrapper |
| `accept`        | string                    | `"image/*"` | Accepted file types (web only)                 |
| `multiple`      | boolean                   | `false` | Allow multiple file selection (web only)      |
| `mediaTypes`    | `"images" \| "videos" \| "all"` | `"images"` | Media types for picker (native only)          |
| `allowsEditing` | boolean                   | `true`  | Allow editing after selection (native only)   |
| `aspect`        | `[number, number]`         | `[4, 3]` | Aspect ratio for editing (native only)        |
| `quality`      | number                    | `1`     | Image quality 0-1 (native only)                |
| `...props`      | `ViewProps`               | —       | All React Native View props                    |

---

## Platform Behavior

| Platform              | Implementation                              | Characteristics                   |
| --------------------- | ------------------------------------------- | --------------------------------- |
| **iOS / Android**     | Uses `expo-image-picker`                    | Native image picker, permission handling |
| **Web**               | Uses native `<input type="file">`           | Browser file picker, File API    |
| **All Platforms**     | Consistent API                              | Same props, platform-specific behavior |

---

## File Types

### On Web

The `accept` prop controls which file types can be selected:

```tsx
// Images only
<InputFile accept="image/*" />

// Specific image formats
<InputFile accept="image/png,image/jpeg" />

// Documents
<InputFile accept=".pdf,.doc,.docx" />

// All files
<InputFile accept="*/*" />
```

### On Native

The `mediaTypes` prop controls which media types are available:

```tsx
// Images only (default)
<InputFile mediaTypes="images" />

// Videos only
<InputFile mediaTypes="videos" />

// Both images and videos
<InputFile mediaTypes="all" />
```

---

## Examples

### Basic Image Upload

```tsx
import { InputFile } from "@native-ui-org/primitives";
import { useState } from "react";

function AvatarUpload() {
  const [avatar, setAvatar] = useState<string | File | null>(null);
  
  return (
    <InputFile
      placeholder="Upload avatar"
      onFileSelect={setAvatar}
      mediaTypes="images"
      allowsEditing={true}
      aspect={[1, 1]}  // Square
      quality={0.8}
    />
  );
}
```

### Multiple File Selection (Web)

```tsx
import { InputFile } from "@native-ui-org/primitives";

function DocumentUpload() {
  const handleFiles = (files: File | string | null) => {
    if (files instanceof File) {
      console.log("Selected file:", files.name);
    }
  };
  
  return (
    <InputFile
      accept=".pdf,.doc,.docx"
      multiple={true}
      onFileSelect={handleFiles}
      placeholder="Select documents"
    />
  );
}
```

### Custom Button

```tsx
import { InputFile, Button, Text } from "@native-ui-org/primitives";

function CustomUpload() {
  return (
    <InputFile asChild onFileSelect={(file) => console.log(file)}>
      <Button style={{ 
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
      }}>
        <Text style={{ color: "white", fontWeight: "600" }}>
          Choose File
        </Text>
      </Button>
    </InputFile>
  );
}
```

---

## Accessibility

**Web:**

* Proper button semantics
* Keyboard accessible
* Screen reader friendly

**Mobile:**

* Standard React Native accessibility props
* Works with VoiceOver and TalkBack

---

## Troubleshooting

### Image not showing on web

Make sure you're handling the File object correctly. On web, `onFileSelect` receives a `File` object, not a URI string.

### Permission denied on iOS

Make sure you've added the required permissions to your `app.json` and rebuilt the app with `npx expo prebuild --clean`.

### expo-image-picker not installed warning

Install `expo-image-picker`:

```bash
npx expo install expo-image-picker
```

Then rebuild your app.

---

## Version History

| Version | Notes                                                                           |
| ------- | ------------------------------------------------------------------------------- |
| `0.9.0` | Initial release — cross-platform file input with expo-image-picker integration. |

---

**Summary:**
InputFile provides a simple, consistent API for file selection across all platforms.
On native, it uses expo-image-picker for a native experience. On web, it uses the browser's file picker.

