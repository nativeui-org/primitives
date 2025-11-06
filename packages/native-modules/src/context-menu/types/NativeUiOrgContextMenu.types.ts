import type { StyleProp, ViewStyle } from 'react-native';

export type MenuItemData = {
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  icon?: string;
  iosIcon?: string;
  androidIcon?: string;
  submenu?: MenuItemData[];
  isSeparator?: boolean;
  isSection?: boolean;
  sectionTitle?: string;
};

export type NativeUiOrgContextMenuModuleEvents = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onItemPress: (event: { nativeEvent: { index: number | string; label: string } }) => void;
};

export type NativeUiOrgContextMenuViewProps = {
  menuItems: MenuItemData[];
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onItemPress?: (event: { nativeEvent: { index: number | string; label: string } }) => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

