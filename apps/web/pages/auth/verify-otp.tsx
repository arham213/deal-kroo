import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, TextInput, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../../contexts/AuthContext"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import {
  OTP_LENGTH,
  resendOtp,
  verifyOtp,
} from "@repo/utils/auth/verifyOtp"

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

export default function VerifyOtpPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthContext()
  const { userId, isSignupOTP } = router.query as {
    userId?: string
    isSignupOTP?: string
  }

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [touched, setTouched] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const isOtpValidLength = useMemo(
    () => otp.trim().length === OTP_LENGTH,
    [otp],
  )

  const showError = touched && !isOtpValidLength
  const isSubmitDisabled = loading || !isOtpValidLength

  const handleVerifyOTP = async () => {
    setApiError(null)
    if (!userId) {
      setTouched(true)
      setApiError("Invalid or missing user identifier. Please retry the flow.")
      return
    }

    if (!isOtpValidLength) {
      setTouched(true)
      return
    }

    try {
      setLoading(true)

      const result = await verifyOtp({
        userId: String(userId),
        isSignupOtp: isSignupOTP === "true",
        otpCode: otp.trim(),
      })

      setTouched(false)
      setOtp("")

      if (result.type === "signup") {
        await setToken(result.token)
        await setUser(result.user)
        router.replace("/onboarding")
      } else {
        router.push({
          pathname: "/reset-password",
          query: { userId: result.userId },
        })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setApiError(null)
    if (!userId) {
      setApiError("Invalid or missing user identifier. Please retry the flow.")
      return
    }

    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    try {
      setLoading(true)

      await resendOtp({
        userId: String(userId),
        isSimpleOtp: false,
      })

      setOtp("")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (value: string) => {
    // digits only, max OTP_LENGTH
    const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH)
    setOtp(digits)
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
              textAlign: "left",
            }}
          >
            Verify your email
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
              textAlign: "left",
            }}
          >
            An OTP has been sent to your registered email.
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
          <View style={{ gap: spacing.md }}>
            <Text
              style={{
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.semibold,
                color: Colors.text,
                marginBottom: spacing.xs,
              }}
            >
              Enter OTP here
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: showError ? Colors.error : Colors.border,
                borderRadius: radius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm2,
                fontSize: fontSizes.lg,
                letterSpacing: 8,
                textAlign: "center",
                color: Colors.text,
                backgroundColor: Colors.inputBackground,
              }}
              keyboardType="number-pad"
              placeholder={"•".repeat(OTP_LENGTH)}
              value={otp}
              onChangeText={handleOtpChange}
              editable={!loading}
              maxLength={OTP_LENGTH}
            />
            {showError ? (
              <Text
                style={{
                  marginTop: spacing.xs,
                  fontSize: fontSizes.xs,
                  color: Colors.error,
                  textAlign: "center",
                }}
              >
                Enter the {OTP_LENGTH}-digit code sent to your email
              </Text>
            ) : null}
          </View>

          {apiError ? (
            <Text
              style={{
                fontSize: fontSizes.sm,
                color: Colors.error,
                textAlign: "center",
              }}
            >
              {apiError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.sm,
                color: Colors.textSecondary,
              }}
            >
              Didn't receive OTP?{" "}
            </Text>
            <button
              type="button"
              onClick={resendTimer === 0 ? handleResendOTP : undefined}
              disabled={resendTimer > 0 || loading}
              style={{
                border: "none",
                backgroundColor: "transparent",
                padding: 0,
                margin: 0,
                cursor: resendTimer === 0 && !loading ? "pointer" : "not-allowed",
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.semibold,
                color: Colors.neutral100,
                opacity: resendTimer === 0 && !loading ? 1 : 0.5,
              }}
            >
              {resendTimer > 0 ? `Re-Send (${resendTimer}s)` : "Re-Send"}
            </button>
          </View>

          <RNButton
            title="Continue"
            onPress={handleVerifyOTP}
            loading={loading}
            disabled={isSubmitDisabled}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}


