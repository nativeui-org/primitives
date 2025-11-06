import * as React from 'react';
import { Platform, View, type ViewProps } from 'react-native';

let NativeContextMenuView: React.ComponentType<any> | null = null;
if (Platform.OS !== 'web') {
  NativeContextMenuView = require('./native/NativeUiOrgContextMenuView').default;
}

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
    mousePosition?: { x: number; y: number };
    setMousePosition?: (pos: { x: number; y: number }) => void;
    submenuIndicator?: SubmenuIndicatorProp;
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
    submenuIndicator: undefined,
});

export const useContextMenu = () => React.useContext(ContextMenuContext);

/**
 * ContextMenu component with native UIContextMenuInteraction (iOS) and PopupMenu (Android)
 */
export const ContextMenu = React.forwardRef<any, ContextMenuProps>((props, ref) => {
    const { open: openProp, defaultOpen = false, onOpenChange, children, submenuIndicator, ...rest } = props;

    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
    const [isInSubmenu, setIsInSubmenu] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
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

                    if (sectionItems.length > 0) {
                        const lastItem = items[items.length - 1];
                        if (items.length > 0 && !lastItem?.isSeparator && !lastItem?.isSection) {
                            items.push({ label: '', isSeparator: true });
                        }
                        const sectionLabel = sectionProps.title || sectionItems.map(item => item.label).join('•');
                        items.push({
                            label: sectionLabel,
                            submenu: sectionItems,
                            isSection: true,
                            sectionTitle: sectionProps.title,
                        });
                    }
                } else if (child.props && (child.props as any).children) {
                    processChildren((child.props as any).children, isInSubmenu, isInSection);
                }
            });
        };

        const contentElement = content as React.ReactElement<ContextMenuContentProps>;
        processChildren(contentElement.props.children);

        return items;
    }, [content]);

    const contextValue = React.useMemo(() => ({
        open,
        onOpenChange: handleOpenChange,
        menuItems: collectedMenuItems,
        registerMenuItem,
        registerSubmenu,
        registerSeparator,
        registerSection,
        clearMenuItems,
        isInSubmenu,
        setIsInSubmenu,
        itemsToRemoveRef,
        mousePosition,
        setMousePosition,
        submenuIndicator,
    }), [open, handleOpenChange, collectedMenuItems, registerMenuItem, registerSubmenu, registerSeparator, registerSection, clearMenuItems, isInSubmenu, mousePosition, submenuIndicator]);

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
    const { onOpenChange, setMousePosition } = useContextMenu();

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

    const triggerRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (Platform.OS !== 'web') return;
        const element = triggerRef.current;
        if (!element) return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setMousePosition?.({ x: e.clientX, y: e.clientY });
            onOpenChange?.(true);
        };

        element.addEventListener('contextmenu', handleContextMenu);
        return () => element.removeEventListener('contextmenu', handleContextMenu);
    }, [onOpenChange, setMousePosition]);

    const filterProps = Object.keys(rest).reduce((acc, key) => {
        const value = (rest as any)[key];
        if (typeof value !== 'symbol' && (typeof value !== 'function' || key === 'style')) {
            (acc as any)[key] = value;
        }
        return acc;
    }, {} as any);

    if (Platform.OS === 'web') {
        return (
            <View ref={triggerRef} {...filterProps} style={[{ position: 'relative' }, rest.style]}>
                {children}
            </View>
        );
    }

    if (!NativeContextMenuView) {
        return <View {...filterProps} style={rest.style}>{children}</View>;
    }

    return (
        <NativeContextMenuView
            menuItems={menuItemsData}
            onItemPress={handleItemPress}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            {...filterProps}
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
    const { children, forceMount = false } = props;
    const { open, onOpenChange, menuItems, mousePosition, submenuIndicator } = useContextMenu();
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    type WebSubmenuEntry = {
        item: MenuItem;
        rect: DOMRect;
        level: number;
        key: string;
    };

    const [submenuStack, setSubmenuStack] = React.useState<WebSubmenuEntry[]>([]);
    const submenuCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const clearSubmenuTimeout = React.useCallback(() => {
        if (submenuCloseTimeout.current) {
            clearTimeout(submenuCloseTimeout.current);
            submenuCloseTimeout.current = null;
        }
    }, []);

    const closeSubmenusFromLevel = React.useCallback((level: number) => {
        setSubmenuStack(prev => prev.filter(entry => entry.level < level));
    }, []);

    const scheduleCloseFromLevel = React.useCallback((level: number) => {
        clearSubmenuTimeout();
        submenuCloseTimeout.current = setTimeout(() => {
            setSubmenuStack(prev => prev.filter(entry => entry.level < level));
        }, 120);
    }, [clearSubmenuTimeout]);

    const openSubmenu = React.useCallback((menuItem: MenuItem, level: number, target: HTMLElement, key: string) => {
        if (!menuItem.submenu || menuItem.submenu.length === 0) {
            setSubmenuStack(prev => prev.filter(entry => entry.level < level));
            return;
        }
        clearSubmenuTimeout();
        const rect = target.getBoundingClientRect();
        setSubmenuStack(prev => {
            const next = prev.filter(entry => entry.level < level);
            next.push({ item: menuItem, rect, level, key });
            return next;
        });
    }, [clearSubmenuTimeout]);

    React.useLayoutEffect(() => {
        if (!open || Platform.OS !== 'web') return;
        const { x: mouseX, y: mouseY } = mousePosition || { x: 0, y: 0 };
        const menu = menuRef.current;
        if (!menu) return;

        const menuRect = menu.getBoundingClientRect();
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        let x = mouseX;
        let y = mouseY;

        if (x + menuRect.width > viewport.width) x = viewport.width - menuRect.width - 8;
        if (y + menuRect.height > viewport.height) y = y - menuRect.height - 8;

        setPosition({ x, y });

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };
        const preventScroll = (e: Event) => e.preventDefault();

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('wheel', preventScroll);
            document.removeEventListener('touchmove', preventScroll);
        };
    }, [open, onOpenChange, mousePosition]);

    React.useEffect(() => {
        if (!open || Platform.OS !== 'web') return;
        const handleClickOutside = (e: MouseEvent) => {
            const menu = menuRef.current;
            if (menu && !menu.contains(e.target as Node)) onOpenChange(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onOpenChange]);

    React.useEffect(() => {
        if (!open) {
            clearSubmenuTimeout();
            setSubmenuStack([]);
        }
    }, [open, clearSubmenuTimeout]);

    const renderIcon = (value: React.ReactNode) => {
        if (!value) return null;
        if (typeof value === 'string') return <span>{value}</span>;
        return <span style={{ display: 'flex', alignItems: 'center' }}>{value}</span>;
    };

    const renderSubmenuIndicator = React.useCallback((isOpen: boolean): React.ReactNode => {
        if (submenuIndicator) {
            return typeof submenuIndicator === 'function' ? submenuIndicator(isOpen) : submenuIndicator;
        }

        return (
            <span
                style={{
                    width: 0,
                    height: 0,
                    borderTop: '4px solid transparent',
                    borderBottom: '4px solid transparent',
                    borderLeft: '4px solid #9ca3af',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transformOrigin: '50% 50%',
                    transition: 'transform 0.12s ease',
                }}
            />
        );
    }, [submenuIndicator]);

    if (Platform.OS === 'web') {
        if (!open && !forceMount) return null;

        const ReactDOM = require('react-dom');

        const renderMenuItems = (items: MenuItem[], level: number, parentKey = ''): React.ReactNode => {
            return items.map((item, index) => {
                const key = `${parentKey}${index}`;

                if (item.isSeparator) {
                    return (
                        <div
                            key={`separator-${key}`}
                            role="separator"
                            style={{
                                height: '1px',
                                backgroundColor: '#e5e7eb',
                                margin: '8px 0',
                                width: '100%',
                            }}
                        />
                    );
                }

                const isSectionItem = item.isSection ?? false;
                if (isSectionItem && item.submenu && item.submenu.length > 0) {
                    const sectionTitleText = typeof item.sectionTitle === 'string' && item.sectionTitle.length > 0 ? item.sectionTitle : undefined;
                    const renderSectionTitle = () => {
                        if (!sectionTitleText) return null;
                        try {
                            const { Text } = require('@native-ui-org/primitives');
                            return (
                                <Text
                                    as="span"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {sectionTitleText}
                                </Text>
                            );
                        } catch {
                            return (
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {sectionTitleText}
                                </span>
                            );
                        }
                    };

                    return (
                        <div key={`section-${key}`} style={{ paddingTop: level === 0 ? 4 : 0, paddingBottom: 4 }}>
                            {sectionTitleText && (
                                <div style={{ padding: '8px 16px 4px' }}>
                                    {renderSectionTitle()}
                                </div>
                            )}
                            <div>{renderMenuItems(item.submenu ?? [], level, `${key}-`)}</div>
                        </div>
                    );
                }

                const hasSubmenu = !!item.submenu && item.submenu.length > 0;
                const isOpen = hasSubmenu && submenuStack.some(entry => entry.level === level + 1 && entry.key === key);
                const indicatorNode = hasSubmenu ? renderSubmenuIndicator(isOpen) : null;

                const labelNode = (() => {
                    try {
                        const { Text } = require('@native-ui-org/primitives');
                        return <Text style={{ fontSize: 14, color: item.destructive ? '#ef4444' : '#000' }}>{item.label}</Text>;
                    } catch {
                        return <span style={{ fontSize: 14, color: item.destructive ? '#ef4444' : '#000' }}>{item.label}</span>;
                    }
                })();

                if (hasSubmenu) {
                    return (
                        <div
                            key={`submenu-${key}`}
                            role="menuitem"
                            aria-haspopup="menu"
                            aria-expanded={isOpen}
                            tabIndex={item.disabled ? -1 : 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.disabled) return;
                                openSubmenu(item, level + 1, e.currentTarget as HTMLElement, key);
                            }}
                            onKeyDown={(e) => {
                                if (item.disabled) return;
                                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                                    e.preventDefault();
                                    openSubmenu(item, level + 1, e.currentTarget as HTMLElement, key);
                                } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    closeSubmenusFromLevel(level + 1);
                                }
                            }}
                            onMouseEnter={(e) => {
                                if (!item.disabled) {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                }
                                openSubmenu(item, level + 1, e.currentTarget as HTMLElement, key);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                scheduleCloseFromLevel(level + 1);
                            }}
                            style={{
                                padding: '8px 16px',
                                cursor: item.disabled ? 'not-allowed' : 'pointer',
                                opacity: item.disabled ? 0.5 : 1,
                                fontSize: '14px',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {renderIcon(item.icon)}
                            {labelNode}
                            <span
                                style={{
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                }}
                            >
                                {typeof indicatorNode === 'string' || typeof indicatorNode === 'number'
                                    ? <span>{indicatorNode}</span>
                                    : indicatorNode}
                            </span>
                        </div>
                    );
                }

                return (
                    <div
                        key={`item-${key}`}
                        role="menuitem"
                        tabIndex={item.disabled ? -1 : 0}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!item.disabled) {
                                item.onPress?.();
                                onOpenChange(false);
                            }
                        }}
                        onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
                                e.preventDefault();
                                item.onPress?.();
                                onOpenChange(false);
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                onOpenChange(false);
                            }
                        }}
                        onMouseEnter={(e) => {
                            if (!item.disabled) {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }
                            clearSubmenuTimeout();
                            closeSubmenusFromLevel(level + 1);
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        style={{
                            padding: '8px 16px',
                            cursor: item.disabled ? 'not-allowed' : 'pointer',
                            opacity: item.disabled ? 0.5 : 1,
                            color: item.destructive ? '#ef4444' : '#000',
                            fontSize: '14px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        {renderIcon(item.icon)}
                        {labelNode}
                    </div>
                );
            });
        };

        const SubmenuPanel: React.FC<{ entry: WebSubmenuEntry }> = ({ entry }) => {
            const panelRef = React.useRef<HTMLDivElement | null>(null);
            const [panelPosition, setPanelPosition] = React.useState(() => ({
                left: entry.rect.right + 8,
                top: entry.rect.top,
            }));

            React.useLayoutEffect(() => {
                const node = panelRef.current;
                if (!node) return;
                const rect = node.getBoundingClientRect();
                let left = entry.rect.right + 8;
                if (left + rect.width > window.innerWidth) {
                    left = Math.max(entry.rect.left - rect.width - 8, 8);
                }
                let top = entry.rect.top;
                if (top + rect.height > window.innerHeight) {
                    top = Math.max(window.innerHeight - rect.height - 8, 8);
                }
                setPanelPosition(prev => {
                    if (prev.left === left && prev.top === top) {
                        return prev;
                    }
                    return { left, top };
                });
            }, [entry]);

            return ReactDOM.createPortal(
                <div
                    ref={panelRef}
                    role="menu"
                    style={{
                        position: 'fixed',
                        left: panelPosition.left,
                        top: panelPosition.top,
                        zIndex: 1000000,
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        padding: '4px 0',
                        minWidth: '160px',
                        pointerEvents: 'auto',
                    } as any}
                    onMouseEnter={() => clearSubmenuTimeout()}
                    onMouseLeave={() => scheduleCloseFromLevel(entry.level)}
                >
                    {renderMenuItems(entry.item.submenu ?? [], entry.level, `${entry.key}-`)}
                </div>,
                document.body
            );
        };

        const mainMenu = ReactDOM.createPortal(
            <div
                ref={menuRef}
                role="menu"
                style={{
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    zIndex: 1000000,
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    padding: '4px 0',
                    minWidth: '160px',
                    pointerEvents: 'auto',
                } as any}
                onMouseEnter={() => clearSubmenuTimeout()}
                onMouseLeave={() => scheduleCloseFromLevel(1)}
            >
                {menuItems.length > 0 ? (
                    renderMenuItems(menuItems, 0)
                ) : (
                    <View ref={ref} style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
                        {children}
                    </View>
                )}
            </div>,
            document.body
        );

        const submenuPanels = submenuStack.map(entry => (
            <SubmenuPanel key={`submenu-panel-${entry.level}-${entry.key}`} entry={entry} />
        ));

        return (
            <>
                {mainMenu}
                {submenuPanels}
            </>
        );
    }

    return (
        <View ref={ref} style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
            {children}
        </View>
    );
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

