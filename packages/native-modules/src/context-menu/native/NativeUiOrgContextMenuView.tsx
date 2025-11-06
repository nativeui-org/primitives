import { requireNativeView } from 'expo';
import * as React from 'react';

import { NativeUiOrgContextMenuViewProps } from '../types/NativeUiOrgContextMenu.types';

const NativeView: React.ComponentType<any> =
  requireNativeView('NativeUiOrgContextMenu');

export default function NativeUiOrgContextMenuView(props: NativeUiOrgContextMenuViewProps) {
  // Ensure menuItems is properly formatted
  const menuItems = React.useMemo(() => {
    const formatted = props.menuItems.map(item => {
      // Ensure submenu is properly formatted as an array
      let submenu: any[] = [];
      if (item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0) {
        submenu = item.submenu.map(subItem => ({
          label: String(subItem.label || ''),
          destructive: Boolean(subItem.destructive),
          disabled: Boolean(subItem.disabled),
          icon: String(subItem.icon || ''),
          iosIcon: String(subItem.iosIcon || ''),
          androidIcon: String(subItem.androidIcon || ''),
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
        submenu: submenu, // Always include submenu, even if empty
      };
      
      return formattedItem;
    });
    
    // Debug: log the structure BEFORE sending to native
    if (__DEV__) {
      console.log('🔍 NativeUiOrgContextMenuView: Sending menuItems to native:', JSON.stringify(formatted, null, 2));
      // Also log submenu structure specifically
      formatted.forEach((item, idx) => {
        if (item.submenu && item.submenu.length > 0) {
          console.log(`  ✅ Item ${idx} "${item.label}" has submenu with ${item.submenu.length} items:`, item.submenu.map(s => s.label));
        } else {
          console.log(`  ❌ Item ${idx} "${item.label}" has NO submenu (submenu.length = ${item.submenu?.length || 0})`);
        }
      });
    }
    
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

