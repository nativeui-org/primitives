import { Stack } from "expo-router";
import { View, Text, share, ActivityView, Button } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";

export default function ActivityViewPreview() {
    const [lastResult, setLastResult] = React.useState<string>("");

    const handleShareText = async () => {
        try {
            const result = await share({
                message: "Check out this amazing app!",
            });

            if (result.action === "sharedAction") {
                setLastResult("Text shared successfully!");
            } else {
                setLastResult("Share cancelled");
            }
        } catch (error) {
            setLastResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleShareWithTitle = async () => {
        try {
            const result = await share({
                title: "Amazing App",
                message: "Check out this amazing app!",
            });

            if (result.action === "sharedAction") {
                setLastResult("Content with title shared successfully!");
            } else {
                setLastResult("Share cancelled");
            }
        } catch (error) {
            setLastResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleShareURL = async () => {
        try {
            const result = await share({
                title: "Visit Native UI Primitives",
                message: "Check out this amazing library!",
                url: "https://github.com/native-ui-org/primitives",
            });

            if (result.action === "sharedAction") {
                setLastResult("URL shared successfully!");
            } else {
                setLastResult("Share cancelled");
            }
        } catch (error) {
            setLastResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleShareMinimal = async () => {
        try {
            const result = await share({
                title: "Native UI Primitives",
            });

            if (result.action === "sharedAction") {
                setLastResult("Title shared successfully!");
            } else {
                setLastResult("Share cancelled");
            }
        } catch (error) {
            setLastResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handleShareDeepLink = async () => {
        try {
            // Generate deep link URL that opens this screen
            // On web, use the current page URL so it works when shared
            const deepLinkUrl = Platform.select({
                web: typeof window !== "undefined" ? window.location.href : "",
                ios: "sandbox-primitives://preview/activity-view",
                android: "sandbox-primitives://preview/activity-view",
                default: "sandbox-primitives://preview/activity-view",
            });

            const result = await share({
                title: "Check out ActivityView in NativeUI Sandbox!",
                message: "Open this link to see the ActivityView component demo:",
                url: deepLinkUrl,
            });

            if (result.action === "sharedAction") {
                setLastResult("Deep link shared successfully! The recipient can tap the link to open this screen.");
            } else {
                setLastResult("Share cancelled");
            }
        } catch (error) {
            setLastResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: "ActivityView (Share)" }} />

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text as="h2" style={styles.sectionTitle}>Share API</Text>
                    <Text as="p" style={styles.description}>
                        Cross-platform sharing using native share sheets on mobile and Web Share API on web.
                    </Text>
                </View>

                {lastResult ? (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultText}>Last result: {lastResult}</Text>
                    </View>
                ) : null}

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Share Text (with ActivityView)</Text>
                    <Text as="p" style={styles.description}>
                        Share a simple text message using ActivityView component (menu appears near button on web)
                    </Text>

                    <ActivityView
                        shareOptions={{
                            message: "Check out this amazing app!",
                        }}
                        onShareComplete={(result) => {
                            if (result.action === "sharedAction") {
                                setLastResult("Text shared successfully via ActivityView!");
                            } else {
                                setLastResult("Share cancelled");
                            }
                        }}
                    >
                        <Button style={styles.button} onPress={() => {}}>
                            <Text style={styles.buttonText}>Share Text</Text>
                        </Button>
                    </ActivityView>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Share Text (direct function)</Text>
                    <Text as="p" style={styles.description}>
                        Share using the share() function directly (native dialog on web)
                    </Text>

                    <Button style={styles.button} onPress={handleShareText}>
                        <Text style={styles.buttonText}>Share Text</Text>
                    </Button>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Share with Title</Text>
                    <Text as="p" style={styles.description}>
                        Share content with both title and message
                    </Text>

                    <Button style={styles.button} onPress={handleShareWithTitle}>
                        <Text style={styles.buttonText}>Share with Title</Text>
                    </Button>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Share URL</Text>
                    <Text as="p" style={styles.description}>
                        Share a URL with title and message (works best on web)
                    </Text>

                    <Button style={styles.button} onPress={handleShareURL}>
                        <Text style={styles.buttonText}>Share URL</Text>
                    </Button>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Share Title Only</Text>
                    <Text as="p" style={styles.description}>
                        Share with just a title (minimal example)
                    </Text>
                    
                    <Button style={styles.button} onPress={handleShareMinimal}>
                        <Text style={styles.buttonText}>Share Title Only</Text>
                    </Button>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Share Deep Link</Text>
                    <Text as="p" style={styles.description}>
                        Share a deep link that opens this ActivityView screen directly in the app. When someone taps the link, it will open this screen automatically!
                    </Text>
                    
                    <Button style={styles.button} onPress={handleShareDeepLink}>
                        <Text style={styles.buttonText}>Share Deep Link</Text>
                    </Button>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
                    <Text as="p" style={styles.description}>
                        • <Text style={styles.bold}>Mobile (iOS/Android):</Text> Shows native share sheet with installed apps{"\n"}
                        • <Text style={styles.bold}>Web:</Text> Uses Web Share API (navigator.share()){"\n"}
                        • <Text style={styles.bold}>Promise-based:</Text> Async/await support{"\n"}
                        • <Text style={styles.bold}>Activity Type:</Text> Returns selected app on iOS
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text as="h3" style={styles.subTitle}>Browser Support (Web)</Text>
                    <Text as="p" style={styles.description}>
                        • <Text style={styles.bold}>Chrome/Edge:</Text> Supported (Desktop & Mobile){"\n"}
                        • <Text style={styles.bold}>Safari:</Text> Supported (iOS & macOS){"\n"}
                        • <Text style={styles.bold}>Firefox:</Text> Supported (Desktop & Mobile){"\n"}
                        • <Text style={styles.bold}>Older browsers:</Text> Falls back with error message
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
        marginBottom: 24,
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
        marginBottom: 12,
        lineHeight: 20,
    },
    bold: {
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    resultBox: {
        backgroundColor: "#f0f9ff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: "#007AFF",
    },
    resultText: {
        fontSize: 14,
        color: "#000",
        fontWeight: "500",
    },
    codeBlock: {
        backgroundColor: "#f5f5f5",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        ...Platform.select({
            web: {
                fontFamily: "monospace",
            },
            default: {
                fontFamily: "Courier",
            },
        }),
    },
    codeText: {
        fontSize: 12,
        color: "#333",
        ...Platform.select({
            web: {
                fontFamily: "monospace",
            },
            default: {
                fontFamily: "Courier",
            },
        }),
    },
});

