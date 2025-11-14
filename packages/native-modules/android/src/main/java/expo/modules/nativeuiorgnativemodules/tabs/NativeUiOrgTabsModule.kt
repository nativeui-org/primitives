package expo.modules.nativeuiorgnativemodules.tabs

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NativeUiOrgTabsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeUiOrgTabs")

    // Define the native view component
    View(NativeUiOrgTabsView::class) {
      // Props
      Prop("tabs") { view: NativeUiOrgTabsView, items: List<Map<String, Any>> ->
        view.setTabs(items)
      }
      
      Prop("selectedValue") { view: NativeUiOrgTabsView, value: String ->
        view.setSelectedValue(value)
      }
      
      // Events
      Events("onValueChange")
    }
  }
}

