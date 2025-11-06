import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import type {
    ContextMenuProps,
    ContextMenuTriggerProps,
    ContextMenuContentProps,
    ContextMenuItemProps,
    ContextMenuSeparatorProps,
    ContextMenuSubmenuProps,
    ContextMenuSectionProps,
    MenuItem,
} from './ContextMenu.types';
import { ContextMenuContext, useContextMenu } from './ContextMenu.context';

export const getTextLabel = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children;
    if (React.isValidElement(children)) {
        const childProps = children.props as any;
        if (childProps && childProps.children) {
            return getTextLabel(childProps.children);
        }
    }
    if (Array.isArray(children)) {
        return children.map(getTextLabel).join('');
    }
    return '';
};

export const collectMenuItems = (
    content: React.ReactElement<ContextMenuContentProps> | null,
    getTextLabelFn: (children: React.ReactNode) => string
): MenuItem[] => {
    if (!content || !React.isValidElement(content)) {
        return [];
    }

    const items: MenuItem[] = [];

    const processChildren = (children: React.ReactNode, isInSubmenu: boolean = false, isInSection: boolean = false) => {
        React.Children.forEach(children, (child) => {
            if (!React.isValidElement(child)) return;

            const childType = (child.type as any)?.displayName;

            if (childType === 'ContextMenuItem') {
                if (isInSubmenu || isInSection) {
                    return;
                }
                const childProps = child.props as ContextMenuItemProps;
                const label = getTextLabelFn(childProps.children);
                if (label) {
                    items.push({
                        label,
                        onPress: childProps.onPress,
                        destructive: childProps.destructive,
                        disabled: childProps.disabled,
                        icon: childProps.icon,
                        iosIcon: childProps.iosIcon,
                        androidIcon: childProps.androidIcon,
                    });
                }
            } else if (childType === 'ContextMenuSeparator') {
                if (!isInSubmenu && !isInSection) {
                    items.push({ label: '', isSeparator: true });
                }
            } else if (childType === 'ContextMenuSubmenu') {
                const submenuProps = child.props as ContextMenuSubmenuProps;
                const submenuItems: MenuItem[] = [];

                React.Children.forEach(submenuProps.children, (subChild) => {
                    if (React.isValidElement(subChild) && (subChild.type as any)?.displayName === 'ContextMenuItem') {
                        const subChildProps = subChild.props as ContextMenuItemProps;
                        const subLabel = getTextLabelFn(subChildProps.children);
                        if (subLabel) {
                            submenuItems.push({
                                label: subLabel,
                                onPress: subChildProps.onPress,
                                destructive: subChildProps.destructive,
                                disabled: subChildProps.disabled,
                                icon: subChildProps.icon,
                                iosIcon: subChildProps.iosIcon,
                                androidIcon: subChildProps.androidIcon,
                            });
                        }
                    }
                });

                if (submenuItems.length > 0) {
                    items.push({
                        label: submenuProps.label,
                        submenu: submenuItems,
                        icon: submenuProps.icon,
                        iosIcon: submenuProps.iosIcon,
                        androidIcon: submenuProps.androidIcon,
                        disabled: submenuProps.disabled,
                    });
                }
            } else if (childType === 'ContextMenuSection') {
                const sectionProps = child.props as ContextMenuSectionProps;
                const sectionItems: MenuItem[] = [];

                React.Children.forEach(sectionProps.children, (sectionChild) => {
                    if (React.isValidElement(sectionChild)) {
                        const sectionChildType = (sectionChild.type as any)?.displayName;

                        if (sectionChildType === 'ContextMenuItem') {
                            const sectionChildProps = sectionChild.props as ContextMenuItemProps;
                            const sectionLabel = getTextLabelFn(sectionChildProps.children);
                            if (sectionLabel) {
                                sectionItems.push({
                                    label: sectionLabel,
                                    onPress: sectionChildProps.onPress,
                                    destructive: sectionChildProps.destructive,
                                    disabled: sectionChildProps.disabled,
                                    icon: sectionChildProps.icon,
                                    iosIcon: sectionChildProps.iosIcon,
                                    androidIcon: sectionChildProps.androidIcon,
                                });
                            }
                        } else if (sectionChildType === 'ContextMenuSubmenu') {
                            const submenuProps = sectionChild.props as ContextMenuSubmenuProps;
                            const submenuItems: MenuItem[] = [];

                            React.Children.forEach(submenuProps.children, (subChild) => {
                                if (React.isValidElement(subChild) && (subChild.type as any)?.displayName === 'ContextMenuItem') {
                                    const subChildProps = subChild.props as ContextMenuItemProps;
                                    const subLabel = getTextLabelFn(subChildProps.children);
                                    if (subLabel) {
                                        submenuItems.push({
                                            label: subLabel,
                                            onPress: subChildProps.onPress,
                                            destructive: subChildProps.destructive,
                                            disabled: subChildProps.disabled,
                                            icon: subChildProps.icon,
                                            iosIcon: subChildProps.iosIcon,
                                            androidIcon: subChildProps.androidIcon,
                                        });
                                    }
                                }
                            });

                            if (submenuItems.length > 0) {
                                sectionItems.push({
                                    label: submenuProps.label,
                                    submenu: submenuItems,
                                    icon: submenuProps.icon,
                                    iosIcon: submenuProps.iosIcon,
                                    androidIcon: submenuProps.androidIcon,
                                    disabled: submenuProps.disabled,
                                });
                            }
                        }
                    }
                });

                if (items.length > 0 && sectionItems.length > 0) {
                    items.push({ label: '', isSeparator: true });
                }

                items.push(...sectionItems);
            } else if (child.props && (child.props as any).children) {
                processChildren((child.props as any).children, isInSubmenu, isInSection);
            }
        });
    };

    processChildren(content.props.children);

    return items;
};

