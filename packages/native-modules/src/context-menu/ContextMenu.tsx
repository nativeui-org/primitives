import * as React from 'react';
import { Platform, View, Pressable, type ViewProps } from 'react-native';
import NativeContextMenuView from './native/NativeUiOrgContextMenuView';

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

// Context for managing state
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
});

export const useContextMenu = () => React.useContext(ContextMenuContext);

/**
 * ContextMenu component with native UIContextMenuInteraction (iOS) and PopupMenu (Android)
 */
export const ContextMenu = React.forwardRef<any, ContextMenuProps>((props, ref) => {
    const { open: openProp, defaultOpen = false, onOpenChange, children, ...rest } = props;

    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
    const [isInSubmenu, setIsInSubmenu] = React.useState(false);
    // Track items that should be removed (they're part of submenus/sections)
    const itemsToRemoveRef = React.useRef<Set<string>>(new Set());

    const open = openProp ?? internalOpen;

    const handleOpenChange = React.useCallback((newOpen: boolean) => {
        if (openProp === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [openProp, onOpenChange]);

    const registerMenuItem = React.useCallback((item: MenuItem) => {
        // Skip if this item should be removed (part of a submenu/section)
        if (itemsToRemoveRef.current.has(item.label)) {
            return;
        }
        
        setMenuItems(prev => {
            // Check if this item is already part of a submenu
            const isInSubmenu = prev.some(m => m.submenu?.some(subItem => subItem.label === item.label));
            if (isInSubmenu) {
                return prev;
            }
            const exists = prev.some(m => m.label === item.label && !m.submenu && !m.isSeparator);
            if (exists) {
                return prev;
            }
            return [...prev, item];
        });
    }, []);

    const registerSubmenu = React.useCallback((label: string, items: MenuItem[], icon?: React.ReactNode, iosIcon?: string, androidIcon?: string, disabled?: boolean) => {
        // Mark items as "to remove" IMMEDIATELY
        items.forEach(item => {
            itemsToRemoveRef.current.add(item.label);
        });
        
        setMenuItems(prev => {
            // Remove any items that are now part of this submenu (by label match)
            const itemLabels = new Set(items.map(i => i.label));
            const filtered = prev.filter(m => {
                if (m.isSeparator) return true;
                return !itemLabels.has(m.label);
            });
            
            // Check if submenu already exists
            const exists = filtered.some(m => m.label === label && m.submenu);
            if (exists) {
                return filtered;
            }
            
            // Add the submenu
            return [...filtered, { label, submenu: items, icon, iosIcon, androidIcon, disabled }];
        });
    }, []);

    const registerSeparator = React.useCallback(() => {
        setMenuItems(prev => {
            // Add a separator item
            return [...prev, { label: '', isSeparator: true }];
        });
    }, []);

    const registerSection = React.useCallback((title: string, items: MenuItem[]) => {
        items.forEach(item => {
            if (!item.submenu) {
                itemsToRemoveRef.current.add(item.label);
            } else {
                item.submenu?.forEach(subItem => {
                    itemsToRemoveRef.current.add(subItem.label);
                });
            }
        });

        setMenuItems(prev => {
            const sectionKey = title || items.map(i => i.label).join('•');
            const itemLabels = new Set(items.flatMap(item =>
                item.submenu ? item.submenu.map(s => s.label) : [item.label]
            ));

            const filtered = prev.filter(m => {
                if (m.isSeparator) return true;
                if (m.isSection && (m.sectionTitle ?? m.label) === sectionKey) {
                    return false;
                }
                if (itemLabels.has(m.label)) {
                    return false;
                }
                return true;
            });

            const next = [...filtered];
            const needsSeparator = next.length > 0 && !next[next.length - 1]?.isSeparator;
            if (needsSeparator) {
                next.push({ label: `separator-${next.length}`, isSeparator: true });
            }

            next.push({
                label: sectionKey || `section-${next.length}`,
                sectionTitle: title || undefined,
                submenu: items,
                isSection: true,
            });

            return next;
        });
    }, []);

    const clearMenuItems = React.useCallback(() => {
        setMenuItems([]);
    }, []);

    const contextValue = React.useMemo(() => ({
        open,
        onOpenChange: handleOpenChange,
        menuItems,
        registerMenuItem,
        registerSubmenu,
        registerSeparator,
        registerSection,
        clearMenuItems,
        isInSubmenu,
        setIsInSubmenu,
        itemsToRemoveRef,
    }), [open, handleOpenChange, menuItems, registerMenuItem, registerSubmenu, registerSeparator, registerSection, clearMenuItems, isInSubmenu]);

    const trigger = React.Children.toArray(children).find(
        child => React.isValidElement(child) && (child.type as any).displayName === 'ContextMenuTrigger'
    );
    const content = React.Children.toArray(children).find(
        child => React.isValidElement(child) && (child.type as any).displayName === 'ContextMenuContent'
    );

    // Helper function to extract text label from React children
    const getTextLabel = (children: React.ReactNode): string => {
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

    // Collect menu items synchronously from content children
    const collectedMenuItems = React.useMemo(() => {
        if (!content || !React.isValidElement(content)) {
            return [] as MenuItem[];
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
                    const label = getTextLabel(childProps.children);
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
                            const subLabel = getTextLabel(subChildProps.children);
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
                                const sectionLabel = getTextLabel(sectionChildProps.children);
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
                                        const subLabel = getTextLabel(subChildProps.children);
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

        const contentElement = content as React.ReactElement<ContextMenuContentProps>;
        processChildren(contentElement.props.children);

        if (__DEV__) {
            console.log(`🔍 Collected ${items.length} menu items synchronously`);
            items.forEach((item, idx) => {
                if (item.submenu && item.submenu.length > 0) {
                    console.log(`  ✅ ${idx}. "${item.label}" - SUBMENU with ${item.submenu.length} items`);
                } else if (item.isSeparator) {
                    console.log(`  ✅ ${idx}. SEPARATOR`);
                } else {
                    console.log(`  ✅ ${idx}. "${item.label}"`);
                }
            });
        }

        return items;
    }, [content]);

    if (Platform.OS === 'web') {
        return (
            <ContextMenuContext.Provider value={contextValue}>
                <View ref={ref} {...rest}>
                    {trigger}
                    {content}
                </View>
            </ContextMenuContext.Provider>
        );
    }

    // Debug: log menuItems whenever they change
    React.useEffect(() => {
        if (__DEV__) {
            console.log(`🔍 ContextMenu: menuItems changed, count: ${menuItems.length}`);
            menuItems.forEach((item, idx) => {
                if (item.submenu && item.submenu.length > 0) {
                    console.log(`  ${idx}. "${item.label}" - SUBMENU with ${item.submenu.length} items`);
                } else if (item.isSeparator) {
                    console.log(`  ${idx}. SEPARATOR`);
                } else {
                    console.log(`  ${idx}. "${item.label}"`);
                }
            });
        }
    }, [menuItems]);

    return (
        <ContextMenuContext.Provider value={contextValue}>
            {/* Mount content invisibly to collect menu items */}
            <View style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0 }}>
                {content}
            </View>
            {trigger && React.cloneElement(trigger as React.ReactElement, {
                _menuItems: collectedMenuItems,
                _onOpenChange: handleOpenChange,
            } as any)}
        </ContextMenuContext.Provider>
    );
});

ContextMenu.displayName = 'ContextMenu';

/**
 * ContextMenuTrigger - wraps the content that triggers the context menu
 */
export const ContextMenuTrigger = React.forwardRef<any, ContextMenuTriggerProps & { _menuItems?: MenuItem[], _onOpenChange?: (open: boolean) => void }>((props, ref) => {
    const { children, _menuItems = [], _onOpenChange, ...rest } = props;

    // Clean up items: remove items that are part of submenus/sections
    // This ensures items inside submenus/sections don't appear as top-level items
    const cleanedMenuItems = React.useMemo(() => {
        const itemsToKeep: MenuItem[] = [];
        const itemsInSubmenus = new Set<string>();
        
        // First pass: collect all items that are in submenus
        _menuItems.forEach(item => {
            if (item.submenu && item.submenu.length > 0) {
                item.submenu.forEach(subItem => {
                    itemsInSubmenus.add(subItem.label);
                });
            }
        });
        
        // Second pass: keep only items that are NOT in submenus (unless they ARE the submenu itself)
        _menuItems.forEach(item => {
            // Keep separators
            if (item.isSeparator) {
                itemsToKeep.push(item);
                return;
            }
            // Keep submenus themselves
            if (item.submenu && item.submenu.length > 0) {
                itemsToKeep.push(item);
                return;
            }
            // Skip items that are inside submenus
            if (itemsInSubmenus.has(item.label)) {
                return;
            }
            // Keep regular items
            itemsToKeep.push(item);
        });
        
        return itemsToKeep;
    }, [_menuItems]);

    const handleItemPress = React.useCallback((event: any) => {
        const { index } = event.nativeEvent;
        // Handle submenu items (format: "parentIndex_subIndex")
        if (typeof index === 'string' && index.includes('_')) {
            const parts = index.split('_');
            const parentIdx = parts[0] ? parseInt(parts[0], 10) : -1;
            const subIdx = parts[1] ? parseInt(parts[1], 10) : -1;
            // Use cleanedMenuItems for indexing since that's what we send to native
            if (parentIdx >= 0 && subIdx >= 0 && parentIdx < cleanedMenuItems.length) {
                const parentItem = cleanedMenuItems[parentIdx];
                if (parentItem && parentItem.submenu && subIdx < parentItem.submenu.length) {
                    const subItem = parentItem.submenu[subIdx];
                    if (subItem && !subItem.disabled) {
                        subItem.onPress?.();
                        _onOpenChange?.(false);
                    }
                }
            }
        } else {
            const itemIndex = typeof index === 'number' ? index : parseInt(String(index), 10);
            // Use cleanedMenuItems for indexing since that's what we send to native
            if (!isNaN(itemIndex) && itemIndex >= 0 && itemIndex < cleanedMenuItems.length) {
                const item = cleanedMenuItems[itemIndex];
                if (item && !item.disabled && !item.submenu) {
                    item.onPress?.();
                    _onOpenChange?.(false);
                }
            }
        }
    }, [cleanedMenuItems, _onOpenChange]);

    const handleMenuOpen = React.useCallback(() => {
        _onOpenChange?.(true);
    }, [_onOpenChange]);

    const handleMenuClose = React.useCallback(() => {
        _onOpenChange?.(false);
    }, [_onOpenChange]);

    const getNativeIcon = (value: MenuItem['icon']) =>
        typeof value === 'string' ? value : '';

    const menuItemsData = cleanedMenuItems.map(item => ({
        label: item.label || '',
        destructive: item.destructive || false,
        disabled: item.disabled || false,
        icon: getNativeIcon(item.icon),
        iosIcon: item.iosIcon || '',
        androidIcon: item.androidIcon || '',
        isSeparator: item.isSeparator || false,
        isSection: item.isSection || false,
        sectionTitle: item.sectionTitle || '',
        submenu: item.submenu?.map(subItem => ({
            label: subItem.label || '',
            destructive: subItem.destructive || false,
            disabled: subItem.disabled || false,
            icon: getNativeIcon(subItem.icon),
            iosIcon: subItem.iosIcon || '',
            androidIcon: subItem.androidIcon || '',
            isSection: subItem.isSection || false,
            sectionTitle: subItem.sectionTitle || '',
        })) || [],
    }));

    // Filter out any non-serializable props (like Symbols) that can't be passed to native
    const nativeProps = Object.keys(rest).reduce((acc, key) => {
        const value = (rest as any)[key];
        if (typeof value !== 'symbol' && (typeof value !== 'function' || key === 'style')) {
            (acc as any)[key] = value;
        }
        return acc;
    }, {} as any);

    // On Android, use JS-based long press and render a Modal with menu items
    if (Platform.OS === 'android') {
        return (
            <Pressable
                {...nativeProps}
                style={rest.style}
                onLongPress={handleMenuOpen}
            >
                {children}
            </Pressable>
        );
    }

    // iOS uses UIContextMenuInteraction which works fine
    return (
        <NativeContextMenuView
            menuItems={menuItemsData}
            onItemPress={handleItemPress}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            {...nativeProps}
            style={rest.style}
        >
            {children}
        </NativeContextMenuView>
    );
});

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

/**
 * ContextMenuContent - container for menu items
 * On iOS: renders children invisibly to collect menu items
 * On Android: renders a Modal bottom sheet with the items
 */
export const ContextMenuContent = React.forwardRef<any, ContextMenuContentProps>((props, ref) => {
    const { children } = props;
    const { open, onOpenChange, menuItems } = useContextMenu();

    // On Android, show a modal bottom sheet
    if (Platform.OS === 'android') {
        const Modal = require('react-native').Modal;
        const Pressable = require('react-native').Pressable;
        const Text = require('react-native').Text;

        return (
            <>
                {/* Render children invisibly to collect items */}
                <View ref={ref} style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
                    {children}
                </View>

                <Modal
                    visible={open}
                    transparent
                    animationType="fade"
                    onRequestClose={() => onOpenChange(false)}
                >
                    <Pressable
                        style={styles.overlay}
                        onPress={() => onOpenChange(false)}
                    >
                        <View style={styles.bottomSheet}>
                            {menuItems.map((item, index) => {
                                // Handle separators
                                if (item.isSeparator) {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                height: 1,
                                                backgroundColor: '#e5e7eb',
                                                marginVertical: 8,
                                                marginHorizontal: 16,
                                            }}
                                        />
                                    );
                                }

                                if (item.submenu && item.submenu.length > 0) {
                                    const isSectionItem = item.isSection ?? false;
                                    const sectionTitleText = typeof item.sectionTitle === 'string' && item.sectionTitle.length > 0 ? item.sectionTitle : undefined;
                                    const headerLabel = sectionTitleText ?? item.label;
                                    return (
                                        <View key={index} style={isSectionItem ? styles.sectionGroup : undefined}>
                                            {headerLabel.length > 0 && (
                                                <View style={styles.submenuHeader}>
                                                    <Text style={[
                                                        styles.submenuHeaderText,
                                                        item.disabled && styles.menuItemDisabled
                                                    ]}>
                                                        {headerLabel}
                                                    </Text>
                                                </View>
                                            )}
                                            {item.submenu.map((subItem, subIndex) => (
                                                <Pressable
                                                    key={`${index}_${subIndex}`}
                                                    style={[
                                                        styles.menuItem,
                                                        styles.submenuItem,
                                                        subItem.disabled && styles.menuItemDisabled
                                                    ]}
                                                    onPress={() => {
                                                        if (!subItem.disabled) {
                                                            subItem.onPress?.();
                                                            onOpenChange(false);
                                                        }
                                                    }}
                                                    disabled={subItem.disabled}
                                                >
                                                    <View style={styles.menuItemContent}>
                                                        <Text style={[
                                                            styles.menuItemText,
                                                            subItem.destructive && styles.menuItemDestructive
                                                        ]}>
                                                            {subItem.label}
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                            ))}
                                        </View>
                                    );
                                }
                                // Regular menu item
                                return (
                                    <Pressable
                                        key={index}
                                        style={[
                                            styles.menuItem,
                                            item.disabled && styles.menuItemDisabled
                                        ]}
                                        onPress={() => {
                                            if (!item.disabled) {
                                                item.onPress?.();
                                                onOpenChange(false);
                                            }
                                        }}
                                        disabled={item.disabled}
                                    >
                                        <View style={styles.menuItemContent}>
                                            <Text style={[
                                                styles.menuItemText,
                                                item.destructive && styles.menuItemDestructive
                                            ]}>
                                                {item.label}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </Pressable>
                </Modal>
            </>
        );
    }

    return (
        <View ref={ref} style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
            {children}
        </View>
    );
});

const styles = require('react-native').StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 8,
        paddingBottom: 24,
    },
    menuItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    menuItemDisabled: {
        opacity: 0.5,
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#000',
    },
    menuItemDestructive: {
        color: '#ef4444',
    },
    submenuHeader: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    submenuHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
    },
    submenuItem: {
        paddingLeft: 40,
    },
    sectionGroup: {
        paddingTop: 12,
    },
});

ContextMenuContent.displayName = 'ContextMenuContent';

/**
 * ContextMenuItem - individual menu item
 */
export const ContextMenuItem = React.forwardRef<any, ContextMenuItemProps>((props, ref) => {
    const { children, disabled = false, destructive = false, onPress, icon, iosIcon, androidIcon } = props;
    const { registerMenuItem, isInSubmenu } = useContextMenu();

    const getTextLabel = (children: React.ReactNode): string => {
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

    const label = getTextLabel(children);

    const iconDependency = typeof icon === 'string' ? icon : icon ? '__node__' : null;

    React.useLayoutEffect(() => {
        if (label && !isInSubmenu) {
            registerMenuItem({ label, onPress, destructive, disabled, icon, iosIcon, androidIcon });
        }
    }, [label, onPress, destructive, disabled, iconDependency, iosIcon, androidIcon, registerMenuItem, isInSubmenu]);

    const renderIcon = (value: React.ReactNode) => {
        if (!value) return null;
        if (typeof value === 'string') {
            return <span>{value}</span>;
        }
        return <span style={{ display: 'flex', alignItems: 'center' }}>{value}</span>;
    };

    if (Platform.OS === 'web') {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) {
                        onPress?.();
                    }
                }}
                style={{
                    padding: '8px 16px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    color: destructive ? '#ef4444' : '#000',
                    fontSize: '14px',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                } as any}
                onMouseEnter={(e) => {
                    if (!disabled) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                {renderIcon(icon)}
                {children}
            </div>
        );
    }

    return null;
});

ContextMenuItem.displayName = 'ContextMenuItem';

/**
 * ContextMenuSeparator - visual separator (native menus don't support separators)
 */
export const ContextMenuSeparator = React.forwardRef<any, ContextMenuSeparatorProps>((props, ref) => {
    const { registerSeparator } = useContextMenu();

    React.useEffect(() => {
        registerSeparator();
    }, [registerSeparator]);

    if (Platform.OS === 'web') {
        return (
            <div
                style={{
                    height: '1px',
                    backgroundColor: '#e5e7eb',
                    margin: '4px 0',
                }}
            />
        );
    }

    // On native, separator is handled by grouping menu items
    return null;
});

ContextMenuSeparator.displayName = 'ContextMenuSeparator';

/**
 * ContextMenuSubmenu - creates a submenu with nested items
 */
export const ContextMenuSubmenu = React.forwardRef<any, ContextMenuSubmenuProps>((props, ref) => {
    const { label, disabled = false, icon, iosIcon, androidIcon, children } = props;
    const parentContext = useContextMenu();
    const { registerSubmenu, itemsToRemoveRef: parentItemsToRemoveRef } = parentContext;
    
    // Collect submenu items from children IMMEDIATELY (synchronously)
    const submenuItems = React.useMemo(() => {
        const items: MenuItem[] = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child)) {
                const childType = (child.type as any)?.displayName;
                if (childType === 'ContextMenuItem') {
                    const childProps = child.props as ContextMenuItemProps;
                    const getTextLabel = (children: React.ReactNode): string => {
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
                    const itemLabel = getTextLabel(childProps.children);
                    if (itemLabel) {
                        items.push({
                            label: itemLabel,
                            onPress: childProps.onPress,
                            destructive: childProps.destructive,
                            disabled: childProps.disabled,
                            icon: childProps.icon,
                            iosIcon: childProps.iosIcon,
                            androidIcon: childProps.androidIcon,
                        });
                    }
                }
            }
        });
        return items;
    }, [children]);

    // Mark items as "to remove" IMMEDIATELY (before they can register)
    React.useLayoutEffect(() => {
        if (!parentItemsToRemoveRef) {
            return;
        }
        submenuItems.forEach(item => {
            parentItemsToRemoveRef.current.add(item.label);
        });
    }, [submenuItems, parentItemsToRemoveRef]);

    // Create a new context that prevents items from registering themselves
    const submenuContext = React.useMemo(() => ({
        ...parentContext,
        isInSubmenu: true,
        registerMenuItem: (item: MenuItem) => {
            if (parentItemsToRemoveRef) {
                parentItemsToRemoveRef.current.add(item.label);
            }
        },
    }), [parentContext, parentItemsToRemoveRef]);

    const prevSubmenuSignatureRef = React.useRef<string | null>(null);

    // Register submenu when items are ready - use useLayoutEffect to run BEFORE items register
    React.useLayoutEffect(() => {
        if (submenuItems.length === 0) {
            return;
        }

        const signature = JSON.stringify({
            label,
            disabled,
            icon,
            iosIcon,
            androidIcon,
            items: submenuItems.map((item) => ({
                label: item.label,
                disabled: item.disabled,
                destructive: item.destructive,
                icon: item.icon,
                iosIcon: item.iosIcon,
                androidIcon: item.androidIcon,
            })),
        });

        if (prevSubmenuSignatureRef.current === signature) {
            return;
        }

        prevSubmenuSignatureRef.current = signature;
        registerSubmenu(label, submenuItems, icon, iosIcon, androidIcon, disabled);
    }, [label, submenuItems, icon, iosIcon, androidIcon, disabled, registerSubmenu]);

    if (Platform.OS === 'web') {
        return (
            <ContextMenuContext.Provider value={submenuContext}>
                <div
                    style={{
                        position: 'relative',
                    } as any}
                >
                    {children}
                </div>
            </ContextMenuContext.Provider>
        );
    }

    // On native platforms, submenu items are collected invisibly
    return (
        <ContextMenuContext.Provider value={submenuContext}>
            <View ref={ref} style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
                {children}
            </View>
        </ContextMenuContext.Provider>
    );
});

ContextMenuSubmenu.displayName = 'ContextMenuSubmenu';

/**
 * ContextMenuSection - creates a visually separated section in the menu (like SwiftUI Section)
 */
export const ContextMenuSection = React.forwardRef<any, ContextMenuSectionProps>((props, ref) => {
    const { title, children } = props;
    const parentContext = useContextMenu();
    const {
        registerSection,
        itemsToRemoveRef: parentItemsToRemoveRef,
    } = parentContext;

    // Collect section items from children IMMEDIATELY (synchronously)
    const sectionItems = React.useMemo(() => {
        const items: MenuItem[] = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child)) {
                const childType = (child.type as any)?.displayName;
                if (childType === 'ContextMenuItem') {
                    const childProps = child.props as ContextMenuItemProps;
                    const getTextLabel = (children: React.ReactNode): string => {
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
                    const itemLabel = getTextLabel(childProps.children);
                    if (itemLabel) {
                        items.push({
                            label: itemLabel,
                            onPress: childProps.onPress,
                            destructive: childProps.destructive,
                            disabled: childProps.disabled,
                            icon: childProps.icon,
                            iosIcon: childProps.iosIcon,
                            androidIcon: childProps.androidIcon,
                        });
                    }
                } else if (childType === 'ContextMenuSubmenu') {
                    // Handle submenus in sections
                    const submenuProps = child.props as ContextMenuSubmenuProps;
                    const submenuItems: MenuItem[] = [];
                    React.Children.forEach(submenuProps.children, (subChild) => {
                        if (React.isValidElement(subChild)) {
                            const subChildType = (subChild.type as any)?.displayName;
                            if (subChildType === 'ContextMenuItem') {
                                const subChildProps = subChild.props as ContextMenuItemProps;
                                const getTextLabel = (children: React.ReactNode): string => {
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
                                const itemLabel = getTextLabel(subChildProps.children);
                                if (itemLabel) {
                                    submenuItems.push({
                                        label: itemLabel,
                                        onPress: subChildProps.onPress,
                                        destructive: subChildProps.destructive,
                                        disabled: subChildProps.disabled,
                                        icon: subChildProps.icon,
                                        iosIcon: subChildProps.iosIcon,
                                        androidIcon: subChildProps.androidIcon,
                                    });
                                }
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
                }
            }
        });
        return items;
    }, [children]);

    // Mark items as "to remove" IMMEDIATELY (before they can register)
    React.useLayoutEffect(() => {
        if (!parentItemsToRemoveRef) {
            return;
        }
        sectionItems.forEach(item => {
            if (!item.submenu) {
                parentItemsToRemoveRef.current.add(item.label);
            } else {
                item.submenu.forEach(subItem => {
                    parentItemsToRemoveRef.current.add(subItem.label);
                });
            }
        });
    }, [sectionItems, parentItemsToRemoveRef]);

    // Create a new context that prevents items from registering themselves
    const sectionContext = React.useMemo(() => ({
        ...parentContext,
        isInSubmenu: false, // Sections can contain regular items
        registerMenuItem: (item: MenuItem) => {
            if (parentItemsToRemoveRef) {
                parentItemsToRemoveRef.current.add(item.label);
            }
        },
    }), [parentContext, parentItemsToRemoveRef]);

    const prevSectionSignatureRef = React.useRef<string | null>(null);

    // Register section when items are ready - use useLayoutEffect to run BEFORE items register
    React.useLayoutEffect(() => {
        if (sectionItems.length === 0) {
            return;
        }

        const signature = JSON.stringify({
            title,
            items: sectionItems.map((item) => ({
                label: item.label,
                disabled: item.disabled,
                destructive: item.destructive,
                icon: item.icon,
                iosIcon: item.iosIcon,
                androidIcon: item.androidIcon,
                submenu: item.submenu?.map((sub) => ({
                    label: sub.label,
                    disabled: sub.disabled,
                    destructive: sub.destructive,
                    icon: sub.icon,
                    iosIcon: sub.iosIcon,
                    androidIcon: sub.androidIcon,
                })) ?? null,
            })),
        });

        if (prevSectionSignatureRef.current === signature) {
            return;
        }

        prevSectionSignatureRef.current = signature;
        registerSection(title || '', sectionItems);
    }, [title, sectionItems, registerSection]);

    if (Platform.OS === 'web') {
        return (
            <ContextMenuContext.Provider value={sectionContext}>
                <div
                    style={{
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid #e5e7eb',
                    } as any}
                >
                    {title && (
                        <div
                            style={{
                                padding: '8px 16px 4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            } as any}
                        >
                            {title}
                        </div>
                    )}
                    {children}
                </div>
            </ContextMenuContext.Provider>
        );
    }

    // On native platforms, section items are collected invisibly
    return (
        <ContextMenuContext.Provider value={sectionContext}>
            <View ref={ref} style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
                {children}
            </View>
        </ContextMenuContext.Provider>
    );
});

ContextMenuSection.displayName = 'ContextMenuSection';

