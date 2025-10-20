# Alert Primitive

A cross-platform alert system that provides **native alerts on mobile** and a **custom AlertDialog on web**.

This primitive offers a unified API for showing alerts while respecting platform conventions.

---

## What is Alert?

The Alert primitive consists of two parts:

1. **`showAlert()`** - A promise-based function to show alerts
   - Mobile: Uses React Native's `Alert.alert()`
   - Web: Shows a custom `AlertDialog` component

2. **`AlertDialog`** - Web-only compound component for custom alerts
   - Fully accessible (ARIA roles, focus management)
   - Unstyled by design
   - Portal-based rendering

---

## When should you use it?

✅ Use `showAlert()` if:
- You need **simple confirmations** or **notifications**
- You want **native behavior** on iOS/Android
- You need a **promise-based API** (async/await)
- You want **cross-platform consistency** with minimal code

✅ Use `AlertDialog` directly if:
- You need **full control** over the alert UI on web
- You want **custom styling** and layout
- You're building **web-only** features

⚠️ Consider alternatives if:
- You need complex dialogs with forms (use a full Dialog component)
- You need non-blocking notifications (use Toast/Snackbar)

---

## API

### showAlert()

Promise-based function to show an alert.

```tsx
function showAlert<Value = string>(
  options: ShowAlertOptions<Value>
): Promise<Value | undefined>
```

**Options:**

| Property     | Type                  | Default | Description                                               |
|--------------|-----------------------|---------|-----------------------------------------------------------|
| `title`      | `string`              | -       | Alert title                                               |
| `message`    | `string`              | -       | Alert message/description                                 |
| `buttons`    | `AlertButton[]`       | `[{text:"OK"}]` | Alert buttons                                     |
| `cancelable` | `boolean`             | `true`  | Whether alert can be dismissed (Escape, overlay click)    |

**AlertButton:**

| Property    | Type                                  | Description                              |
|-------------|---------------------------------------|------------------------------------------|
| `text`      | `string`                              | Button label                             |
| `value`     | `Value`                               | Value returned when button is pressed    |
| `style`     | `"default" \| "cancel" \| "destructive"` | Button style hint                    |
| `autoFocus` | `boolean`                             | Auto-focus this button (web only)        |

**Returns:** `Promise<Value | undefined>`

---

### AlertDialog Components (Web)

For custom alert dialogs on web. All components support `asChild` via Slot.

#### AlertDialog (Root)
Container that provides context to child components.

| Prop          | Type                      | Description                    |
|---------------|---------------------------|--------------------------------|
| `open`        | `boolean`                 | Whether dialog is open         |
| `onOpenChange`| `(open: boolean) => void` | Callback when state changes    |
| `asChild`     | `boolean`                 | Use Slot pattern               |

#### AlertDialogOverlay
Backdrop/overlay behind the dialog.

| Prop       | Type      | Description        |
|------------|-----------|--------------------|
| `onPress`  | `function`| Custom press handler|
| `asChild`  | `boolean` | Use Slot pattern   |

#### AlertDialogContent
Main dialog content container.

| Prop         | Type      | Description                |
|--------------|-----------|----------------------------|
| `forceMount` | `boolean` | Keep mounted when closed   |
| `asChild`    | `boolean` | Use Slot pattern           |

**Accessibility:** `role="alertdialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`

#### AlertDialogTitle
Dialog title (required for accessibility).

| Prop      | Type      | Description      |
|-----------|-----------|------------------|
| `asChild` | `boolean` | Use Slot pattern |

#### AlertDialogDescription
Dialog description/message.

| Prop      | Type      | Description      |
|-----------|-----------|------------------|
| `asChild` | `boolean` | Use Slot pattern |

#### AlertDialogAction
Action button (confirms the alert).

| Prop      | Type       | Description                    |
|-----------|------------|--------------------------------|
| `onPress` | `function` | Called before closing dialog   |
| `asChild` | `boolean`  | Use Slot pattern               |

#### AlertDialogCancel
Cancel button (dismisses the alert).

| Prop      | Type       | Description                    |
|-----------|------------|--------------------------------|
| `onPress` | `function` | Called before closing dialog   |
| `asChild` | `boolean`  | Use Slot pattern               |

---

## Examples

### Basic usage with showAlert()

```tsx
import { showAlert } from "@native-ui-org/primitives";

async function handleDelete() {
  const result = await showAlert({
    title: "Delete file?",
    message: "This action cannot be undone.",
    buttons: [
      { text: "Cancel", value: "cancel", style: "cancel" },
      { text: "Delete", value: "delete", style: "destructive" },
    ],
  });

  if (result === "delete") {
    // Perform deletion
    console.log("File deleted");
  }
}
```

### Simple notification

```tsx
async function showInfo() {
  await showAlert({
    title: "Success!",
    message: "Your changes have been saved.",
  });
  // Continues after user dismisses
}
```

### Multiple options

```tsx
const choice = await showAlert({
  title: "Save changes?",
  message: "You have unsaved changes.",
  buttons: [
    { text: "Don't Save", value: "discard", style: "destructive" },
    { text: "Cancel", value: "cancel", style: "cancel" },
    { text: "Save", value: "save", style: "default", autoFocus: true },
  ],
});

if (choice === "save") {
  // Save changes
} else if (choice === "discard") {
  // Discard changes
}
```

### Custom AlertDialog (Web only)

```tsx
import { AlertDialog, AlertDialogContent, ... } from "@native-ui-org/primitives";

function CustomAlert() {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogOverlay style={styles.overlay}>
        <AlertDialogContent style={styles.content}>
          <AlertDialogTitle style={styles.title}>
            <Text>Custom Alert</Text>
          </AlertDialogTitle>
          
          <AlertDialogDescription style={styles.description}>
            <Text>This is a custom styled alert dialog.</Text>
          </AlertDialogDescription>

          <View style={styles.actions}>
            <AlertDialogCancel style={styles.cancelButton}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            
            <AlertDialogAction style={styles.actionButton}>
              <Text>Confirm</Text>
            </AlertDialogAction>
          </View>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
```

### Web AlertDialogProvider Setup

For `showAlert()` to work on web, wrap your app with `AlertDialogProvider`:

```tsx
// App.tsx (web only, or use Platform check)
import { AlertDialogProvider } from "@native-ui-org/primitives";

export default function App() {
  return (
    <AlertDialogProvider>
      <YourApp />
    </AlertDialogProvider>
  );
}
```

On mobile, the provider does nothing (renders children only).

---

## Platform Differences

### Mobile (iOS/Android)
- Uses native `Alert.alert()`
- Native look and feel
- Blocks JavaScript execution until dismissed
- System-provided animations and styling

### Web
- Custom `AlertDialog` component
- Non-blocking (promise-based)
- Accessible modal with focus trap
- Customizable styling
- Keyboard support (Escape to cancel)

---

## Accessibility

### Web
- `role="alertdialog"` on content
- `aria-modal="true"` prevents interaction with background
- `aria-labelledby` points to title
- `aria-describedby` points to description
- Focus trap keeps keyboard navigation inside dialog
- Focus restoration when closed
- Escape key closes if `cancelable`

### Mobile
- Native accessibility handled by system
- VoiceOver/TalkBack announce alerts automatically

---

## Changelog

| Version | Changes                                                                 |
|---------|-------------------------------------------------------------------------|
| `0.1.0` | Initial release. `showAlert()` function and `AlertDialog` components. |

