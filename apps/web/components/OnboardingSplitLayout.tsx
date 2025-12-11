import type React from "react"
import { View } from "react-native-web"
import { spacing } from "@repo/utils/styles/tokens"

type OnboardingSplitLayoutProps = {
  children: React.ReactNode
}

export default function OnboardingSplitLayout({ children }: OnboardingSplitLayoutProps) {
  return (
    <View
      style={{
        minHeight: "100vh",
        flexDirection: "row",
      }}
    >
      {/* Left: content */}
      <View
        style={{
          flex: 1,
          paddingVertical: spacing.xxxl,
          paddingHorizontal: spacing.screen,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {children}
      </View>

      {/* Right: hero image */}
      <View
        style={{
          flex: 1,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </View>
  )
}


