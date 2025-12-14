import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing } from "@repo/utils/styles/tokens"
import { useAuthContext } from "../../contexts/AuthContext"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import { TextField } from "../../components/TextField"
import { Button } from "../../components/Button"
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
            Sign In
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.neutral100,
              textAlign: "center",
            }}
          >
            Enter details below to sign in
          </Text>
        </View>

        <View style={{ gap: spacing.xxxl }}>
          <TextField
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
          <TextField
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
          <Text style={{ fontSize: fontSizes.sm, color: Colors.error, marginTop: spacing.lg }}>
            {apiError}
          </Text>
        ) : null}

        <View style={{ marginTop: spacing.xxxl }}>
          <Button
            title="Sign In"
            loadingTitle="Signing In..."
            onPress={handleSignIn}
            loading={loading}
            disabled={isSubmitDisabled}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: spacing.xxl,
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/auth/forgot-password")}
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
            marginTop: spacing.xl,
            gap: spacing.xxs,
          }}
        >
          <Text style={{ fontSize: fontSizes.sm, color: Colors.neutral80 }}>
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
      </ScrollView>
    </AuthSplitLayout>
  )
}
