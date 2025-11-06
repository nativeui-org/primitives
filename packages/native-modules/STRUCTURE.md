# Structure du package native-modules

Ce package est organisé pour faciliter l'ajout de nouveaux modules natifs. Chaque module a sa propre structure complète.

## Structure générale

```
native-modules/
├── ios/                                    # Code natif iOS
│   ├── context-menu/                      # Module context-menu (iOS)
│   │   ├── NativeUiOrgContextMenuModule.swift
│   │   └── NativeUiOrgContextMenuView.swift
│   ├── activity-view/                     # Module activity-view (iOS) - à venir
│   │   ├── NativeUiOrgActivityViewModule.swift
│   │   └── NativeUiOrgActivityViewView.swift
│   └── NativeUiOrgNativeModules.podspec   # Podspec pour tous les modules iOS
│
├── android/                                # Code natif Android
│   └── src/main/java/expo/modules/nativeuiorgnativemodules/
│       ├── contextmenu/                   # Module context-menu (Android)
│       │   ├── NativeUiOrgContextMenuModule.kt
│       │   └── NativeUiOrgContextMenuView.kt
│       └── activityview/                  # Module activity-view (Android) - à venir
│           ├── NativeUiOrgActivityViewModule.kt
│           └── NativeUiOrgActivityViewView.kt
│
└── src/                                    # Code TypeScript/React
    ├── context-menu/                       # Module context-menu (TS/React)
    │   ├── components/                     # Composants React (optionnel)
    │   │   ├── ContextMenu.tsx            # Version native
    │   │   └── ContextMenu.web.tsx        # Version web
    │   ├── native/                         # Bindings vers le code natif
    │   │   ├── NativeUiOrgContextMenuModule.ts
    │   │   └── NativeUiOrgContextMenuView.tsx
    │   ├── types/                          # Types TypeScript
    │   │   └── NativeUiOrgContextMenu.types.ts
    │   └── index.ts                        # Exports du module
    │
    ├── activity-view/                      # Module activity-view (TS/React) - à venir
    │   ├── components/
    │   ├── native/
    │   ├── types/
    │   └── index.ts
    │
    └── index.ts                            # Exports de tous les modules
```

## Ajouter un nouveau module

Pour ajouter un nouveau module natif (ex: `activity-view`) :

### 1. Créer le code iOS

```bash
mkdir -p ios/activity-view
```

Créer :
- `ios/activity-view/NativeUiOrgActivityViewModule.swift`
- `ios/activity-view/NativeUiOrgActivityViewView.swift`

### 2. Créer le code Android

```bash
mkdir -p android/src/main/java/expo/modules/nativeuiorgnativemodules/activityview
```

Créer :
- `android/.../activityview/NativeUiOrgActivityViewModule.kt`
- `android/.../activityview/NativeUiOrgActivityViewView.kt`

### 3. Créer le code TypeScript/React

```bash
mkdir -p src/activity-view/{components,native,types}
```

Créer :
- `src/activity-view/components/ActivityView.tsx`
- `src/activity-view/components/ActivityView.web.tsx`
- `src/activity-view/native/NativeUiOrgActivityViewView.tsx`
- `src/activity-view/native/NativeUiOrgActivityViewModule.ts`
- `src/activity-view/types/NativeUiOrgActivityView.types.ts`
- `src/activity-view/index.ts`

### 4. Mettre à jour la configuration

**`expo-module.config.json`** :
```json
{
  "platforms": ["apple", "android", "web"],
  "apple": {
    "modules": [
      "NativeUiOrgContextMenuModule",
      "NativeUiOrgActivityViewModule"
    ]
  },
  "android": {
    "modules": [
      "expo.modules.nativeuiorgnativemodules.NativeUiOrgContextMenuModule",
      "expo.modules.nativeuiorgnativemodules.NativeUiOrgActivityViewModule"
    ]
  }
}
```

**`src/index.ts`** :
```typescript
export * from './context-menu';
export * from './activity-view';
```

### 5. Rebuild

```bash
pnpm build
cd ../../apps/sandbox/ios
pod install
```

## Avantages de cette structure

✅ **Séparation claire** : Chaque module est isolé dans son propre dossier  
✅ **Facilité d'ajout** : Ajouter un nouveau module = créer un nouveau dossier  
✅ **Maintenance** : Facile de trouver et modifier le code d'un module spécifique  
✅ **Scalabilité** : Structure prête pour plusieurs modules natifs  

