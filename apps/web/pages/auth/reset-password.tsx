import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, TextInput, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import {
  getPasswordChecks,
  resetPasswordForUser,
  validateResetPasswordField,
  validateResetPasswordForm,
  type ResetPasswordErrors,
  type ResetPasswordField,
} from "@repo/utils/auth/resetPassword"

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

export default function ResetPasswordPage() {
  const router = useRouter()
  const { userId } = router.query as { userId?: string }

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ResetPasswordErrors>({})
  const [touched, setTouched] = useState<Record<ResetPasswordField, boolean>>({
    password: false,
    confirmPassword: false,
  })
  const [apiError, setApiError] = useState<string | null>(null)

  const runValidation = () => {
    const { isValid, errors: validationErrors } = validateResetPasswordForm(password, confirmPassword)
    setErrors(validationErrors)
    return isValid
  }

  const markAllTouched = () => {
    setTouched({
      password: true,
      confirmPassword: true,
    })
  }

  const handleResetPassword = async () => {
    setApiError(null)
    if (!userId) {
      setApiError("Invalid or missing user identifier. Please retry the flow.")
      return
    }

    if (!runValidation()) {
      markAllTouched()
      return
    }

    try {
      setLoading(true)

      await resetPasswordForUser({
        userId: String(userId),
        password,
      })

      setPassword("")
      setConfirmPassword("")
      setErrors({})
      setTouched({
        password: false,
        confirmPassword: false,
      })

      router.push("/sign-in")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (touched.password) {
      const errorMessage = validateResetPasswordField("password", value, value)
      setErrors((prev) => {
        const next = { ...prev }
        if (errorMessage) next.password = errorMessage
        else delete next.password
        return next
      })
    }

    if (touched.confirmPassword) {
      const confirmError = validateResetPasswordField("confirmPassword", confirmPassword, value)
      setErrors((prev) => {
        const next = { ...prev }
        if (confirmError) next.confirmPassword = confirmError
        else delete next.confirmPassword
        return next
      })
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (touched.confirmPassword) {
      const errorMessage = validateResetPasswordField("confirmPassword", value, password)
      setErrors((prev) => {
        const next = { ...prev }
        if (errorMessage) next.confirmPassword = errorMessage
        else delete next.confirmPassword
        return next
      })
    }
  }

  const handleBlur = (field: ResetPasswordField) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    const value = field === "password" ? password : confirmPassword
    const errorMessage = validateResetPasswordField(field, value, password)
    setErrors((prev) => {
      const next = { ...prev }
      if (errorMessage) next[field] = errorMessage
      else delete next[field]
      return next
    })
  }

  const passwordChecks = useMemo(
    () => getPasswordChecks(password, confirmPassword),
    [password, confirmPassword],
  )

  const isSubmitDisabled =
    loading ||
    Boolean(validateResetPasswordField("password", password, password)) ||
    Boolean(validateResetPasswordField("confirmPassword", confirmPassword, password))

  return (
    <AuthSplitLayout>
      <ScrollView
        contentContainerStyle={{
          maxWidth: 520,
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
            Reset Password
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            Enter your new password below
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
              label="New Password"
              placeholder="Enter new password"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={handleBlur("password")}
              editable={!loading}
              error={touched.password ? errors.password : undefined}
            />
            <RNTextInputField
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={handleBlur("confirmPassword")}
              editable={!loading}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
            />

            <View
              style={{
                backgroundColor: Colors.neutral20,
                borderRadius: radius.md,
                padding: spacing.sm,
                gap: spacing.xs,
                marginTop: spacing.xs,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  fontWeight: fontWeights.semibold,
                  color: Colors.text,
                  marginBottom: spacing.xs,
                }}
              >
                Password Requirements:
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  color: passwordChecks.length ? Colors.success2 : Colors.textSecondary,
                  fontWeight: passwordChecks.length ? fontWeights.bold : fontWeights.medium,
                }}
              >
                • At least 8 characters
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  color: passwordChecks.uppercase ? Colors.success2 : Colors.textSecondary,
                  fontWeight: passwordChecks.uppercase ? fontWeights.bold : fontWeights.medium,
                }}
              >
                • Contains an uppercase letter
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  color: passwordChecks.lowercase ? Colors.success2 : Colors.textSecondary,
                  fontWeight: passwordChecks.lowercase ? fontWeights.bold : fontWeights.medium,
                }}
              >
                • Contains a lowercase letter
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  color: passwordChecks.number ? Colors.success2 : Colors.textSecondary,
                  fontWeight: passwordChecks.number ? fontWeights.bold : fontWeights.medium,
                }}
              >
                • Contains a number
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  color: passwordChecks.match ? Colors.success2 : Colors.textSecondary,
                  fontWeight: passwordChecks.match ? fontWeights.bold : fontWeights.medium,
                }}
              >
                • Passwords match
              </Text>
            </View>
          </View>

          {apiError ? (
            <Text style={{ fontSize: fontSizes.sm, color: Colors.error }}>{apiError}</Text>
          ) : null}

          <RNButton
            title="Reset Password"
            onPress={handleResetPassword}
            loading={loading}
            disabled={isSubmitDisabled}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}


