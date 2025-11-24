const fs = require('fs');
const path = require('path');

// Create build/index.d.ts
const indexDts = `export * from './context-menu';
`;
fs.writeFileSync(path.join(__dirname, '../build/index.d.ts'), indexDts);

// Create build/context-menu/index.d.ts
const contextMenuIndexDts = `export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubmenu,
  ContextMenuSection,
  ContextMenuContext,
  useContextMenu,
} from './ContextMenu';

export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuSubmenuProps,
  ContextMenuSectionProps,
} from './ContextMenu';
`;
fs.writeFileSync(path.join(__dirname, '../build/context-menu/index.d.ts'), contextMenuIndexDts);

// Create build/context-menu/ContextMenu.d.ts
const contextMenuDts = `import * as React from 'react';
import { ViewProps } from 'react-native';

type SubmenuIndicatorProp = React.ReactNode | ((isOpen: boolean) => React.ReactNode);

export type ContextMenuProps = ViewProps & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    submenuIndicator?: SubmenuIndicatorProp;
};

export type ContextMenuTriggerProps = ViewProps & {
    children: React.ReactNode;
    disabled?: boolean;
};

export type ContextMenuContentProps = ViewProps & {
    children: React.ReactNode;
    forceMount?: boolean;
};

export type ContextMenuItemProps = ViewProps & {
    disabled?: boolean;
    destructive?: boolean;
    onPress?: () => void;
    icon?: React.ReactNode;
    iosIcon?: string;
    androidIcon?: string;
    children: React.ReactNode;
};

export type ContextMenuSeparatorProps = ViewProps;

export type ContextMenuSubmenuProps = ViewProps & {
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    iosIcon?: string;
    androidIcon?: string;
    children: React.ReactNode;
};

export type ContextMenuSectionProps = ViewProps & {
    title?: string;
    children: React.ReactNode;
};

type MenuItem = {
    label: string;
    onPress?: () => void;
    destructive?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iosIcon?: string;
    androidIcon?: string;
    submenu?: MenuItem[];
    isSeparator?: boolean;
    isSection?: boolean;
    sectionTitle?: string;
};

export const ContextMenuContext: React.Context<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuItems: MenuItem[];
    registerMenuItem: (item: MenuItem) => void;
    registerSubmenu: (label: string, items: MenuItem[], icon?: React.ReactNode, iosIcon?: string, androidIcon?: string, disabled?: boolean) => void;
    registerSeparator: () => void;
    registerSection: (title: string, items: MenuItem[]) => void;
    clearMenuItems: () => void;
    isInSubmenu: boolean;
    setIsInSubmenu: (value: boolean) => void;
    itemsToRemoveRef?: React.MutableRefObject<Set<string>>;
    mousePosition?: { x: number; y: number };
    setMousePosition?: (pos: { x: number; y: number }) => void;
    submenuIndicator?: SubmenuIndicatorProp;
}>;

export declare const useContextMenu: () => {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuItems: MenuItem[];
    registerMenuItem: (item: MenuItem) => void;
    registerSubmenu: (label: string, items: MenuItem[], icon?: React.ReactNode, iosIcon?: string, androidIcon?: string, disabled?: boolean) => void;
    registerSeparator: () => void;
    registerSection: (title: string, items: MenuItem[]) => void;
    clearMenuItems: () => void;
    isInSubmenu: boolean;
    setIsInSubmenu: (value: boolean) => void;
    itemsToRemoveRef?: React.MutableRefObject<Set<string>>;
    mousePosition?: { x: number; y: number };
    setMousePosition?: (pos: { x: number; y: number }) => void;
    submenuIndicator?: SubmenuIndicatorProp;
};

export declare const ContextMenu: React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<any>>;
export declare const ContextMenuTrigger: React.ForwardRefExoticComponent<ContextMenuTriggerProps & { _menuItems?: MenuItem[], _onOpenChange?: (open: boolean) => void } & React.RefAttributes<any>>;
export declare const ContextMenuContent: React.ForwardRefExoticComponent<ContextMenuContentProps & React.RefAttributes<any>>;
export declare const ContextMenuItem: React.ForwardRefExoticComponent<ContextMenuItemProps & React.RefAttributes<any>>;
export declare const ContextMenuSeparator: React.ForwardRefExoticComponent<ContextMenuSeparatorProps & React.RefAttributes<any>>;
export declare const ContextMenuSubmenu: React.ForwardRefExoticComponent<ContextMenuSubmenuProps & React.RefAttributes<any>>;
export declare const ContextMenuSection: React.ForwardRefExoticComponent<ContextMenuSectionProps & React.RefAttributes<any>>;
`;
fs.writeFileSync(path.join(__dirname, '../build/context-menu/ContextMenu.d.ts'), contextMenuDts);

console.log('✅ TypeScript declaration files generated successfully');

