import { Platform, Share as RNShare } from "react-native";

export type ShareOptions = {
  /**
   * The message to share
   */
  message?: string;

  /**
   * The title of the message
   */
  title?: string;

  /**
   * URL to share
   */
  url?: string;
};

export type ShareResult = {
  /**
   * Whether the share action was successful
   */
  action: ShareAction;

  /**
   * Activity type selected by the user (iOS only)
   */
  activityType?: string;
};

export type ShareAction = "sharedAction" | "dismissedAction";

/**
 * Share content using the native share sheet on mobile and Web Share API on web.
 * 
 * On mobile (iOS/Android): Uses React Native's Share API which shows the native share sheet
 * On web: Uses the Web Share API (navigator.share()) if available, otherwise falls back gracefully
 * 
 * @param options - Share options containing message, title, and optionally url
 * @returns Promise that resolves with the share result
 * 
 * @example
 * ```tsx
 * import { share } from "@native-ui-org/primitives";
 * 
 * const handleShare = async () => {
 *   try {
 *     const result = await share({
 *       message: "Check out this amazing app!",
 *       title: "Amazing App",
 *       url: "https://example.com",
 *     });
 *     
 *     if (result.action === "sharedAction") {
 *       console.log("Content shared successfully");
 *     }
 *   } catch (error) {
 *     console.error("Share failed:", error);
 *   }
 * };
 * ```
 */
export async function share(options: ShareOptions): Promise<ShareResult> {
  if (Platform.OS === "web") {
    return shareWeb(options);
  } else {
    return shareNative(options);
  }
}

/**
 * Native share implementation using React Native's Share API
 */
async function shareNative(options: ShareOptions): Promise<ShareResult> {
  try {
    // On native, format URL as a deep link if present
    let message = options.message || "";
    
    if (options.url) {
      // Format URL as a clickable link (mobile apps will recognize URLs in the message)
      // Put URL first so it's more prominent
      const urlText = options.url;
      if (message) {
        message = `${message}\n\n${urlText}`;
      } else {
        message = urlText;
      }
    }

    // If we have a title but no message, use title as message
    if (!message && options.title) {
      message = options.title;
    }

    const result = await RNShare.share(
      {
        message: message || "",
        title: options.title,
        url: options.url, // Some platforms (iOS) support url field directly
      },
      {
        dialogTitle: options.title,
      }
    );

    return {
      action: result.action === "sharedAction" ? "sharedAction" : "dismissedAction",
      activityType: result.activityType ?? undefined,
    };
  } catch {
    // If share is cancelled or fails, return dismissed action
    return {
      action: "dismissedAction",
    };
  }
}

/**
 * Web share implementation using Web Share API
 */
async function shareWeb(options: ShareOptions): Promise<ShareResult> {
  // Check if Web Share API is available
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      const shareData: ShareData = {};

      if (options.title) {
        shareData.title = options.title;
      }

      if (options.message) {
        shareData.text = options.message;
      }

      if (options.url) {
        shareData.url = options.url;
      }

      // Ensure at least one field is provided
      if (!shareData.title && !shareData.text && !shareData.url) {
        throw new Error("At least one of title, message, or url must be provided");
      }

      await navigator.share(shareData);

      return {
        action: "sharedAction",
      };
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name === "AbortError") {
        return {
          action: "dismissedAction",
        };
      }
      // Re-throw other errors
      throw error;
    }
  } else {
    // Web Share API not available - fallback to clipboard or show error
    // For now, we'll throw an error indicating the API is not available
    // In the future, we could implement a clipboard fallback
    throw new Error(
      "Web Share API is not available in this browser. Please use a browser that supports navigator.share()"
    );
  }
}

// Type definitions for Web Share API
interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

