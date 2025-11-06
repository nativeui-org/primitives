package expo.modules.nativeuiorgnativemodules

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NativeUiOrgContextMenuModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeUiOrgContextMenu")

    // Define the native view component (used for iOS)
    View(NativeUiOrgContextMenuView::class) {
      // Props
      Prop("menuItems") { view: NativeUiOrgContextMenuView, items: List<Map<String, Any>> ->
        view.setMenuItems(items)
      }
      
      // Events
      Events("onMenuOpen", "onMenuClose", "onItemPress")
    }
  }
}

