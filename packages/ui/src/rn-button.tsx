import React from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type ViewStyle } from "react-native"
import { Colors } from "@repo/utils/constants/colors"
import { fontFamilies, fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles"

export interface RNButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}

export function RNButton({ title, onPress, loading, disabled, style }: RNButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={Colors.neutral10} size="small" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.neutral90,
    paddingVertical: spacing.md2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.primary,
    fontWeight: fontWeights.medium,
    color: Colors.neutral10,
  },
})


