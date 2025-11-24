import { Stack } from "expo-router";
import { View, Text, Button } from "@native-ui-org/primitives";
import { Radio, RadioGroup, RadioLabel, RadioIndicator } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React, { useState } from "react";

export default function RadioGroupPreview() {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  const [shipping, setShipping] = useState<string>("standard");

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Radio Group" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>RadioGroup Primitive</Text>
          <Text as="p" style={styles.description}>
            Manage multiple radios with coordinated state. Only one option can be selected at a time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Group semantics with role="radiogroup"{"\n"}
            • <Text style={styles.bold}>Native:</Text> Coordinated state across radios{"\n"}
            • <Text style={styles.bold}>State:</Text> Single selected value{"\n"}
            • <Text style={styles.bold}>Controlled:</Text> Parent manages selection
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Payment Method</Text>
          <Text as="p" style={styles.description}>
            Select your preferred payment method
          </Text>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <View style={styles.group}>
              <Button style={styles.row} onPress={() => setPaymentMethod("credit")}>
                <Radio id="credit" value="credit" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="credit" style={styles.label}>
                  Credit Card
                </RadioLabel>
              </Button>
              
              <Button style={styles.row} onPress={() => setPaymentMethod("paypal")}>
                <Radio id="paypal" value="paypal" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="paypal" style={styles.label}>
                  PayPal
                </RadioLabel>
              </Button>
              
              <Button style={styles.row} onPress={() => setPaymentMethod("bank")}>
                <Radio id="bank" value="bank" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="bank" style={styles.label}>
                  Bank Transfer
                </RadioLabel>
              </Button>
            </View>
          </RadioGroup>
          
          <Text style={styles.hint}>
            Selected: {paymentMethod}
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Shipping Options</Text>
          <Text as="p" style={styles.description}>
            Choose your shipping speed
          </Text>
          
          <RadioGroup value={shipping} onValueChange={setShipping}>
            <View style={styles.group}>
              <Button style={styles.row} onPress={() => setShipping("standard")}>
                <Radio id="standard" value="standard" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="standard" style={styles.label}>
                  Standard (5-7 business days)
                </RadioLabel>
              </Button>
              
              <Button style={styles.row} onPress={() => setShipping("express")}>
                <Radio id="express" value="express" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="express" style={styles.label}>
                  Express (2-3 business days)
                </RadioLabel>
              </Button>
              
              <Button style={styles.row} onPress={() => setShipping("overnight")}>
                <Radio id="overnight" value="overnight" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="overnight" style={styles.label}>
                  Overnight (next business day)
                </RadioLabel>
              </Button>
            </View>
          </RadioGroup>
          
          <Text style={styles.hint}>
            Selected: {shipping}
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Uncontrolled Group</Text>
          <Text as="p" style={styles.description}>
            Group manages its own state with defaultValue
          </Text>
          
          <RadioGroup defaultValue="option-1">
            <View style={styles.group}>
              <View style={styles.row}>
                <Radio id="option-1" value="option-1" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="option-1" style={styles.label}>
                  Option 1 (default selected)
                </RadioLabel>
              </View>
              
              <View style={styles.row}>
                <Radio id="option-2" value="option-2" style={styles.radioBox}>
                  <RadioIndicator>
                    <View style={styles.dot} />
                  </RadioIndicator>
                </Radio>
                <RadioLabel htmlFor="option-2" style={styles.label}>
                  Option 2
                </RadioLabel>
              </View>
            </View>
          </RadioGroup>
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
  group: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  radioBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  hint: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    fontStyle: "italic",
  },
});

