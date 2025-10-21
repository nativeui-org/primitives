import * as React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import NativeContextMenuView from './NativeContextMenuView';

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
  icon?: string; // For web
  iosIcon?: string; // SF Symbol name for iOS
  androidIcon?: string; // Material Icon name for Android
  children: React.ReactNode;
};

export type ContextMenuSeparatorProps = ViewProps;

type MenuItem = {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: string; // For web
  iosIcon?: string; // For iOS
  androidIcon?: string; // For Android
};

// Context for managing state
export const ContextMenuContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItem[];
  registerMenuItem: (item: MenuItem) => void;
  clearMenuItems: () => void;
}>({
  open: false,
  onOpenChange: () => {},
  menuItems: [],
  registerMenuItem: () => {},
  clearMenuItems: () => {},
});

export const useContextMenu = () => React.useContext(ContextMenuContext);

/**
 * ContextMenu component with native UIContextMenuInteraction (iOS) and PopupMenu (Android)
 */
export const ContextMenu = React.forwardRef<any, ContextMenuProps>((props, ref) => {
  console.log('ContextMenu: Component loaded, Platform.OS:', Platform.OS);
  const { open: openProp, defaultOpen = false, onOpenChange, children, ...rest } = props;
  console.log('ContextMenu: Children count:', React.Children.count(children));
  
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  
  const open = openProp ?? internalOpen;
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (openProp === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [openProp, onOpenChange]);

  const registerMenuItem = React.useCallback((item: MenuItem) => {
    setMenuItems(prev => {
      // Avoid duplicates
      const exists = prev.some(m => m.label === item.label);
      if (exists) return prev;
      return [...prev, item];
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
    clearMenuItems,
  }), [open, handleOpenChange, menuItems, registerMenuItem, clearMenuItems]);

  // Extract trigger and content from children
  console.log('ContextMenu: Extracting children...');
  const trigger = React.Children.toArray(children).find(
    child => React.isValidElement(child) && (child.type as any).displayName === 'ContextMenuTrigger'
  );
  const content = React.Children.toArray(children).find(
    child => React.isValidElement(child) && (child.type as any).displayName === 'ContextMenuContent'
  );
  console.log('ContextMenu: Trigger found:', !!trigger);
  console.log('ContextMenu: Content found:', !!content);

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

  // On native, we need to mount content first to collect menu items, then wrap trigger
  return (
    <ContextMenuContext.Provider value={contextValue}>
      {/* Mount content invisibly to collect menu items */}
      <View style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0 }}>
        {content}
      </View>
      {trigger && React.cloneElement(trigger as React.ReactElement, {
        _menuItems: menuItems,
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

  const handleItemPress = React.useCallback((event: any) => {
    const { index } = event.nativeEvent;
    const item = _menuItems[index];
    if (item && !item.disabled) {
      item.onPress?.();
      _onOpenChange?.(false);
    }
  }, [_menuItems, _onOpenChange]);

  const handleMenuOpen = React.useCallback(() => {
    _onOpenChange?.(true);
  }, [_onOpenChange]);

  const handleMenuClose = React.useCallback(() => {
    _onOpenChange?.(false);
  }, [_onOpenChange]);

  // Debug: Check platform
  console.log('ContextMenuTrigger Platform.OS:', Platform.OS);
  console.log('ContextMenuTrigger typeof window:', typeof window);
  console.log('ContextMenuTrigger navigator:', typeof navigator !== 'undefined' ? navigator.userAgent : 'no navigator');
  
  // Force web detection
  // Native - wrap children with native context menu view (but make it transparent)
  const menuItemsData = _menuItems.map(item => ({
    label: item.label,
    destructive: item.destructive || false,
    disabled: item.disabled || false,
    icon: item.icon || '',
    iosIcon: item.iosIcon || '',
    androidIcon: item.androidIcon || '',
  }));

  return (
    <NativeContextMenuView
      menuItems={menuItemsData}
      onItemPress={handleItemPress}
      onMenuOpen={handleMenuOpen}
      onMenuClose={handleMenuClose}
      {...rest}
      style={[
        { backgroundColor: 'transparent' },
        rest.style
      ]}
    >
      {children}
    </NativeContextMenuView>
  );
});

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

/**
 * ContextMenuContent - container for menu items
 * On native: renders children invisibly to collect menu items via context
 */
export const ContextMenuContent = React.forwardRef<any, ContextMenuContentProps>((props, ref) => {
  const { children } = props;
  
  // On native, just render children invisibly to collect menu items
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
  const { registerMenuItem } = useContextMenu();

  // Extract text label from children
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

  // Register menu item on mount
  React.useEffect(() => {
    if (label) {
      registerMenuItem({ label, onPress, destructive, disabled, icon, iosIcon, androidIcon });
    }
  }, [label, onPress, destructive, disabled, icon, iosIcon, androidIcon, registerMenuItem]);

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
        {icon && <span>{icon}</span>}
        {children}
      </div>
    );
  }

  // On native, items are not rendered visually but are registered
  return null;
});

ContextMenuItem.displayName = 'ContextMenuItem';

/**
 * ContextMenuSeparator - visual separator (native menus don't support separators)
 */
export const ContextMenuSeparator = React.forwardRef<any, ContextMenuSeparatorProps>((props, ref) => {
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
  
  // Separators are not shown in native menus
  return null;
});

ContextMenuSeparator.displayName = 'ContextMenuSeparator';
