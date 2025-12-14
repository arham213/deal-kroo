import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing } from "@repo/utils/styles/tokens"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import { TextField } from "../../components/TextField"
import { Button } from "../../components/Button"
import {
  getForgotPasswordEmailError,
  sendForgotPasswordOtp,
} from "@repo/utils/auth/forgotPassword"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const emailValidationError = useMemo(
    () => getForgotPasswordEmailError(email),
    [email],
  )

  const isSubmitDisabled = loading || Boolean(emailValidationError)

  const handleSendOTP = async () => {
    setApiError(null)
    if (emailValidationError) {
      setTouched(true)
      return
    }

    try {
      setLoading(true)
      const { userId } = await sendForgotPasswordOtp(email)
      setEmail("")
      setTouched(false)

      router.push({
        pathname: "/verify-otp",
        query: { userId },
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
  }

  const handleBlur = () => {
    setTouched(true)
  }

  return (
    <AuthSplitLayout>
      <ScrollView
        contentContainerStyle={{
          maxWidth: 420,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xxxl,
        }}
      >
        <View style={{ marginBottom: spacing.xxl }}>
          <Text
            style={{
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.semibold,
              color: Colors.text,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Forgot Password
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            Enter your email to reset your password
          </Text>
        </View>

        <View style={{ gap: spacing.xl }}>
          <TextField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            error={touched ? emailValidationError : undefined}
          />
        </View>

        {apiError ? (
          <Text style={{ fontSize: fontSizes.sm, color: Colors.error, marginTop: spacing.lg }}>
            {apiError}
          </Text>
        ) : null}

        <View style={{ marginTop: spacing.xxl }}>
          <Button
            title="Send OTP"
            onPress={handleSendOTP}
            loading={loading}
            disabled={isSubmitDisabled}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: spacing.lg,
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            style={{
              border: "none",
              backgroundColor: "transparent",
              padding: 0,
              margin: 0,
              cursor: "pointer",
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              color: Colors.neutral100,
            }}
          >
            Back to Sign In
          </button>
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}
