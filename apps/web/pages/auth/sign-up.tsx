import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { ScrollView, Text, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, spacing } from "@repo/utils/styles/tokens"
import AuthSplitLayout from "../../components/AuthSplitLayout"
import { TextField } from "../../components/TextField"
import { Button } from "../../components/Button"
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

      router.push({
        pathname: "/auth/verify-otp",
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
            Sign Up
          </Text>
          <Text
            style={{
              fontSize: fontSizes.base,
              color: Colors.neutral100,
              textAlign: "center",
            }}
          >
            Enter details below to sign up
          </Text>
        </View>

        <View style={{ gap: spacing.xxxl }}>
          <TextField
            label="Full Name"
            placeholder="Type here"
            value={form.fullName}
            onChangeText={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            error={touched.fullName ? errors.fullName : undefined}
          />

          <TextField
            label="Email"
            placeholder="example@gmail.com"
            value={form.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            autoCapitalize="none"
            keyboardType="email-address"
            error={touched.email ? errors.email : undefined}
          />

          <TextField
            label="Set Password"
            placeholder="Type here"
            value={form.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            secureTextEntry
            helperText={PASSWORD_HELPER_TEXT}
            error={touched.password ? errors.password : undefined}
          />

          <TextField
            label="Contact Number"
            placeholder="+92  300 xxxx xxx"
            value={form.contactNo}
            onChangeText={handleChange("contactNo")}
            onBlur={handleBlur("contactNo")}
            keyboardType="phone-pad"
            maxLength={11}
            error={touched.contactNo ? errors.contactNo : undefined}
          />

          <TextField
            label="Estate Name"
            placeholder="Type here"
            value={form.estateName}
            onChangeText={handleChange("estateName")}
            onBlur={handleBlur("estateName")}
            error={touched.estateName ? errors.estateName : undefined}
          />
        </View>

        {apiError ? (
          <Text style={{ fontSize: fontSizes.sm, color: Colors.error, marginTop: spacing.lg }}>
            {apiError}
          </Text>
        ) : null}

        <View style={{ marginTop: spacing.xxxl }}>
          <Button
            title="Sign Up"
            loadingTitle="Signing Up..."
            onPress={handleSignUp}
            loading={loading}
            disabled={isSubmitDisabled}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: spacing.xl,
          }}
        >
          <Text style={{ fontSize: fontSizes.sm, color: Colors.neutral80 }}>
            Already have an account?{" "}
          </Text>
          <button
            type="button"
            onClick={() => router.push("/auth/sign-in")}
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
      </ScrollView>
    </AuthSplitLayout>
  )
}
