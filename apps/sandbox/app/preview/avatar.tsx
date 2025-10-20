import { Stack } from "expo-router";
import { View, Text, Avatar } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";

export default function AvatarPreview() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Avatar" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Avatar Primitive</Text>
          <Text as="p" style={styles.description}>
            Display user profile images with intelligent fallback text support. Perfect for user lists, comments, and team displays.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web & Native:</Text> Consistent rendering with proper image handling{"\n"}
            • <Text style={styles.bold}>Fallback:</Text> Graceful degradation to text when image unavailable{"\n"}
            • <Text style={styles.bold}>Responsive:</Text> Multiple size options from extra-small to extra-large{"\n"}
            • <Text style={styles.bold}>Accessible:</Text> Meaningful fallback text for screen readers
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Usage</Text>
          <Text as="p" style={styles.description}>
            With image and fallback text
          </Text>
          
          <View style={styles.demoRow}>
            <Avatar 
              src="https://picsum.photos/100/100?random=1" 
              fallback="JD" 
              size="md"
            />
            <Avatar 
              src="https://picsum.photos/100/100?random=2" 
              fallback="AB" 
              size="md"
            />
            <Avatar 
              src="https://picsum.photos/100/100?random=3" 
              fallback="XY" 
              size="md"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Fallback Only</Text>
          <Text as="p" style={styles.description}>
            When no image is provided, shows fallback text
          </Text>
          
          <View style={styles.demoRow}>
            <Avatar fallback="AB" size="md" />
            <Avatar fallback="CD" size="md" />
            <Avatar fallback="EF" size="md" />
            <Avatar fallback="?" size="md" />
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Different Sizes</Text>
          <Text as="p" style={styles.description}>
            From extra-small to extra-large
          </Text>
          
          <View style={styles.demoRow}>
            <Avatar 
              src="https://picsum.photos/24/24?random=4" 
              fallback="XS" 
              size="xs"
            />
            <Avatar 
              src="https://picsum.photos/32/32?random=5" 
              fallback="SM" 
              size="sm"
            />
            <Avatar 
              src="https://picsum.photos/40/40?random=6" 
              fallback="MD" 
              size="md"
            />
            <Avatar 
              src="https://picsum.photos/48/48?random=7" 
              fallback="LG" 
              size="lg"
            />
            <Avatar 
              src="https://picsum.photos/64/64?random=8" 
              fallback="XL" 
              size="xl"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Custom Size</Text>
          <Text as="p" style={styles.description}>
            Use any pixel value for precise sizing
          </Text>
          
          <View style={styles.demoRow}>
            <Avatar 
              src="https://picsum.photos/80/80?random=9" 
              fallback="80" 
              size={80}
            />
            <Avatar 
              src="https://picsum.photos/100/100?random=10" 
              fallback="100" 
              size={100}
            />
            <Avatar 
              src="https://picsum.photos/120/120?random=11" 
              fallback="120" 
              size={120}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Different Shapes</Text>
          <Text as="p" style={styles.description}>
            Circle (default) and square variants
          </Text>
          
          <View style={styles.demoRow}>
            <Avatar 
              src="https://picsum.photos/60/60?random=12" 
              fallback="C" 
              size="lg"
              shape="circle"
            />
            <Avatar 
              src="https://picsum.photos/60/60?random=13" 
              fallback="S" 
              size="lg"
              shape="square"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>User List Example</Text>
          <Text as="p" style={styles.description}>
            Typical usage in a user list with names and emails
          </Text>
          
          <View style={styles.userList}>
            <View style={styles.userItem}>
              <Avatar 
                src="https://picsum.photos/40/40?random=14" 
                fallback="JD" 
                size="sm"
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>John Doe</Text>
                <Text style={styles.userEmail}>john@example.com</Text>
              </View>
            </View>
            
            <View style={styles.userItem}>
              <Avatar 
                src="https://picsum.photos/40/40?random=15" 
                fallback="JS" 
                size="sm"
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Jane Smith</Text>
                <Text style={styles.userEmail}>jane@example.com</Text>
              </View>
            </View>
            
            <View style={styles.userItem}>
              <Avatar 
                src="https://picsum.photos/40/40?random=16" 
                fallback="BW" 
                size="sm"
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Bob Wilson</Text>
                <Text style={styles.userEmail}>bob@example.com</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Comment Example</Text>
          <Text as="p" style={styles.description}>
            Avatar in a comment with author info
          </Text>
          
          <View style={styles.comment}>
            <Avatar 
              src="https://picsum.photos/40/40?random=17" 
              fallback="AL" 
              size="md"
            />
            <View style={styles.commentContent}>
              <Text style={styles.commentAuthor}>Alice Johnson</Text>
              <Text style={styles.commentText}>
                This is a great example of how Avatar works in a comment system. 
                The fallback text ensures accessibility even when images fail to load.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Team Display</Text>
          <Text as="p" style={styles.description}>
            Overlapping avatars for team members
          </Text>
          
          <View style={styles.teamDisplay}>
            <Avatar 
              src="https://picsum.photos/32/32?random=18" 
              fallback="T1" 
              size="sm"
              style={styles.teamAvatar}
            />
            <Avatar 
              src="https://picsum.photos/32/32?random=19" 
              fallback="T2" 
              size="sm"
              style={styles.teamAvatar}
            />
            <Avatar 
              src="https://picsum.photos/32/32?random=20" 
              fallback="T3" 
              size="sm"
              style={styles.teamAvatar}
            />
            <Avatar 
              src="https://picsum.photos/32/32?random=21" 
              fallback="T4" 
              size="sm"
              style={styles.teamAvatar}
            />
            <Avatar 
              src="https://picsum.photos/32/32?random=22" 
              fallback="T5" 
              size="sm"
              style={styles.teamAvatar}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Size Reference</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>xs:</Text> 24px - Extra small{"\n"}
            • <Text style={styles.bold}>sm:</Text> 32px - Small{"\n"}
            • <Text style={styles.bold}>md:</Text> 40px - Medium (default){"\n"}
            • <Text style={styles.bold}>lg:</Text> 48px - Large{"\n"}
            • <Text style={styles.bold}>xl:</Text> 64px - Extra large{"\n"}
            • <Text style={styles.bold}>Custom:</Text> Any number for precise sizing
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Best Practices</Text>
          <Text as="p" style={styles.description}>
            • Use <Text style={styles.bold}>initials</Text> for fallback text (e.g., "JD" for John Doe){"\n"}
            • Keep fallback text <Text style={styles.bold}>short</Text> (1-2 characters max){"\n"}
            • Always provide <Text style={styles.bold}>fallback</Text> for accessibility{"\n"}
            • Consider <Text style={styles.bold}>loading states</Text> for better UX
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
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  userList: {
    gap: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  comment: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  teamDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamAvatar: {
    marginLeft: -8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  clickableAvatar: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  clickableText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
