import ExpoModulesCore

public class NativeUiOrgTabsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NativeUiOrgTabs")

    // Define the native view component
    View(NativeUiOrgTabsView.self) {
      // Props
      Prop("tabs") { (view: NativeUiOrgTabsView, items: [[String: Any]]) in
        view.setTabs(items)
      }
      
      Prop("selectedValue") { (view: NativeUiOrgTabsView, value: String) in
        view.setSelectedValue(value)
      }
      
      // Customization props
      Prop("variant") { (view: NativeUiOrgTabsView, variant: String) in
        view.setVariant(variant)
      }
      
      Prop("alignment") { (view: NativeUiOrgTabsView, alignment: String) in
        view.setAlignment(alignment)
      }
      
      Prop("chevronIcon") { (view: NativeUiOrgTabsView, icon: String) in
        view.setChevronIcon(icon)
      }
      
      Prop("showChevron") { (view: NativeUiOrgTabsView, show: Bool) in
        view.setShowChevron(show)
      }
      
      Prop("backgroundColor") { (view: NativeUiOrgTabsView, color: String?) in
        view.setBackgroundColor(color)
      }
      
      Prop("textColor") { (view: NativeUiOrgTabsView, color: String?) in
        view.setTextColor(color)
      }
      
      Prop("borderColor") { (view: NativeUiOrgTabsView, color: String?) in
        view.setBorderColor(color)
      }
      
      Prop("cornerRadius") { (view: NativeUiOrgTabsView, radius: Double) in
        view.setCornerRadius(radius)
      }
      
      // Events
      Events("onValueChange")
    }
  }
}

