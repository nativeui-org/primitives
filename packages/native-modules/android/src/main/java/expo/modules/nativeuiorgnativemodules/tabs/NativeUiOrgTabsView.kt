package expo.modules.nativeuiorgnativemodules.tabs

import android.content.Context
import android.graphics.BlurMaskFilter
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.PopupMenu
import androidx.core.content.ContextCompat
import androidx.core.view.MenuCompat
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

class NativeUiOrgTabsView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val onValueChange by EventDispatcher()
  
  private var tabs: List<Map<String, Any?>> = emptyList()
  private var selectedValue: String = ""
  private var button: Button? = null
  private var popupMenu: PopupMenu? = null
  
  init {
    setupView()
  }
  
  private fun setupView() {
    // Create button with liquid glass style
    val button = Button(context)
    button.layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    )
    
    // Set liquid glass style
    val background = GradientDrawable().apply {
      shape = GradientDrawable.RECTANGLE
      cornerRadius = 24f
      setColor(0x80FFFFFF.toInt()) // Semi-transparent white
      setStroke(1, 0x40FFFFFF.toInt()) // Subtle border
    }
    
    button.background = background
    button.textSize = 16f
    button.setTextColor(ContextCompat.getColor(context, android.R.color.black))
    button.gravity = Gravity.CENTER_VERTICAL or Gravity.START
    button.setPadding(48, 32, 48, 32)
    button.isAllCaps = false
    
    // Add chevron icon (using text for simplicity)
    button.compoundDrawablePadding = 16
    
    button.setOnClickListener {
      showPopupMenu()
    }
    
    this.button = button
    addView(button)
  }
  
  fun setTabs(items: List<Map<String, Any>>) {
    tabs = items.map { HashMap(it) }
    updateButtonTitle()
  }
  
  fun setSelectedValue(value: String) {
    selectedValue = value
    updateButtonTitle()
  }
  
  private fun updateButtonTitle() {
    val selectedTab = tabs.firstOrNull { tab ->
      (tab["value"] as? String) == selectedValue
    }
    
    val title = (selectedTab?["label"] as? String) 
      ?: (tabs.firstOrNull()?["label"] as? String) 
      ?: "Select"
    
    button?.text = "$title ▼"
  }
  
  private fun showPopupMenu() {
    if (tabs.isEmpty()) {
      return
    }
    
    popupMenu?.dismiss()
    
    val popup = PopupMenu(context, button ?: this)
    MenuCompat.setGroupDividerEnabled(popup.menu, true)
    
    tabs.forEachIndexed { index, tab ->
      val label = tab["label"] as? String ?: ""
      val value = tab["value"] as? String ?: ""
      val isSelected = value == selectedValue
      
      val menuItem = popup.menu.add(0, index, 0, label)
      menuItem.isCheckable = true
      menuItem.isChecked = isSelected
    }
    
    popup.setOnMenuItemClickListener { menuItem ->
      val index = menuItem.itemId
      if (index >= 0 && index < tabs.size) {
        val tab = tabs[index]
        val value = tab["value"] as? String ?: ""
        onValueChange(mapOf("value" to value))
      }
      true
    }
    
    popup.setOnDismissListener {
      popupMenu = null
    }
    
    popup.show()
    popupMenu = popup
  }
  
  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    popupMenu?.dismiss()
    popupMenu = null
  }
}

