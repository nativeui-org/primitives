export type NativeUiOrgTabsViewProps = {
  tabs: Array<{ value: string; label: string; icon?: string }>; // icon is SF Symbol name for iOS, resource name for Android
  selectedValue: string;
  onValueChange?: (event: { nativeEvent: { value: string } }) => void;
  style?: any;
  children?: React.ReactNode;
  // Customization props
  variant?: 'default' | 'compact' | 'minimal';
  alignment?: 'left' | 'center' | 'right';
  chevronIcon?: string; // SF Symbol name for iOS
  showChevron?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  cornerRadius?: number;
};

