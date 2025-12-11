import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, TextInput, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import {
  buildSignUpRequestBody,
  createInitialSignUpFormState,
  createSignUpTouchedState,
  formatContactNumberInput,
  hasAnySignUpError,
  hasEmptyRequiredSignUpField,
  signUpUser,
  validateSignUpField,
  validateSignUpForm,
  type SignUpField,
  type SignUpFormState,
  type SignUpTouchedState,
  type SignUpValidationErrors,
} from "@repo/utils/auth/signUp"

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

const PASSWORD_HELPER_TEXT =
  "Use at least 8 characters with upper, lower case letters and a number"

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState<SignUpFormState>(createInitialSignUpFormState)
  const [errors, setErrors] = useState<SignUpValidationErrors>({})
  const [touched, setTouched] = useState<SignUpTouchedState>(createSignUpTouchedState(false))
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const validateField = (field: SignUpField, value: string) => {
    return validateSignUpField(field, value)
  }

  const validateFormState = () => {
    const { isValid, errors: validationErrors } = validateSignUpForm(form)
    setErrors(validationErrors)
    return isValid
  }

  const handleChange =
    (field: SignUpField) =>
    (value: string) => {
      if (field === "contactNo") {
        const digits = formatContactNumberInput(value)
        setForm((prev) => ({
          ...prev,
          [field]: digits,
        }))

        if (!touched.contactNo) {
          setTouched((prev) => ({ ...prev, contactNo: true }))
        }

        const errorMessage = validateField(field, digits)
        setErrors((prev) => {
          const next = { ...prev }
          if (errorMessage) next[field] = errorMessage
          else delete next[field]
          return next
        })
        return
      }

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))

      if (touched[field]) {
        const errorMessage = validateField(field, value)
        setErrors((prev) => {
          const next = { ...prev }
          if (errorMessage) {
            next[field] = errorMessage
          } else {
            delete next[field]
          }
          return next
        })
      }
    }

  const handleBlur = (field: SignUpField) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    const errorMessage = validateField(field, form[field])
    setErrors((prev) => {
      const next = { ...prev }
      if (errorMessage) {
        next[field] = errorMessage
      } else {
        delete next[field]
      }
      return next
    })
  }

  const markAllTouched = () => {
    setTouched(createSignUpTouchedState(true))
  }

  const hasEmptyRequiredField = useMemo(
    () => hasEmptyRequiredSignUpField(form),
    [form],
  )

  const hasAnyError = useMemo(
    () => hasAnySignUpError(form),
    [form],
  )

  const isSubmitDisabled = loading || hasEmptyRequiredField || hasAnyError

  const handleSignUp = async () => {
    setApiError(null)
    const isValid = validateFormState()
    if (!isValid) {
      markAllTouched()
      return
    }

    setLoading(true)
    try {
      const requestBody = buildSignUpRequestBody(form, "dealer")
      const { userId } = await signUpUser(requestBody)

      // On web, go to OTP verification with query params
      router.push({
        pathname: "/verify-otp",
        query: { userId, isSignupOTP: "true" },
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong. Please try again later"
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

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
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.bold,
              color: Colors.text,
              marginBottom: spacing.sm,
              textAlign: "center",
            }}
          >
            Sign Up
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            Enter details below to sign up
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
              label="Full Name"
              placeholder="Type here"
              value={form.fullName}
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              error={touched.fullName ? errors.fullName : undefined}
            />
            <RNTextInputField
              label="Email"
              placeholder="example@gmail.com"
              value={form.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              error={touched.email ? errors.email : undefined}
            />
            <RNTextInputField
              label="Contact Number"
              placeholder="03XXXXXXXXX"
              value={form.contactNo}
              onChangeText={handleChange("contactNo")}
              onBlur={handleBlur("contactNo")}
              keyboardType="phone-pad"
              maxLength={11}
              error={touched.contactNo ? errors.contactNo : undefined}
            />
            <RNTextInputField
              label="Estate Name"
              placeholder="Type here"
              value={form.estateName}
              onChangeText={handleChange("estateName")}
              onBlur={handleBlur("estateName")}
              error={touched.estateName ? errors.estateName : undefined}
            />
            <RNTextInputField
              label="Set Password"
              placeholder="Type here"
              value={form.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
              helperText={PASSWORD_HELPER_TEXT}
              error={touched.password ? errors.password : undefined}
            />
          </View>

          {apiError ? (
            <Text style={{ fontSize: fontSizes.sm, color: Colors.error }}>{apiError}</Text>
          ) : null}

          <RNButton
            title="Sign Up"
            onPress={handleSignUp}
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
              onClick={() => router.push("/forgot-password")}
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
              Forgot Password?
            </button>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: spacing.sm,
            }}
          >
            <Text style={{ fontSize: fontSizes.sm, color: Colors.textSecondary }}>
              Already have an account?{" "}
            </Text>
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
              Sign In
            </button>
          </View>
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}


