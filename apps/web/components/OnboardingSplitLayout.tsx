import type React from "react"
import { Colors } from "@repo/utils/constants/colors"
import { spacing } from "@repo/utils/styles/tokens"

type OnboardingSplitLayoutProps = {
  children: React.ReactNode
}

export default function OnboardingSplitLayout({ children }: OnboardingSplitLayoutProps) {
  return (
    <>
      <style>{`
        .onboarding-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          background-color: ${Colors.neutral10};
        }
        .onboarding-left-panel {
          flex: 1;
          min-width: 320px;
          position: relative;
          padding: ${spacing.xxxl}px ${spacing.screen}px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${Colors.neutral10};
        }
        .onboarding-right-panel {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .onboarding-right-bg {
          position: absolute;
          inset: 0;
          background-image: url('/onboarding-screens-img.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (max-width: 768px) {
          .onboarding-layout {
            flex-direction: column;
            min-height: 100vh;
            position: relative;
            background-image: url('/web-auth-screen-split-img.png');
            background-size: cover;
            background-position: center bottom;
            background-repeat: no-repeat;
          }
          .onboarding-left-panel {
            flex: none;
            padding: ${spacing.xxxl}px ${spacing.xl}px ${spacing.xxl}px;
            background-color: ${Colors.neutral10};
            z-index: 2;
            justify-content: flex-start;
            align-items: stretch;
            border-bottom-left-radius: 32px;
            border-bottom-right-radius: 32px;
            min-width: unset;
          }
          .onboarding-right-panel {
            flex: 1;
            display: block !important;
            position: relative;
          }
          .onboarding-right-bg {
            display: none;
          }
        }
      `}</style>
      <div className="onboarding-layout">
        {/* Left: content column */}
        <div className="onboarding-left-panel">
          {children}
        </div>

        {/* Right: image panel - visible on mobile too */}
        <div className="onboarding-right-panel">
          <div className="onboarding-right-bg" />
        </div>
      </div>
    </>
  )
}

