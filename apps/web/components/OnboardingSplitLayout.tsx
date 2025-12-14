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
          background-image: url('/web-auth-screen-split-img.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        @media (max-width: 768px) {
          .onboarding-right-panel {
            display: none !important;
          }
          .onboarding-left-panel {
            padding: ${spacing.xl}px ${spacing.lg}px;
          }
        }
      `}</style>
      <div className="onboarding-layout">
        {/* Left: content column */}
        <div className="onboarding-left-panel">
          {children}
        </div>

        {/* Right: image panel - hidden on mobile */}
        <div className="onboarding-right-panel">
          <div className="onboarding-right-bg" />
        </div>
      </div>
    </>
  )
}
