# NativeUI Sandbox

Interactive demo and testing environment for NativeUI Primitives components.

## 🚀 Quick Start

### Development

```bash
# From monorepo root
pnpm dev:sandbox

# Or from this directory
pnpm dev
```

### Web Preview

```bash
pnpm web
```

### Mobile

```bash
# iOS
pnpm ios

# Android
pnpm android
```

## 📦 Deployment

### Vercel (Web)

The sandbox can be deployed to Vercel for web previews.

**Manual deployment:**

```bash
# From monorepo root
pnpm build:sandbox

# Deploy the dist/ folder
cd apps/sandbox
vercel --prod
```

### Expo (Mobile)

For mobile deployment, use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🎯 Purpose

The sandbox serves multiple purposes:

1. **Interactive demos** - Test primitives in real-time
2. **Development** - Quick feedback when building primitives
3. **Documentation previews** - Embedded in website docs via `<Preview />` component
4. **Testing** - Visual regression testing
5. **Showcase** - Demonstrate component capabilities

## 📁 Structure

```
apps/sandbox/
├── app/              # Expo Router pages
│   ├── index.tsx     # Home page listing all primitives
│   └── preview/      # Individual component previews
│       ├── alert.tsx
│       ├── accordion.tsx
│       ├── checkbox.tsx
│       └── ...
├── android/          # Android native code
├── ios/              # iOS native code
├── assets/           # Images and icons
└── vercel.json       # Vercel deployment config
```

## 🌐 URLs

**Production:**
- Sandbox: https://sandbox-primitives.nativeui.com
- Website: https://primitives.nativeui.com (embeds sandbox previews)

**Preview URLs in Documentation:**

The website documentation embeds sandbox previews using:
```tsx
<Preview component="alert" />
```

Which renders an iframe to:
```
https://sandbox-primitives.nativeui.com/preview/alert
```

## 🔧 Adding New Previews

1. Create `app/preview/{component}.tsx`
2. Export a default component showing the primitive
3. The preview will be automatically available at `/preview/{component}`
4. Use in docs: `<Preview component="{component}" />`

Example:

```tsx
// app/preview/button.tsx
import { View, Text } from "@native-ui-org/primitives";

export default function ButtonPreview() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Button demo here</Text>
    </View>
  );
}
```

## 📱 Testing

Test on different platforms:

```bash
# Web browser
pnpm web

# iOS Simulator
pnpm ios

# Android Emulator
pnpm android
```

## 🐛 Troubleshooting

**Build fails on Vercel:**
- Check that primitives package builds successfully
- Verify no native-only dependencies are imported on web
- Check Vercel build logs for specific errors

**Web version looks different:**
- Expo web uses react-native-web
- Some native components may need web-specific handling
- Check console for warnings

**Preview iframes not loading:**
- Verify sandbox is deployed and accessible
- Check CORS settings if needed
- Ensure preview route exists in `app/preview/`

