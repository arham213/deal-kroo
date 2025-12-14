import { Text, TextInput, View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"

type TextFieldProps = React.ComponentProps<typeof TextInput> & {
    label?: string
    error?: string
    helperText?: string
}

export const TextField = ({
    label,
    error,
    helperText,
    ...props
}: TextFieldProps) => {
    const showHelperText = !error && helperText

    return (
        <View style={{ gap: spacing.sm }}>
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
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
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
                        fontSize: fontSizes.xs,
                        color: Colors.error,
                    }}
                >
                    {error}
                </Text>
            ) : showHelperText ? (
                <Text
                    style={{
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

export default TextField
