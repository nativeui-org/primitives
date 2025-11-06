package expo.modules.nativeuiorgnativemodules

import android.content.Context
import android.text.SpannableString
import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import android.view.Menu
import android.view.MenuItem
import android.view.MotionEvent
import android.view.GestureDetector
import android.widget.PopupMenu
import androidx.core.content.ContextCompat
import androidx.core.view.MenuCompat
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class NativeUiOrgContextMenuView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onMenuOpen by EventDispatcher()
  private val onMenuClose by EventDispatcher()
  private val onItemPress by EventDispatcher()

  private var menuItems: List<Map<String, Any?>> = emptyList()
  private var popupMenu: PopupMenu? = null
  private var nextMenuItemId: Int = 1
  private val pathToId = mutableMapOf<String, Int>()
  private val idToPath = mutableMapOf<Int, String>()
  private val gestureDetector = GestureDetector(context, object : GestureDetector.SimpleOnGestureListener() {
    override fun onLongPress(e: MotionEvent) {
      performLongClick()
    }
  })

  init {
    isClickable = true
    isLongClickable = true
  }

  fun setMenuItems(items: List<Map<String, Any>>) {
    menuItems = items.map { HashMap(it) }
  }

  private fun assignId(path: String): Int {
    pathToId[path]?.let { return it }
    val id = nextMenuItemId++
    pathToId[path] = id
    idToPath[id] = path
    return id
  }

  private fun resetIds() {
    nextMenuItemId = 1
    pathToId.clear()
    idToPath.clear()
  }

  private fun showPopupMenu() {
    if (menuItems.isEmpty()) {
      return
    }

    popupMenu?.dismiss()
    resetIds()

    val popup = PopupMenu(context, this)
    MenuCompat.setGroupDividerEnabled(popup.menu, true)
    populateMenu(popup.menu, menuItems, "")
    forceShowIcons(popup)

    popup.setOnMenuItemClickListener { menuItem ->
      val path = idToPath[menuItem.itemId]
      if (path != null) {
        val label = menuItem.title?.toString() ?: ""
        onItemPress(mapOf("index" to path, "label" to label))
      }
      true
    }

    popup.setOnDismissListener {
      onMenuClose(mapOf())
    }

    popup.show()
    popupMenu = popup
    onMenuOpen(mapOf())
  }

  private fun populateMenu(menu: Menu, items: List<Map<String, Any?>>, parentPath: String) {
    items.forEachIndexed { index, item ->
      val path = if (parentPath.isEmpty()) index.toString() else "${parentPath}_${index}"
      val isSeparator = item["isSeparator"] as? Boolean ?: false
      if (isSeparator) {
        val divider = menu.add(Menu.NONE, assignId("$path-separator"), Menu.NONE, "──────────")
        divider.isEnabled = false
        return@forEachIndexed
      }

      val isSection = item["isSection"] as? Boolean ?: false
      val submenuItems = (item["submenu"] as? List<*>)?.mapNotNull { it as? Map<String, Any?> } ?: emptyList()
      val label = item["label"] as? String ?: ""
      val disabled = item["disabled"] as? Boolean ?: false
      val destructive = item["destructive"] as? Boolean ?: false

      if (isSection && submenuItems.isNotEmpty()) {
        val headerTitle = (item["sectionTitle"] as? String)?.takeIf { it.isNotEmpty() } ?: label
        val headerItem = menu.add(Menu.NONE, assignId("$path-header"), Menu.NONE, headerTitle)
        headerItem.isEnabled = false
        applySectionStyle(headerItem)
        populateMenu(menu, submenuItems, path)
        return@forEachIndexed
      }

      if (submenuItems.isNotEmpty()) {
        val subMenu = menu.addSubMenu(Menu.NONE, assignId(path), Menu.NONE, label)
        subMenu.item.isEnabled = !disabled
        setMenuItemIcon(subMenu.item, item)
        if (destructive) {
          applyDestructiveStyle(subMenu.item)
        }
        populateMenu(subMenu, submenuItems, path)
        return@forEachIndexed
      }

      val menuItem = menu.add(Menu.NONE, assignId(path), Menu.NONE, label)
      menuItem.isEnabled = !disabled
      setMenuItemIcon(menuItem, item)
      if (destructive) {
        applyDestructiveStyle(menuItem)
      }
    }
  }

  private fun setMenuItemIcon(menuItem: MenuItem, item: Map<String, Any?>) {
    val iconName = when {
      (item["androidIcon"] as? String)?.isNotEmpty() == true -> item["androidIcon"] as? String
      (item["icon"] as? String)?.isNotEmpty() == true -> item["icon"] as? String
      else -> null
    }?.trim()

    if (iconName.isNullOrEmpty()) {
      return
    }

    val resourceId = context.resources.getIdentifier(iconName, "drawable", context.packageName)
    if (resourceId != 0) {
      val drawable = ContextCompat.getDrawable(context, resourceId)
      menuItem.icon = drawable
    }
  }

  private fun applyDestructiveStyle(menuItem: MenuItem) {
    val title = menuItem.title?.toString() ?: return
    val spannable = SpannableString(title)
    spannable.setSpan(ForegroundColorSpan(0xFFEF4444.toInt()), 0, spannable.length, 0)
    menuItem.title = spannable
  }

  private fun applySectionStyle(menuItem: MenuItem) {
    val title = menuItem.title?.toString() ?: return
    val spannable = SpannableString(title.uppercase())
    spannable.setSpan(StyleSpan(android.graphics.Typeface.BOLD), 0, spannable.length, 0)
    spannable.setSpan(ForegroundColorSpan(0xFF666666.toInt()), 0, spannable.length, 0)
    menuItem.title = spannable
  }

  private fun forceShowIcons(popupMenu: PopupMenu) {
    try {
      val method = PopupMenu::class.java.getDeclaredMethod("setForceShowIcon", Boolean::class.java)
      method.isAccessible = true
      method.invoke(popupMenu, true)
    } catch (_: Exception) {
      // Ignore - not all Android versions require this
    }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    popupMenu?.dismiss()
    popupMenu = null
  }

  override fun dispatchTouchEvent(ev: MotionEvent): Boolean {
    gestureDetector.onTouchEvent(ev)
    return super.dispatchTouchEvent(ev)
  }

  override fun performLongClick(): Boolean {
    showPopupMenu()
    return true
  }
}

