import React, { useState } from "react"
import {
  Platform,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, radius, spacing } from "@repo/utils/styles/tokens"
import { fontFamilies, fontWeights } from "@repo/utils/styles"

export interface RNTextInputProps extends TextInputProps {
  label?: string
  error?: string
  helperText?: string
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  textInputStyle?: TextStyle
}

export function RNTextInputField({
  label,
  error,
  helperText,
  labelStyle,
  textInputStyle,
  containerStyle,
  secureTextEntry,
  ...props
}: RNTextInputProps) {
  const showHelperText = !error && helperText
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPasswordField = !!secureTextEntry

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputWrapperError, containerStyle]}>
        <RNTextInput
          style={[styles.input, isPasswordField && styles.inputWithIcon, textInputStyle]}
          placeholderTextColor={Colors.placeholder}
          secureTextEntry={isPasswordField && !isPasswordVisible}
          {...props}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.iconText}>{isPasswordVisible ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : showHelperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
    color: Colors.text,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius.pill,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === "ios" ? spacing.md2 : spacing.xxs,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapperError: {
    borderColor: Colors.error,
    backgroundColor: "#FFECEC",
  },
  input: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.regular,
    color: Colors.text,
  },
  inputWithIcon: {
    paddingRight: spacing.sm,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: spacing.sm,
  },
  iconText: {
    fontSize: fontSizes.xs,
    color: Colors.textSecondary,
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: Colors.error,
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
  },
  helperText: {
    fontSize: fontSizes.xs,
    color: Colors.textSecondary,
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
  },
})


