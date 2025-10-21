import { NativeModule, requireNativeModule } from 'expo';

import { NativeUiOrgContextMenuModuleEvents } from '../types/NativeUiOrgContextMenu.types';

declare class NativeUiOrgContextMenuModule extends NativeModule<NativeUiOrgContextMenuModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

export default requireNativeModule<NativeUiOrgContextMenuModule>('NativeUiOrgContextMenu');
