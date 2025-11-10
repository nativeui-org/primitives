import { Platform } from "react-native";

// Platform-specific ActivityView component
// Import both versions - bundler will include both, runtime will use the correct one
import { ActivityView as WebActivityView } from "./activity-view-platform.web";
import type { ActivityViewProps as WebActivityViewProps } from "./activity-view-platform.web";
import { ActivityView as NativeActivityView } from "./activity-view-platform.native";

// Export the appropriate component based on platform
export const ActivityView = Platform.OS === "web" ? WebActivityView : NativeActivityView;

// Export the type (both are the same structure)
export type ActivityViewProps = WebActivityViewProps;

