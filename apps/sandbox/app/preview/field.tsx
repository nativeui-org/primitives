import {
  View,
  Text,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldSeparator,
  FieldContent,
  Input,
  InputFile,
  Button,
  Checkbox,
  CheckboxIndicator,
} from "@native-ui-org/primitives";
import { Platform, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import React, { useState } from "react";

export default function PreviewField() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | File | null>(null);
  const [hasError, setHasError] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Field System" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Field System</Text>
          <Text as="p" style={styles.description}>
            Complete form field system inspired by shadcn/ui, adapted for React Native.
            Composable, accessible, and flexible - perfect for building any form.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Input Field</Text>
          <Text as="p" style={styles.description}>
            Simple text input with label and description.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                  />
                  <FieldDescription>
                    This appears on invoices and emails.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  <FieldDescription>
                    We never share your email with anyone.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>File/Image Selection</Text>
          <Text as="p" style={styles.description}>
            Use InputFile for selecting images or files. Works with expo-image-picker on native
            and native file input on web.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Profile Picture</FieldLabel>
                  <InputFile
                    accept="image/*"
                    placeholder="Select an image"
                    value={typeof selectedFile === "string" ? selectedFile : null}
                    onFileSelect={(file: string | File) => {
                      setSelectedFile(file);
                      console.log("File selected:", file);
                    }}
                    style={styles.inputFileContainer}
                  />
                  <FieldDescription>
                    Upload a profile picture (JPG, PNG, or GIF).
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Password Field</Text>
          <Text as="p" style={styles.description}>
            Secure text input with validation.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                  />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                  {password.length > 0 && password.length < 8 && (
                    <FieldError>Password must be at least 8 characters.</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Textarea</Text>
          <Text as="p" style={styles.description}>
            Multiline text input for longer content.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <Input
                    id="message"
                    placeholder="Enter your message"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.textarea]}
                  />
                  <FieldDescription>
                    Share your thoughts about our service.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Field with Error</Text>
          <Text as="p" style={styles.description}>
            Display validation errors using FieldError.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="error-field">Username</FieldLabel>
                  <Input
                    id="error-field"
                    placeholder="Choose a username"
                    style={[styles.input, hasError && styles.inputError]}
                    onFocus={() => setHasError(true)}
                  />
                  {hasError && (
                    <FieldError>This username is already taken.</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Horizontal Layout</Text>
          <Text as="p" style={styles.description}>
            Use orientation="horizontal" to align label and control side by side.
            Perfect for checkboxes, switches, and other controls with labels.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldSet>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="remember"
                    defaultChecked={false}
                    style={styles.checkbox}
                  >
                    <CheckboxIndicator>
                      <View style={styles.checkmark} />
                    </CheckboxIndicator>
                  </Checkbox>
                  <FieldLabel htmlFor="remember" style={styles.checkboxLabel}>
                    Remember me
                  </FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Checkbox
                    id="newsletter"
                    defaultChecked={true}
                    style={styles.checkbox}
                  >
                    <CheckboxIndicator>
                      <View style={styles.checkmark} />
                    </CheckboxIndicator>
                  </Checkbox>
                  <FieldContent>
                    <FieldLabel htmlFor="newsletter" style={styles.checkboxLabel}>
                      Subscribe to newsletter
                    </FieldLabel>
                    <FieldDescription>
                      Receive weekly updates and special offers.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Field Groups with Separators</Text>
          <Text as="p" style={styles.description}>
            Group related fields and separate sections.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Payment Method</FieldLegend>
                <FieldDescription>
                  All transactions are secure and encrypted.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="card-name">Name on Card</FieldLabel>
                    <Input
                      id="card-name"
                      placeholder="Evil Rabbit"
                      style={styles.input}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="card-number">Card Number</FieldLabel>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      style={styles.input}
                    />
                    <FieldDescription>
                      Enter your 16-digit card number.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldLegend>Billing Address</FieldLegend>
                <FieldDescription>
                  The billing address associated with your payment method.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="street">Street Address</FieldLabel>
                    <Input
                      id="street"
                      placeholder="123 Main St"
                      style={styles.input}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Complete Form Example</Text>
          <Text as="p" style={styles.description}>
            A complete form showing all components working together.
          </Text>
          
          <View style={styles.demoContainer}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Profile Information</FieldLegend>
                <FieldDescription>
                  Fill in your profile information.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="form-name">Name</FieldLabel>
                    <Input
                      id="form-name"
                      placeholder="Enter your name"
                      style={styles.input}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-email">Email</FieldLabel>
                    <Input
                      id="form-email"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Profile Picture</FieldLabel>
                    <InputFile
                      accept="image/*"
                      placeholder="Select an image"
                      onFileSelect={(file: string | File) => console.log("Selected:", file)}
                      style={styles.inputFileContainer}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <Field orientation="horizontal">
                <Button style={styles.submitButton} onPress={() => console.log("Submit")}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </Button>
                <Button style={styles.cancelButton} onPress={() => console.log("Cancel")}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Button>
              </Field>
            </FieldGroup>
          </View>
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
  demoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
  },
  cancelButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  inputFileContainer: {
    width: "100%",
  },
});
