import * as React from "react";
import { Platform, View, type ViewProps } from "react-native";
import { Button } from "../button";
import { Text } from "../text";
import { Image } from "react-native";

// Optional dependency - only used on native
let ImagePicker: any;
if (Platform.OS !== "web") {
  try {
    // Try to require expo-image-picker
    ImagePicker = require("expo-image-picker");
  } catch (error) {
    // expo-image-picker not installed - will show warning when used
    console.warn("expo-image-picker is not installed. Please install it to use InputFile on native.");
  }
}

export type InputFileProps = ViewProps & {
  /**
   * Callback when a file is selected.
   * On native, receives the URI string.
   * On web, receives the File object.
   */
  onFileSelect?: (file: string | File) => void;
  /**
   * Accepted file types (web only).
   * Example: "image/*", ".pdf,.doc"
   */
  accept?: string;
  /**
   * Whether to allow multiple file selection (web only).
   */
  multiple?: boolean;
  /**
   * Media types for image picker (native only).
   */
  mediaTypes?: "images" | "videos" | "all";
  /**
   * Whether to allow editing the selected image (native only).
   */
  allowsEditing?: boolean;
  /**
   * Aspect ratio for image editing (native only).
   */
  aspect?: [number, number];
  /**
   * Image quality (0-1, native only).
   */
  quality?: number;
  /**
   * Currently selected file URI (for preview).
   */
  value?: string | null;
  /**
   * Placeholder text for the button.
   */
  placeholder?: string;
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Cross-platform file input component.
 * 
 * - On native: Uses expo-image-picker for image selection
 * - On web: Uses native file input (hidden, triggered by button)
 * - Provides consistent API across platforms
 */
const InputFile = React.forwardRef<any, InputFileProps>((props, ref) => {
  const {
    onFileSelect,
    accept = "image/*",
    multiple = false,
    mediaTypes = "images",
    allowsEditing = true,
    aspect = [4, 3],
    quality = 1,
    value,
    placeholder = "Select file",
    asChild,
    style,
    ...rest
  } = props;

  const [selectedFile, setSelectedFile] = React.useState<string | null>(value || null);
  const [previewUri, setPreviewUri] = React.useState<string | null>(value || null);
  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
    setSelectedFile(value || null);
    setPreviewUri(value || null);
  }, [value]);

  // Request permissions on native
  React.useEffect(() => {
    if (Platform.OS !== "web" && ImagePicker) {
      (async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasPermission(status === "granted");
        } catch {
          setHasPermission(false);
        }
      })();
    } else {
      setHasPermission(true);
    }
  }, []);

  const handleSelect = React.useCallback(async () => {
    if (Platform.OS === "web") {
      // On web, create a hidden file input and trigger it
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.multiple = multiple;
      input.style.display = "none";
      document.body.appendChild(input);
      
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
          const file = files[0];
          
          // Create preview URL for web
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              setPreviewUri(dataUrl);
              // Call onFileSelect with the File object
              if (onFileSelect) {
                onFileSelect(file);
              }
            };
            reader.readAsDataURL(file);
          }
        }
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      };
      
      input.click();
    } else {
      // On native, use expo-image-picker
      if (!ImagePicker) {
        console.warn("expo-image-picker is not installed. Please install it to use InputFile on native.");
        return;
      }
      
      if (!hasPermission) {
        console.warn("Media library permission not granted");
        return;
      }

      try {
        // Use new MediaType API (expo-image-picker >= 15.0)
        // With version 17.0.8, MediaType is available - use it directly
        const mediaTypeMap: Record<string, any> = {
          images: ImagePicker.MediaType.Images,
          videos: ImagePicker.MediaType.Videos,
          all: ImagePicker.MediaType.All,
        };
        const mediaType = mediaTypeMap[mediaTypes] || ImagePicker.MediaType.Images;
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaType,
          allowsEditing,
          aspect,
          quality,
        });

        if (!result.canceled && result.assets[0]) {
          const uri = result.assets[0].uri;
          setSelectedFile(uri);
          setPreviewUri(uri);
          if (onFileSelect) {
            onFileSelect(uri);
          }
        }
      } catch (error) {
        console.error("Error picking image:", error);
      }
    }
  }, [hasPermission, accept, multiple, mediaTypes, allowsEditing, aspect, quality, onFileSelect]);

  if (asChild) {
    // If asChild, just return the children with the handler
    return (
      <View ref={ref} style={style} {...rest}>
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, {
              onPress: handleSelect,
            });
          }
          return child;
        })}
      </View>
    );
  }

  return (
    <View ref={ref} style={style} {...rest}>
      <Button 
        onPress={handleSelect} 
        style={{ 
          marginBottom: previewUri ? 12 : 0,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#E5E5EA",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "#666", fontSize: 14 }}>
          {previewUri ? "Change" : placeholder}
        </Text>
      </Button>
      
      {previewUri && (
        <View style={{ alignItems: "center", marginTop: 12 }}>
          {Platform.OS === "web" ? (
            <img 
              src={previewUri} 
              alt="Preview"
              style={{
                width: 200,
                height: 200,
                borderRadius: 8,
                objectFit: "cover",
                backgroundColor: "#F2F2F7",
                borderWidth: 1,
                borderColor: "#E5E5EA",
              }}
              onError={(e) => {
                console.error("Image load error:", e);
              }}
            />
          ) : (
            <Image 
              source={{ uri: previewUri }} 
              style={{ 
                width: 200, 
                height: 200, 
                borderRadius: 8,
                backgroundColor: "#F2F2F7",
                borderWidth: 1,
                borderColor: "#E5E5EA",
              }}
              resizeMode="cover"
              onError={(error) => {
                console.error("Image load error:", error);
              }}
            />
          )}
          <Button 
            onPress={() => {
              setSelectedFile(null);
              setPreviewUri(null);
              if (onFileSelect) {
                onFileSelect(null as any);
              }
            }}
            style={{ 
              marginTop: 8, 
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#E5E5EA",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "#666", fontSize: 12 }}>Remove</Text>
          </Button>
        </View>
      )}
    </View>
  );
});

InputFile.displayName = "InputFile";

export { InputFile };

