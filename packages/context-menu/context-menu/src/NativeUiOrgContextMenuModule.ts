import { NativeModule, requireNativeModule } from 'expo';

import { NativeUiOrgContextMenuModuleEvents } from './NativeUiOrgContextMenu.types';

declare class NativeUiOrgContextMenuModule extends NativeModule<NativeUiOrgContextMenuModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<NativeUiOrgContextMenuModule>('NativeUiOrgContextMenu');
