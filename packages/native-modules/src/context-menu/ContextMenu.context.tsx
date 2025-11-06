import * as React from 'react';
import type { MenuItem } from './ContextMenu.types';

export const ContextMenuContext = React.createContext<{
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
}>({
    open: false,
    onOpenChange: () => { },
    menuItems: [],
    registerMenuItem: () => { },
    registerSubmenu: () => { },
    registerSeparator: () => { },
    registerSection: () => { },
    clearMenuItems: () => { },
    isInSubmenu: false,
    setIsInSubmenu: () => { },
    mousePosition: { x: 0, y: 0 },
    setMousePosition: () => { },
});

export const useContextMenu = () => React.useContext(ContextMenuContext);

