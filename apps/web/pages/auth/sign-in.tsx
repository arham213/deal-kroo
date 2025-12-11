import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, TextInput, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../../contexts/AuthContext"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import {
  createInitialSignInFormState,
  createSignInTouchedState,
  hasAnySignInError,
  hasEmptySignInField,
  signInWithEmailAndPassword,
  validateSignInField,
  validateSignInForm,
  type SignInField,
  type SignInFormState,
  type SignInTouchedState,
  type SignInValidationErrors,
} from "@repo/utils/auth/signIn"

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

export default function SignInPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthContext()
  const [form, setForm] = useState<SignInFormState>(createInitialSignInFormState)
  const [errors, setErrors] = useState<SignInValidationErrors>({})
  const [touched, setTouched] = useState<SignInTouchedState>(createSignInTouchedState(false))
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const validateForm = () => {
    const { isValid, errors: validationErrors } = validateSignInForm(form)
    setErrors(validationErrors)
    return isValid
  }

  const handleChange =
    (field: SignInField) =>
      (value: string) => {
        setForm((prev: SignInFormState) => ({
          ...prev,
          [field]: value,
        }))

        if (touched[field]) {
          const errorMessage = validateSignInField(field, value)
          setErrors((prev: SignInValidationErrors) => {
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

  const handleBlur = (field: SignInField) => () => {
    setTouched((prev: SignInTouchedState) => ({
      ...prev,
      [field]: true,
    }))

    const errorMessage = validateSignInField(field, form[field])
    setErrors((prev: SignInValidationErrors) => {
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
    setTouched(createSignInTouchedState(true))
  }

  const hasEmptyField = useMemo(
    () => hasEmptySignInField(form),
    [form],
  )

  const hasAnyError = useMemo(
    () => hasAnySignInError(form),
    [form],
  )

  const isSubmitDisabled = loading || hasEmptyField || hasAnyError

  const handleSignIn = async () => {
    setApiError(null)
    const isValid = validateForm()
    if (!isValid) {
      markAllTouched()
      return
    }

    setLoading(true)
    try {
      const { token, user } = await signInWithEmailAndPassword({
        email: form.email,
        password: form.password,
      })

      await setToken(token)
      await setUser(user)

      const onboardingCompleted = (user as any)?.onBoardingCompleted
      if (onboardingCompleted) {
        router.push("/listings")
      } else {
        router.push("/onboarding")
      }
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
          maxWidth: 480,
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
            Sign In
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            Welcome back! Sign in to your account
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
              value={form.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              error={touched.email ? errors.email : undefined}
            />
            <RNTextInputField
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
              editable={!loading}
              error={touched.password ? errors.password : undefined}
            />
          </View>

          {apiError ? (
            <Text style={{ fontSize: fontSizes.sm, color: Colors.error }}>{apiError}</Text>
          ) : null}

          <RNButton
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            disabled={isSubmitDisabled}
            style={{
              marginTop: 8,
            }}
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
              Don't have an account?{" "}
            </Text>
            <button
              type="button"
              onClick={() => router.push("/auth/sign-up")}
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
              Sign Up
            </button>
          </View>
        </View>
      </ScrollView>
    </AuthSplitLayout>
  )
}

