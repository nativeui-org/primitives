import ExpoModulesCore
import UIKit

// Context menu view with native UIContextMenuInteraction
class NativeUiOrgContextMenuView: ExpoView, UIContextMenuInteractionDelegate {
  let onMenuOpen = EventDispatcher()
  let onMenuClose = EventDispatcher()
  let onItemPress = EventDispatcher()
  
  private var menuItems: [[String: Any]] = []
  private var interaction: UIContextMenuInteraction?

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupView()
  }
  
  private func setupView() {
    // Make completely transparent
    backgroundColor = UIColor.clear
    
    // Add context menu interaction for iOS 13+
    if #available(iOS 13.0, *) {
      let interaction = UIContextMenuInteraction(delegate: self)
      addInteraction(interaction)
      self.interaction = interaction
    }
  }
  
  // Update menu items from JS
  func setMenuItems(_ items: [[String: Any]]) {
    self.menuItems = items
  }
  
  // MARK: - UIContextMenuInteractionDelegate
  
  @available(iOS 13.0, *)
  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configurationForMenuAtLocation location: CGPoint
  ) -> UIContextMenuConfiguration? {
    return UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { _ in
      self.createMenu()
    }
  }
  
  @available(iOS 13.0, *)
  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willDisplayMenuFor configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionAnimating?
  ) {
    // Haptic feedback
    let generator = UIImpactFeedbackGenerator(style: .medium)
    generator.impactOccurred()
    
    onMenuOpen([:])
  }
  
  @available(iOS 13.0, *)
  func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willEndFor configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionAnimating?
  ) {
    onMenuClose([:])
  }
  
  @available(iOS 13.0, *)
  private func createMenu() -> UIMenu {
    var actions: [UIMenuElement] = []
    
    for (index, item) in menuItems.enumerated() {
      guard let title = item["label"] as? String else { continue }
      
      let isDestructive = item["destructive"] as? Bool ?? false
      let isDisabled = item["disabled"] as? Bool ?? false
      let iconName = item["iosIcon"] as? String
      
      var attributes: UIMenuElement.Attributes = []
      if isDisabled {
        attributes.insert(.disabled)
      }
      if isDestructive {
        attributes.insert(.destructive)
      }
      
      // Use SF Symbol if provided
      var image: UIImage? = nil
      if let iconName = iconName, !iconName.isEmpty {
        image = UIImage(systemName: iconName)
      }
      
      let action = UIAction(
        title: title,
        image: image,
        attributes: attributes
      ) { [weak self] _ in
        self?.onItemPress(["index": index, "label": title])
      }
      
      actions.append(action)
    }
    
    return UIMenu(title: "", children: actions)
  }
}
