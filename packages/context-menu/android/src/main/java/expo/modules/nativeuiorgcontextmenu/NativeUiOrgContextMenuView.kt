package expo.modules.nativeuiorgcontextmenu

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.PopupMenu
import androidx.core.content.ContextCompat
import com.google.android.material.R
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class NativeUiOrgContextMenuView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onMenuOpen by EventDispatcher()
  private val onMenuClose by EventDispatcher()
  private val onItemPress by EventDispatcher()
  
  private val contentView = View(context).apply {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
  }
  
  private var menuItems: List<Map<String, Any>> = emptyList()
  private var popupMenu: PopupMenu? = null

  init {
    addView(contentView)
    
    // Set long click listener to show context menu
    contentView.setOnLongClickListener {
      showContextMenu()
      true
    }
  }
  
  fun setMenuItems(items: List<Map<String, Any>>) {
    this.menuItems = items
  }
  
  private fun showContextMenu() {
    if (menuItems.isEmpty()) return
    
    popupMenu?.dismiss()
    
    val popup = PopupMenu(context, contentView)
    popupMenu = popup
    
    // Add menu items
    menuItems.forEachIndexed { index, item ->
      val label = item["label"] as? String ?: return@forEachIndexed
      val isDisabled = item["disabled"] as? Boolean ?: false
      val iconName = item["androidIcon"] as? String
      
      val menuItem = popup.menu.add(0, index, index, label)
      menuItem.isEnabled = !isDisabled
      
      // Add Material Icon if provided
      if (!iconName.isNullOrEmpty()) {
        val iconResId = getMaterialIconResource(iconName)
        if (iconResId != 0) {
          menuItem.setIcon(iconResId)
        }
      }
    }
    
    popup.setOnMenuItemClickListener { menuItem ->
      val index = menuItem.itemId
      val item = menuItems.getOrNull(index)
      val label = item?.get("label") as? String ?: ""
      
      onItemPress(mapOf(
        "index" to index,
        "label" to label
      ))
      true
    }
    
    popup.setOnDismissListener {
      onMenuClose(emptyMap())
    }
    
    onMenuOpen(emptyMap())
    popup.show()
  }
  
  // Map Material Icon names to Android resource IDs
  private fun getMaterialIconResource(iconName: String): Int {
    return when (iconName) {
      "share", "share_outline" -> R.drawable.ic_share
      "edit", "edit_outline", "pencil" -> R.drawable.ic_edit
      "archive", "archive_outline" -> R.drawable.ic_archive
      "download", "download_outline" -> R.drawable.ic_download
      "delete", "trash", "trash_outline" -> R.drawable.ic_delete
      "folder", "folder_outline" -> R.drawable.ic_folder
      "document", "document_outline" -> R.drawable.ic_description
      "copy", "copy_outline" -> R.drawable.ic_content_copy
      "move", "move_outline" -> R.drawable.ic_open_with
      else -> 0 // No icon found
    }
  }
}
