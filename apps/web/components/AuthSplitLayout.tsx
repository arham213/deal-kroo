import type React from "react"
import { View, Text } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing } from "@repo/utils/styles/tokens"

type AuthSplitLayoutProps = {
  children: React.ReactNode
}

export default function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <View
      style={{
        minHeight: "100vh",
        flexDirection: "row",
        backgroundColor: Colors.neutral10,
      }}
    >
      {/* Left: form column */}
      <View
        style={{
          flex: 1,
          paddingVertical: spacing.xxxl,
          paddingHorizontal: spacing.screen,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.neutral10,
        }}
      >
        {children}
      </View>

      {/* Right: image/brand panel */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b0b0b",
          position: "relative",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.xxxl,
        }}
      >
        <View
          style={{
            position: "absolute",
            inset: 0,
              opacity: 0.85,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "grayscale(0.2)",
          }}
        />

        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          <Text
            style={{
              fontSize: 40,
              letterSpacing: 4,
              fontWeight: fontWeights.bold,
              color: Colors.neutral10,
            }}
          >
            DEALS
          </Text>
          <Text
            style={{
              fontSize: fontSizes.sm,
              color: Colors.neutral20,
            }}
          >
            Smart real estate management, simplified.
          </Text>
        </View>
      </View>
    </View>
  )
}


