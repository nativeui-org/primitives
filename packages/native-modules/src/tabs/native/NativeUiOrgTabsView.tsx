import { Platform } from 'react-native';
import * as React from 'react';

import type { NativeUiOrgTabsViewProps } from '../types/NativeUiOrgTabs.types';

let NativeView: React.ComponentType<Record<string, unknown>> | null = null;

if (Platform.OS !== 'web') {
  const { requireNativeView } = require('expo');
  NativeView = requireNativeView('NativeUiOrgTabs') as React.ComponentType<Record<string, unknown>>;
}

export default function NativeUiOrgTabsView(props: NativeUiOrgTabsViewProps) {
  if (Platform.OS === 'web' || !NativeView) {
    return null;
  }

  const formattedTabs = React.useMemo(() => {
    return props.tabs.map(tab => ({
      value: String(tab.value || ''),
      label: String(tab.label || ''),
      icon: tab.icon ? String(tab.icon) : undefined,
    }));
  }, [props.tabs]);

  return (
    <NativeView
      {...props}
      tabs={formattedTabs}
      selectedValue={String(props.selectedValue || '')}
      variant={props.variant}
      alignment={props.alignment}
      chevronIcon={props.chevronIcon}
      showChevron={props.showChevron !== false}
      backgroundColor={props.backgroundColor}
      textColor={props.textColor}
      borderColor={props.borderColor}
      cornerRadius={props.cornerRadius}
      style={[
        {
          minHeight: 44, // Ensure minimum touch target size
          height: 44,
        },
        props.style,
      ]}
      // Allow the view to size itself based on content if width is not specified
      {...(props.style?.width ? {} : { alignSelf: 'flex-start' as any })}
    >
      {props.children}
    </NativeView>
  );
}

