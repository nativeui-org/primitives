import { Stack } from "expo-router";
import { View, Text, AspectRatio } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Image } from "react-native";

export default function AspectRatioPreview() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Aspect Ratio" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>AspectRatio Primitive</Text>
          <Text as="p" style={styles.description}>
            Maintains a specific aspect ratio for content, essential for responsive images, videos, and consistent layouts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Uses CSS aspect-ratio property{"\n"}
            • <Text style={styles.bold}>Native:</Text> Uses padding-bottom trick{"\n"}
            • <Text style={styles.bold}>Responsive:</Text> Adapts to container width{"\n"}
            • <Text style={styles.bold}>Flexible:</Text> Supports number or string ratios
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>16:9 Widescreen</Text>
          <Text as="p" style={styles.description}>
            Perfect for videos and banners
          </Text>
          
          <AspectRatio ratio="16:9" style={styles.aspectContainer}>
            <Image 
              source={{ uri: "https://picsum.photos/800/450" }}
              style={styles.image}
              resizeMode="cover"
            />
          </AspectRatio>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>1:1 Square</Text>
          <Text as="p" style={styles.description}>
            Great for avatars, thumbnails, and social media
          </Text>
          
          <AspectRatio ratio={1} style={styles.aspectContainer}>
            <Image 
              source={{ uri: "https://picsum.photos/400/400" }}
              style={styles.image}
              resizeMode="cover"
            />
          </AspectRatio>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>4:3 Standard</Text>
          <Text as="p" style={styles.description}>
            Classic photo and display ratio
          </Text>
          
          <AspectRatio ratio="4/3" style={styles.aspectContainer}>
            <Image 
              source={{ uri: "https://picsum.photos/600/450" }}
              style={styles.image}
              resizeMode="cover"
            />
          </AspectRatio>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>3:2 Photo</Text>
          <Text as="p" style={styles.description}>
            Common camera sensor ratio
          </Text>
          
          <AspectRatio ratio="3:2" style={styles.aspectContainer}>
            <Image 
              source={{ uri: "https://picsum.photos/600/400" }}
              style={styles.image}
              resizeMode="cover"
            />
          </AspectRatio>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>9:16 Portrait</Text>
          <Text as="p" style={styles.description}>
            Stories, TikTok, mobile-first content
          </Text>
          
          <AspectRatio ratio="9:16" style={styles.aspectContainer}>
            <Image 
              source={{ uri: "https://picsum.photos/450/800" }}
              style={styles.image}
              resizeMode="cover"
            />
          </AspectRatio>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Responsive Grid</Text>
          <Text as="p" style={styles.description}>
            Multiple aspect ratios in a responsive grid
          </Text>
          
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <AspectRatio ratio="1:1">
                <Image 
                  source={{ uri: "https://picsum.photos/300/300" }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </AspectRatio>
            </View>
            
            <View style={styles.gridItem}>
              <AspectRatio ratio="16:9">
                <Image 
                  source={{ uri: "https://picsum.photos/400/225" }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </AspectRatio>
            </View>
            
            <View style={styles.gridItem}>
              <AspectRatio ratio="4:3">
                <Image 
                  source={{ uri: "https://picsum.photos/300/225" }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </AspectRatio>
            </View>
            
            <View style={styles.gridItem}>
              <AspectRatio ratio="3:2">
                <Image 
                  source={{ uri: "https://picsum.photos/300/200" }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              </AspectRatio>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Common Ratios</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>16:9</Text> - Widescreen video{"\n"}
            • <Text style={styles.bold}>4:3</Text> - Standard display{"\n"}
            • <Text style={styles.bold}>1:1</Text> - Square/Instagram{"\n"}
            • <Text style={styles.bold}>3:2</Text> - Camera photos{"\n"}
            • <Text style={styles.bold}>21:9</Text> - Ultrawide{"\n"}
            • <Text style={styles.bold}>9:16</Text> - Portrait/Stories
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Usage Examples</Text>
          <Text as="p" style={styles.description}>
            Perfect for image galleries, video players, card layouts, and any content that needs consistent proportions across different screen sizes.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#fff" : "#f2f2f7",
  },
  content: {
    ...Platform.select({
      web: {
        maxWidth: 800,
        marginHorizontal: "auto",
        width: "100%",
        paddingHorizontal: 24,
        paddingVertical: 32,
      },
      default: {
        padding: 16,
      },
    }),
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  aspectContainer: {
    marginBottom: 16,
    ...Platform.select({
      web: {
        maxWidth: 400,
      },
      default: {
        width: "100%",
      },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
    marginBottom: 12,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
});
