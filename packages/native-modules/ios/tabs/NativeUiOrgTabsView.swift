import ExpoModulesCore
import UIKit

// Tabs view with native iOS button and dropdown menu - fully customizable
public class NativeUiOrgTabsView: ExpoView {
  let onValueChange = EventDispatcher()
  
  private var tabs: [[String: Any]] = []
  private var selectedValue: String = ""
  private var button: UIButton?
  private var containerView: UIView?
  private var chevronImageView: UIImageView?
  
  // Customization properties
  private var variant: String = "default"
  private var alignment: String = "left"
  private var chevronIcon: String = "chevron.down"
  private var showChevron: Bool = true
  private var customBackgroundColor: String?
  private var textColor: String?
  private var customBorderColor: String?
  private var cornerRadius: Double = 10
  
  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupView()
  }
  
  private func setupView() {
    backgroundColor = UIColor.clear
    
    // Create container view - no default styling, completely unstyled
    let container = UIView()
    container.translatesAutoresizingMaskIntoConstraints = false
    container.backgroundColor = UIColor.clear
    
    self.containerView = container
    addSubview(container)
    
    // Create button - minimal setup, no default styling
    let button = UIButton(type: .system)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.backgroundColor = UIColor.clear
    
    // Use UIButton.Configuration for modern iOS styling (iOS 15+)
    if #available(iOS 15.0, *) {
      var config = UIButton.Configuration.plain()
      
      // Set alignment
      switch alignment {
      case "center":
        config.titleAlignment = .center
      case "right":
        config.titleAlignment = .trailing
      default:
        config.titleAlignment = .leading
      }
      
      button.configuration = config
    } else {
      // Fallback for iOS 14 and earlier
      // Set alignment
      switch alignment {
      case "center":
        button.contentHorizontalAlignment = .center
      case "right":
        button.contentHorizontalAlignment = .right
      default:
        button.contentHorizontalAlignment = .leading
      }
    }
    
    // Add chevron icon if needed
    if showChevron {
      let chevronImage = UIImage(systemName: chevronIcon)?.withRenderingMode(.alwaysTemplate)
      let chevronView = UIImageView(image: chevronImage)
      chevronView.tintColor = .tertiaryLabel
      chevronView.translatesAutoresizingMaskIntoConstraints = false
      chevronView.contentMode = .scaleAspectFit
      button.addSubview(chevronView)
      self.chevronImageView = chevronView
    }
    
    // Setup menu directly on button for immediate response
    setupMenu()
    
    self.button = button
    container.addSubview(button)
    
    // Layout constraints - button fills container, container fills view
    // Use content hugging and compression resistance to allow auto-sizing
    container.setContentHuggingPriority(.defaultHigh, for: .horizontal)
    container.setContentCompressionResistancePriority(.defaultHigh, for: .horizontal)
    
    NSLayoutConstraint.activate([
      container.topAnchor.constraint(equalTo: topAnchor),
      container.leadingAnchor.constraint(equalTo: leadingAnchor),
      container.trailingAnchor.constraint(lessThanOrEqualTo: trailingAnchor), // Allow smaller than parent
      container.bottomAnchor.constraint(equalTo: bottomAnchor),
      
      button.topAnchor.constraint(equalTo: container.topAnchor),
      button.leadingAnchor.constraint(equalTo: container.leadingAnchor),
      button.trailingAnchor.constraint(equalTo: container.trailingAnchor),
      button.bottomAnchor.constraint(equalTo: container.bottomAnchor),
    ])
    
    // Chevron constraints if it exists
    if let chevronView = chevronImageView {
      NSLayoutConstraint.activate([
        chevronView.centerYAnchor.constraint(equalTo: button.centerYAnchor),
        chevronView.trailingAnchor.constraint(equalTo: button.trailingAnchor, constant: -16),
        chevronView.widthAnchor.constraint(equalToConstant: 12),
        chevronView.heightAnchor.constraint(equalToConstant: 12)
      ])
    }
  }
  
  private func setupMenu() {
    guard let button = button, tabs.count > 0 else { return }
    
    // Create menu actions from tabs with SF Symbols
    var actions: [UIAction] = []
    
    for tab in tabs {
      guard let label = tab["label"] as? String,
            let value = tab["value"] as? String else { continue }
      
      let isSelected = value == selectedValue
      
      // Get SF Symbol icon if provided
      var icon: UIImage? = nil
      if let iconName = tab["icon"] as? String, !iconName.isEmpty {
        icon = UIImage(systemName: iconName)
      } else if isSelected {
        icon = UIImage(systemName: "checkmark")
      }
      
      let action = UIAction(
        title: label,
        image: icon,
        attributes: isSelected ? [] : []
      ) { [weak self] _ in
        self?.onValueChange(["value": value])
      }
      
      actions.append(action)
    }
    
    // Create menu and attach directly to button
    let menu = UIMenu(title: "", children: actions)
    
    // Show menu using UIMenu (iOS 14+)
    if #available(iOS 14.0, *) {
      button.menu = menu
      button.showsMenuAsPrimaryAction = true
    }
  }
  
  // Removed touch effects - let the button handle its own interactions
  
  // Update tabs from JS
  public func setTabs(_ items: [[String: Any]]) {
    self.tabs = items
    updateButtonTitle()
    setupMenu() // Update menu when tabs change
  }
  
  // Update selected value from JS
  public func setSelectedValue(_ value: String) {
    self.selectedValue = value
    updateButtonTitle()
    setupMenu() // Update menu when selection changes
  }
  
  // Customization setters
  public func setVariant(_ variant: String) {
    self.variant = variant
    updateStyles()
  }
  
  public func setAlignment(_ alignment: String) {
    self.alignment = alignment
    guard let button = button else { return }
    
    if #available(iOS 15.0, *) {
      var config = button.configuration ?? UIButton.Configuration.plain()
      switch alignment {
      case "center":
        config.titleAlignment = .center
      case "right":
        config.titleAlignment = .trailing
      default:
        config.titleAlignment = .leading
      }
      button.configuration = config
    } else {
      // Fallback for iOS 14 and earlier
      switch alignment {
      case "center":
        button.contentHorizontalAlignment = .center
      case "right":
        button.contentHorizontalAlignment = .right
      default:
        button.contentHorizontalAlignment = .leading
      }
    }
  }
  
  public func setChevronIcon(_ icon: String) {
    self.chevronIcon = icon
    let chevronImage = UIImage(systemName: icon)?.withRenderingMode(.alwaysTemplate)
    chevronImageView?.image = chevronImage
  }
  
  public func setShowChevron(_ show: Bool) {
    self.showChevron = show
    
    if show && chevronImageView == nil {
      // Add chevron if it doesn't exist
      let chevronImage = UIImage(systemName: chevronIcon)?.withRenderingMode(.alwaysTemplate)
      let chevronView = UIImageView(image: chevronImage)
      chevronView.tintColor = .tertiaryLabel
      chevronView.translatesAutoresizingMaskIntoConstraints = false
      chevronView.contentMode = .scaleAspectFit
      button?.addSubview(chevronView)
      self.chevronImageView = chevronView
      
      NSLayoutConstraint.activate([
        chevronView.centerYAnchor.constraint(equalTo: button!.centerYAnchor),
        chevronView.trailingAnchor.constraint(equalTo: button!.trailingAnchor, constant: -16),
        chevronView.widthAnchor.constraint(equalToConstant: 12),
        chevronView.heightAnchor.constraint(equalToConstant: 12)
      ])
    } else {
      chevronImageView?.isHidden = !show
    }
  }
  
  public func setBackgroundColor(_ color: String?) {
    self.customBackgroundColor = color
    updateStyles()
  }
  
  public func setTextColor(_ color: String?) {
    self.textColor = color
    updateStyles()
  }
  
  public func setBorderColor(_ color: String?) {
    self.customBorderColor = color
    updateStyles()
  }
  
  public func setCornerRadius(_ radius: Double) {
    self.cornerRadius = radius
    containerView?.layer.cornerRadius = CGFloat(radius)
  }
  
  private func updateStyles() {
    guard let container = containerView, let button = button else { return }
    
    // Update background color - only if provided, otherwise transparent
    if let bgColor = customBackgroundColor, let color = hexStringToUIColor(bgColor) {
      container.backgroundColor = color
    } else {
      container.backgroundColor = UIColor.clear
    }
    
    // Update text color - only if provided
    if let txtColor = textColor, let color = hexStringToUIColor(txtColor) {
      if #available(iOS 15.0, *) {
        var config = button.configuration ?? UIButton.Configuration.plain()
        config.baseForegroundColor = color
        button.configuration = config
      } else {
        button.setTitleColor(color, for: .normal)
      }
    }
    
    // Update border color and width - only if provided
    if let brdColor = customBorderColor, let color = hexStringToUIColor(brdColor) {
      container.layer.borderColor = color.cgColor
      container.layer.borderWidth = 0.5
    } else {
      container.layer.borderWidth = 0
    }
    
    // Update corner radius
    container.layer.cornerRadius = CGFloat(cornerRadius)
    container.layer.masksToBounds = cornerRadius > 0
  }
  
  private func hexStringToUIColor(_ hex: String) -> UIColor? {
    var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
    
    var rgb: UInt64 = 0
    guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else { return nil }
    
    let r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
    let g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
    let b = CGFloat(rgb & 0x0000FF) / 255.0
    
    return UIColor(red: r, green: g, blue: b, alpha: 1.0)
  }
  
  private func updateButtonTitle() {
    guard let button = button else { return }
    
    let selectedTab = tabs.first { tab in
      guard let tabValue = tab["value"] as? String else { return false }
      return tabValue == selectedValue
    }
    
    let title = selectedTab?["label"] as? String ?? tabs.first?["label"] as? String ?? "Select"
    
    if #available(iOS 15.0, *) {
      var config = button.configuration ?? UIButton.Configuration.plain()
      config.title = title
      button.configuration = config
    } else {
      // Fallback for iOS 14 and earlier
      button.setTitle(title, for: .normal)
    }
  }
  
  // Removed buttonTapped - menu is now handled directly via showsMenuAsPrimaryAction
  
  private func findViewController() -> UIViewController? {
    var responder: UIResponder? = self
    while responder != nil {
      responder = responder?.next
      if let viewController = responder as? UIViewController {
        return viewController
      }
    }
    return nil
  }
}
