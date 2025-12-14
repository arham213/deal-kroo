import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useToast } from "../../components/common/ToastContext"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import { TextField } from "../../components/TextField"
import { Button } from "../../components/Button"
import {
  getPasswordChecks,
  resetPasswordForUser,
  validateResetPasswordField,
  validateResetPasswordForm,
  type ResetPasswordErrors,
  type ResetPasswordField,
} from "@repo/utils/auth/resetPassword"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { userId } = router.query as { userId?: string }
  const { showSuccessToast, showErrorToast } = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ResetPasswordErrors>({})
  const [touched, setTouched] = useState<Record<ResetPasswordField, boolean>>({
    password: false,
    confirmPassword: false,
  })

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
    if (!userId) {
      showErrorToast("Invalid or missing user identifier. Please retry the flow.")
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

      showSuccessToast("Password reset successfully!")
      router.push("/auth/sign-in")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      showErrorToast(message)
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
          maxWidth: 420,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xxxl,
        }}
      >
        <View style={{ marginBottom: spacing.xxxxl }}>
          <Text
            style={{
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.semibold,
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
              color: Colors.neutral100,
              textAlign: "center",
            }}
          >
            Enter your new password below
          </Text>
        </View>

        <View style={{ gap: spacing.xxxl }}>
          <TextField
            label="New Password"
            placeholder="Enter new password"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={handleBlur("password")}
            editable={!loading}
            error={touched.password ? errors.password : undefined}
          />
          <TextField
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
              padding: spacing.md,
              gap: spacing.xs,
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
                fontWeight: fontWeights.medium,
              }}
            >
              • At least 8 characters
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xs,
                color: passwordChecks.uppercase ? Colors.success2 : Colors.textSecondary,
                fontWeight: fontWeights.medium,
              }}
            >
              • Contains an uppercase letter
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xs,
                color: passwordChecks.lowercase ? Colors.success2 : Colors.textSecondary,
                fontWeight: fontWeights.medium,
              }}
            >
              • Contains a lowercase letter
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xs,
                color: passwordChecks.number ? Colors.success2 : Colors.textSecondary,
                fontWeight: fontWeights.medium,
              }}
            >
              • Contains a number
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xs,
                color: passwordChecks.match ? Colors.success2 : Colors.textSecondary,
                fontWeight: fontWeights.medium,
              }}
            >
              • Passwords match
            </Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.xxxl }}>
          <Button
            title="Reset Password"
            loadingTitle="Resetting..."
            onPress={handleResetPassword}
            loading={loading}
            disabled={isSubmitDisabled}
          />
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}
