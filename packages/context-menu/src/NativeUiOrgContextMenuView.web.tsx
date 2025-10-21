import * as React from 'react';

import { NativeUiOrgContextMenuViewProps } from './NativeUiOrgContextMenu.types';

export default function NativeUiOrgContextMenuView(props: NativeUiOrgContextMenuViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
