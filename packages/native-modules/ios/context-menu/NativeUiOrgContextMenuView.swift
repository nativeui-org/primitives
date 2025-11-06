import ExpoModulesCore
import UIKit
import Foundation

// Context menu view with native UIContextMenuInteraction
public class NativeUiOrgContextMenuView: ExpoView, UIContextMenuInteractionDelegate {
  let onMenuOpen = EventDispatcher()
  let onMenuClose = EventDispatcher()
  let onItemPress = EventDispatcher()
  
  private var menuItems: [[String: Any]] = []
  private var interaction: UIContextMenuInteraction?

  public required init(appContext: AppContext? = nil) {
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
  public func setMenuItems(_ items: [[String: Any]]) {
    self.menuItems = items
    // Debug: print menu items structure
    #if DEBUG
    print("🔍 NativeUiOrgContextMenu: Received \(items.count) menu items")
    for (index, item) in items.enumerated() {
      if let label = item["label"] as? String {
        if let submenu = item["submenu"] as? [[String: Any]], !submenu.isEmpty {
          print("  Item \(index): \(label) - HAS SUBMENU with \(submenu.count) items")
        } else {
          print("  Item \(index): \(label) - NO SUBMENU")
        }
      }
    }
    #endif
  }
  
  // MARK: - UIContextMenuInteractionDelegate
  
  @available(iOS 13.0, *)
  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    configurationForMenuAtLocation location: CGPoint
  ) -> UIContextMenuConfiguration? {
    return UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { _ in
      self.createMenu()
    }
  }
  
  @available(iOS 13.0, *)
  public func contextMenuInteraction(
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
  public func contextMenuInteraction(
    _ interaction: UIContextMenuInteraction,
    willEndFor configuration: UIContextMenuConfiguration,
    animator: UIContextMenuInteractionAnimating?
  ) {
    onMenuClose([:])
  }
  
  @available(iOS 13.0, *)
  private func createMenu() -> UIMenu {
    var elements: [UIMenuElement] = []
    var currentGroup: [UIMenuElement] = []
    
    for (index, item) in menuItems.enumerated() {
      // Check if this is a separator (empty label and isSeparator flag)
      let isSeparator = item["isSeparator"] as? Bool ?? false
      if isSeparator {
        // When we hit a separator, add current group as a menu and start a new group
        if !currentGroup.isEmpty {
          let groupMenu = UIMenu(title: "", options: .displayInline, children: currentGroup)
          elements.append(groupMenu)
          currentGroup = []
        }
        continue
      }
      
      guard let title = item["label"] as? String, !title.isEmpty else { continue }
      
      let isDestructive = item["destructive"] as? Bool ?? false
      let isDisabled = item["disabled"] as? Bool ?? false
      let iconName = item["iosIcon"] as? String
      
      // Check if this item has a submenu
      // Try multiple ways to extract the submenu array
      var submenuArray: [[String: Any]]? = nil
      
      if let submenuRaw = item["submenu"] {
        #if DEBUG
        print("🔍 Item '\(title)' has submenu property: \(type(of: submenuRaw))")
        #endif
        
        // Try direct cast first
        if let directCast = submenuRaw as? [[String: Any]] {
          submenuArray = directCast
          #if DEBUG
          print("  ✅ Direct cast successful: \(directCast.count) items")
          #endif
        }
        // Try casting from NSArray
        else if let nsArray = submenuRaw as? NSArray {
          var converted: [[String: Any]] = []
          for element in nsArray {
            if let dict = element as? [String: Any] {
              converted.append(dict)
            } else if let nsDict = element as? NSDictionary {
              var swiftDict: [String: Any] = [:]
              for (key, value) in nsDict {
                if let keyString = key as? String {
                  swiftDict[keyString] = value
                }
              }
              converted.append(swiftDict)
            }
          }
          if !converted.isEmpty {
            submenuArray = converted
            #if DEBUG
            print("  ✅ NSArray conversion successful: \(converted.count) items")
            #endif
          } else {
            #if DEBUG
            print("  ❌ Failed to extract submenu array from NSArray")
            #endif
          }
        } else {
          #if DEBUG
          print("  ❌ Failed to extract submenu array")
          #endif
        }
      }
      
      if let submenuArray = submenuArray, !submenuArray.isEmpty {
        // Create a submenu
        #if DEBUG
        print("✅ Creating submenu for '\(title)' with \(submenuArray.count) items")
        #endif
        var submenuActions: [UIMenuElement] = []
        
        for (subIndex, subItem) in submenuArray.enumerated() {
          guard let subTitle = subItem["label"] as? String else { continue }
          
          let subIsDestructive = subItem["destructive"] as? Bool ?? false
          let subIsDisabled = subItem["disabled"] as? Bool ?? false
          let subIconName = subItem["iosIcon"] as? String
          
          var subAttributes: UIMenuElement.Attributes = []
          if subIsDisabled {
            subAttributes.insert(.disabled)
          }
          if subIsDestructive {
            subAttributes.insert(.destructive)
          }
          
          var subImage: UIImage? = nil
          if let subIconName = subIconName, !subIconName.isEmpty {
            subImage = UIImage(systemName: subIconName)
          }
          
          let subAction = UIAction(
            title: subTitle,
            image: subImage,
            attributes: subAttributes
          ) { [weak self] _ in
            // Use a composite index: parentIndex_subIndex
            self?.onItemPress(["index": "\(index)_\(subIndex)", "label": subTitle])
          }
          
          submenuActions.append(subAction)
        }
        
        var attributes: UIMenuElement.Attributes = []
        if isDisabled {
          attributes.insert(.disabled)
        }
        
        var image: UIImage? = nil
        if let iconName = iconName, !iconName.isEmpty {
          image = UIImage(systemName: iconName)
        }
        
        // Create a UIMenu (submenu) instead of UIAction
        let submenu = UIMenu(
          title: title,
          image: image,
          identifier: nil,
          options: [],
          children: submenuActions
        )
        
        currentGroup.append(submenu)
      } else {
        // Regular menu item
        var attributes: UIMenuElement.Attributes = []
        if isDisabled {
          attributes.insert(.disabled)
        }
        if isDestructive {
          attributes.insert(.destructive)
        }
        
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
        
        currentGroup.append(action)
      }
    }
    
    // Add remaining group
    if !currentGroup.isEmpty {
      let groupMenu = UIMenu(title: "", options: .displayInline, children: currentGroup)
      elements.append(groupMenu)
    }
    
    return UIMenu(title: "", children: elements)
  }
}

