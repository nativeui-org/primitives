package expo.modules.nativeuiorgnativemodules

import android.content.Context
import android.view.GestureDetector
import android.view.MotionEvent
import android.view.View
import android.widget.PopupMenu
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

/**
 * Native view for iOS context menu (not used on Android)
 */
class NativeUiOrgContextMenuView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onMenuOpen by EventDispatcher()
  private val onMenuClose by EventDispatcher()
  private val onItemPress by EventDispatcher()
  
  private var menuItems: List<Map<String, Any>> = emptyList()
  
  fun setMenuItems(items: List<Map<String, Any>>) {
    this.menuItems = items
  }
}

