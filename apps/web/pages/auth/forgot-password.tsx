import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, TextInput, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import {
  getForgotPasswordEmailError,
  sendForgotPasswordOtp,
} from "@repo/utils/auth/forgotPassword"

type LocalButtonProps = {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}

const RNButton = ({ title, onPress, loading, disabled, style }: LocalButtonProps) => (
  <button
    type="button"
    onClick={onPress}
    disabled={disabled || loading}
    style={{
      marginTop: spacing.sm,
      width: "100%",
      borderRadius: radius.pill,
      paddingTop: spacing.md2,
      paddingBottom: spacing.md2,
      border: "none",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled || loading ? 0.5 : 1,
      backgroundColor: Colors.neutral100,
      color: Colors.white,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semibold,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      ...(style || {}),
    }}
  >
    {loading ? "Loading..." : title}
  </button>
)

type LocalTextInputProps = React.ComponentProps<typeof TextInput> & {
  label?: string
  error?: string
  helperText?: string
}

const RNTextInputField = ({
  label,
  error,
  helperText,
  ...props
}: LocalTextInputProps) => {
  const showHelperText = !error && helperText

  return (
    <View style={{ gap: 8 }}>
      {label && (
        <Text
          style={{
            fontSize: fontSizes.sm,
            fontWeight: fontWeights.medium,
            color: Colors.text,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: error ? Colors.error : Colors.border,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm2,
          fontSize: fontSizes.sm,
          color: Colors.text,
          backgroundColor: Colors.inputBackground,
        }}
        placeholderTextColor={Colors.placeholder}
        {...props}
      />
      {error ? (
        <Text
          style={{
            marginTop: spacing.xs,
            fontSize: fontSizes.xs,
            color: Colors.error,
          }}
        >
          {error}
        </Text>
      ) : showHelperText ? (
        <Text
          style={{
            marginTop: spacing.xs,
            fontSize: fontSizes.xs,
            color: Colors.textSecondary,
          }}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  )
}

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
          maxWidth: 480,
          width: "100%",
          alignSelf: "center",
          gap: spacing.xl,
        }}
      >
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: fontSizes.xl,
              fontWeight: fontWeights.bold,
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

        <View
          style={{
            backgroundColor: Colors.neutral10,
            borderRadius: radius.xxl,
            padding: spacing.xl,
            shadowColor: Colors.black,
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            gap: spacing.lg,
          }}
        >
          <View style={{ gap: spacing.lg }}>
            <RNTextInputField
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
            <Text style={{ fontSize: fontSizes.sm, color: Colors.error }}>{apiError}</Text>
          ) : null}

          <RNButton
            title="Send OTP"
            onPress={handleSendOTP}
            loading={loading}
            disabled={isSubmitDisabled}
            style={{ marginTop: spacing.sm }}
          />

          <View
            style={{
              alignItems: "center",
              marginTop: spacing.sm,
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
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}


