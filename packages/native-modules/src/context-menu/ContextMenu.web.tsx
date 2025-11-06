import React from 'react';
import { View, Platform } from 'react-native';

export const ContextMenuContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    registerMenuItem: (item: any) => void;
    registerSubmenu: (label: string, items: any[], icon?: string, iosIcon?: string, androidIcon?: string, disabled?: boolean) => void;
    menuItems: any[];
    mousePosition: { x: number; y: number };
    setMousePosition: (pos: { x: number; y: number }) => void;
    closeMenu: () => void;
}>({
    open: false,
    onOpenChange: () => { },
    registerMenuItem: () => { },
    registerSubmenu: () => { },
    menuItems: [],
    mousePosition: { x: 0, y: 0 },
    setMousePosition: () => { },
    closeMenu: () => { },
});

export const useContextMenu = () => React.useContext(ContextMenuContext);

export const ContextMenu = React.forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props;

    const [open, setOpen] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [menuItems, setMenuItems] = React.useState<any[]>([]);

    const registerMenuItem = React.useCallback((item: any) => {
        setMenuItems(prev => {
            const exists = prev.some(m => m.label === item.label);
            if (exists) return prev;
            return [...prev, item];
        });
    }, []);

    const registerSubmenu = React.useCallback((label: string, items: any[], icon?: string, iosIcon?: string, androidIcon?: string, disabled?: boolean) => {
        setMenuItems(prev => {
            const exists = prev.some(m => m.label === label);
            if (exists) return prev;
            return [...prev, { label, submenu: items, icon, iosIcon, androidIcon, disabled }];
        });
    }, []);

    const contextValue = {
        open,
        onOpenChange: setOpen,
        registerMenuItem,
        registerSubmenu,
        menuItems,
        mousePosition,
        setMousePosition,
        closeMenu: () => setOpen(false),
    };

    const trigger = React.Children.toArray(children).find(
        child => React.isValidElement(child) && (child.type as any).displayName === 'ContextMenuTrigger'
    );
    const content = React.Children.toArray(children).find(
        child => React.isValidElement(child) && (child.type as any).displayName === 'ContextMenuContent'
    );

    return (
        <ContextMenuContext.Provider value={contextValue}>
            <View ref={ref} {...rest}>
                {trigger}
                {content}
            </View>
        </ContextMenuContext.Provider>
    );
});

export const ContextMenuTrigger = React.forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props;
    const { onOpenChange, setMousePosition } = React.useContext(ContextMenuContext);

    const triggerRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (Platform.OS !== 'web') {
            return;
        }

        const element = triggerRef.current;
        if (!element) return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setMousePosition({ x: e.clientX, y: e.clientY });
            onOpenChange?.(true);
        };

        element.addEventListener('contextmenu', handleContextMenu);
        return () => element.removeEventListener('contextmenu', handleContextMenu);
    }, [onOpenChange, setMousePosition]);

    return (
        <View
            ref={triggerRef}
            {...rest}
            style={[{ position: 'relative' }, rest.style]}
        >
            {children}
        </View>
    );
});

export const ContextMenuContent = React.forwardRef<any, any>((props, ref) => {
    const { children, forceMount = false } = props;
    const { open, onOpenChange, mousePosition, menuItems } = React.useContext(ContextMenuContext);

    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const menuRef = React.useRef<any>(null);

    React.useLayoutEffect(() => {
        if (!open) return;

        const { x: mouseX, y: mouseY } = mousePosition;
        const menu = menuRef.current;
        if (!menu) {
            return;
        }

        const menuRect = menu.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // mouse position
        let x = mouseX;
        let y = mouseY;

        if (x + menuRect.width > viewport.width) {
            x = viewport.width - menuRect.width - 8;
        }
        if (y + menuRect.height > viewport.height) {
            y = y - menuRect.height - 8;
        }

        setPosition({ x, y });

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        const preventScroll = (e: Event) => {
            e.preventDefault();
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('wheel', preventScroll);
            document.removeEventListener('touchmove', preventScroll);
        };
    }, [open, onOpenChange]);

    React.useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e: MouseEvent) => {
            const menu = menuRef.current;
            if (menu && !menu.contains(e.target as Node)) {
                onOpenChange(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onOpenChange]);

    if (!open && !forceMount) {
        return null;
    }

    const ReactDOM = require('react-dom');
    return ReactDOM.createPortal(
        <div
            ref={menuRef}
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
            }}
        >
            {menuItems.length > 0 ? (
                // Render menu items from context (for native platforms compatibility)
                menuItems.map((item, index) => {
                    if (item.submenu && item.submenu.length > 0) {
                        // Render submenu
                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => {
                                    const submenu = e.currentTarget.querySelector('.submenu') as HTMLElement;
                                    if (submenu) {
                                        submenu.style.display = 'block';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const submenu = e.currentTarget.querySelector('.submenu') as HTMLElement;
                                    if (submenu) {
                                        submenu.style.display = 'none';
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        padding: '8px 16px',
                                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                                        opacity: item.disabled ? 0.5 : 1,
                                        fontSize: '14px',
                                        userSelect: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '8px',
                                    }}
                                >
                                    <span>{item.icon && <span>{item.icon}</span>}{item.label}</span>
                                    <span style={{ fontSize: '12px' }}>›</span>
                                </div>
                                <div
                                    className="submenu"
                                    style={{
                                        display: 'none',
                                        position: 'absolute',
                                        left: '100%',
                                        top: 0,
                                        marginLeft: '4px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                        padding: '4px 0',
                                        minWidth: '160px',
                                        zIndex: 1000001,
                                    }}
                                >
                                    {item.submenu.map((subItem: any, subIndex: number) => (
                                        <div
                                            key={subIndex}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!subItem.disabled) {
                                                    subItem.onPress?.();
                                                    onOpenChange(false);
                                                }
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                cursor: subItem.disabled ? 'not-allowed' : 'pointer',
                                                opacity: subItem.disabled ? 0.5 : 1,
                                                color: subItem.destructive ? '#ef4444' : '#000',
                                                fontSize: '14px',
                                                userSelect: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!subItem.disabled) {
                                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            {subItem.icon && <span>{subItem.icon}</span>}
                                            {subItem.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    // Regular menu item
                    return (
                        <div
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!item.disabled) {
                                    item.onPress?.();
                                    onOpenChange(false);
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                cursor: item.disabled ? 'not-allowed' : 'pointer',
                                opacity: item.disabled ? 0.5 : 1,
                                color: item.destructive ? '#ef4444' : '#000',
                                fontSize: '14px',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                            onMouseEnter={(e) => {
                                if (!item.disabled) {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {item.icon && <span>{item.icon}</span>}
                            {item.label}
                        </div>
                    );
                })
            ) : (
                // Fallback to children rendering
                children
            )}
        </div>,
        document.body
    );
});

export const ContextMenuItem = React.forwardRef<any, any>((props, ref) => {
    const { children, disabled = false, destructive = false, onPress } = props;
    const { registerMenuItem, closeMenu } = React.useContext(ContextMenuContext);

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

    React.useEffect(() => {
        if (label) {
            registerMenuItem({ label, onPress, destructive, disabled });
        }
    }, [label, onPress, destructive, disabled, registerMenuItem]);

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                    onPress?.();
                    closeMenu?.();
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
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            {children}
        </div>
    );
});

export const ContextMenuSeparator = React.forwardRef<any, any>((props, ref) => {
    return (
        <div
            style={{
                height: '1px',
                backgroundColor: '#e5e7eb',
                margin: '4px 0',
            }}
        />
    );
});

ContextMenu.displayName = 'ContextMenu';
ContextMenuTrigger.displayName = 'ContextMenuTrigger';
ContextMenuContent.displayName = 'ContextMenuContent';
ContextMenuItem.displayName = 'ContextMenuItem';
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

