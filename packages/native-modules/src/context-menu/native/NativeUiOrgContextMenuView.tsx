import { Platform } from 'react-native';
import * as React from 'react';

import type { NativeUiOrgContextMenuViewProps } from '../types/NativeUiOrgContextMenu.types';

let NativeView: React.ComponentType<Record<string, unknown>> | null = null;

if (Platform.OS !== 'web') {
  const { requireNativeView } = require('expo');
  NativeView = requireNativeView('NativeUiOrgContextMenu') as React.ComponentType<Record<string, unknown>>;
}

export default function NativeUiOrgContextMenuView(props: NativeUiOrgContextMenuViewProps) {
  if (Platform.OS === 'web' || !NativeView) {
    return null;
  }
  // Ensure menuItems is properly formatted
  const menuItems = React.useMemo(() => {
    const formatted = props.menuItems.map(item => {
      // Ensure submenu is properly formatted as an array
      let submenu: Array<Record<string, unknown>> = [];
      if (item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0) {
        submenu = item.submenu.map(subItem => ({
          label: String(subItem.label || ''),
          destructive: Boolean(subItem.destructive),
          disabled: Boolean(subItem.disabled),
          icon: String(subItem.icon || ''),
          iosIcon: String(subItem.iosIcon || ''),
          androidIcon: String(subItem.androidIcon || ''),
          isSeparator: Boolean(subItem.isSeparator),
          isSection: Boolean(subItem.isSection),
          sectionTitle: String(subItem.sectionTitle || ''),
        }));
      }
      
      const formattedItem = {
        label: String(item.label || ''),
        destructive: Boolean(item.destructive),
        disabled: Boolean(item.disabled),
        icon: String(item.icon || ''),
        iosIcon: String(item.iosIcon || ''),
        androidIcon: String(item.androidIcon || ''),
        isSeparator: Boolean(item.isSeparator),
        isSection: Boolean(item.isSection),
        sectionTitle: String(item.sectionTitle || ''),
        submenu: submenu, // Always include submenu, even if empty
      };
      
      return formattedItem;
    });
    return formatted;
  }, [props.menuItems]);

  return (
    <NativeView
      {...props}
      menuItems={menuItems}
    >
      {props.children}
    </NativeView>
  );
}

