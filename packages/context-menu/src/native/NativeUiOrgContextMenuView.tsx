import { requireNativeView } from 'expo';
import * as React from 'react';

import { NativeUiOrgContextMenuViewProps } from '../types/NativeUiOrgContextMenu.types';

const NativeView: React.ComponentType<NativeUiOrgContextMenuViewProps> =
  requireNativeView('NativeUiOrgContextMenu');

export default function NativeUiOrgContextMenuView(props: NativeUiOrgContextMenuViewProps) {
  return <NativeView {...props} />;
}
