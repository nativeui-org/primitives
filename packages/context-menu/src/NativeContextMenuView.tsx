import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

type NativeContextMenuViewProps = ViewProps & {
  menuItems: Array<{
    label: string;
    destructive: boolean;
    disabled: boolean;
    icon: string;
  }>;
  onItemPress?: (event: any) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  children?: React.ReactNode;
};

const NativeView: React.ComponentType<NativeContextMenuViewProps> =
  requireNativeViewManager('NativeUiOrgContextMenu');

export default NativeView;
