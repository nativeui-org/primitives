import { registerWebModule, NativeModule } from 'expo';

import { NativeUiOrgContextMenuModuleEvents } from './NativeUiOrgContextMenu.types';

class NativeUiOrgContextMenuModule extends NativeModule<NativeUiOrgContextMenuModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(NativeUiOrgContextMenuModule, 'NativeUiOrgContextMenuModule');
