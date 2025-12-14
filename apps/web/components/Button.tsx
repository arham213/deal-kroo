import { Colors } from "@repo/utils/constants/colors"
import { fontSizes, fontWeights, radius, spacing } from "@repo/utils/styles/tokens"

type ButtonProps = {
    title: string
    loadingTitle?: string
    onPress: () => void
    loading?: boolean
    disabled?: boolean
    style?: React.CSSProperties
}

export const Button = ({ title, loadingTitle, onPress, loading, disabled, style }: ButtonProps) => (
    <button
        type="button"
        onClick={onPress}
        disabled={disabled || loading}
        style={{
            width: "100%",
            borderRadius: radius.pill,
            paddingTop: spacing.sm2,
            paddingBottom: spacing.sm2,
            border: "none",
            cursor: disabled || loading ? "not-allowed" : "pointer",
            opacity: disabled || loading ? 0.5 : 1,
            backgroundColor: Colors.neutral100,
            color: Colors.white,
            fontSize: fontSizes.base,
            fontWeight: fontWeights.regular,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
            ...(style || {}),
        }}
    >
        {loading ? (loadingTitle || "Loading...") : title}
    </button>
)

export default Button
