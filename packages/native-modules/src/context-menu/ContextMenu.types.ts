import * as React from 'react';
import type { ViewProps } from 'react-native';

export type ContextMenuProps = ViewProps & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
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

export type MenuItem = {
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

