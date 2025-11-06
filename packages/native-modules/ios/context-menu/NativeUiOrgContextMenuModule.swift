import ExpoModulesCore

public class NativeUiOrgContextMenuModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NativeUiOrgContextMenu")

    // Define the native view component
    View(NativeUiOrgContextMenuView.self) {
      // Props
      Prop("menuItems") { (view: NativeUiOrgContextMenuView, items: [[String: Any]]) in
        view.setMenuItems(items)
      }
      
      // Events
      Events("onMenuOpen", "onMenuClose", "onItemPress")
    }
  }
}

