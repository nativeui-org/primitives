import React from 'react';
import { View, Platform } from 'react-native';
export const ContextMenu = React.forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props;

    const [open, setOpen] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const registerMenuItem = React.useCallback((_item: any) => { }, []);

    const contextValue = {
        open,
        onOpenChange: setOpen,
        registerMenuItem,
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
    const { open, onOpenChange, mousePosition } = React.useContext(ContextMenuContext);

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
            {children}
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

const ContextMenuContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    registerMenuItem: (item: any) => void;
    mousePosition: { x: number; y: number };
    setMousePosition: (pos: { x: number; y: number }) => void;
    closeMenu: () => void;
}>({
    open: false,
    onOpenChange: () => { },
    registerMenuItem: () => { },
    mousePosition: { x: 0, y: 0 },
    setMousePosition: () => { },
    closeMenu: () => { },
});

ContextMenu.displayName = 'ContextMenu';
ContextMenuTrigger.displayName = 'ContextMenuTrigger';
ContextMenuContent.displayName = 'ContextMenuContent';
ContextMenuItem.displayName = 'ContextMenuItem';
ContextMenuSeparator.displayName = 'ContextMenuSeparator';
