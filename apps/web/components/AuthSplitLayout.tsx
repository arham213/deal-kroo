import type React from "react"
import { View } from "react-native-web"
import { Colors } from "@repo/utils/constants/colors"
import { spacing } from "@repo/utils/styles/tokens"

type AuthSplitLayoutProps = {
  children: React.ReactNode
}

export default function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <>
      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          background-color: ${Colors.neutral10};
        }
        .auth-left-panel {
          flex: 1;
          min-width: 320px;
          position: relative;
          padding: ${spacing.xxxl}px ${spacing.screen}px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${Colors.neutral10};
        }
        .auth-logo {
          display: none;
          position: absolute;
          top: ${spacing.xl}px;
          left: ${spacing.xl}px;
        }
        .auth-logo img {
          height: 32px;
          width: auto;
        }
        .auth-right-panel {
          flex: 1;
          background-color: #1a1a1a;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .auth-right-bg {
          position: absolute;
          inset: 0;
          background-image: url('/web-auth-screen-split-img.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .auth-right-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.3);
        }
        .auth-right-logo {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-right-logo img {
          height: 100px;
          width: auto;
        }
        @media (max-width: 768px) {
          .auth-right-panel {
            display: none !important;
          }
          .auth-left-panel {
            padding: ${spacing.xl}px ${spacing.lg}px;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
          }
          .auth-logo {
            position: static;
            display: flex;
            justify-content: center;
            margin-bottom: ${spacing.xxl}px;
            margin-top: ${spacing.xxxl}px;
          }
          .auth-logo img {
            height: 48px;
          }
        }
      `}</style>
      <div className="auth-layout">
        {/* Left: form column */}
        <div className="auth-left-panel">
          {/* Logo at top-left */}
          <div className="auth-logo">
            <img
              src="/black-logo.png"
              alt="Deals Logo"
            />
          </div>
          {children}
        </div>

        {/* Right: image/brand panel - hidden on mobile */}
        <div className="auth-right-panel">
          {/* Background Image */}
          <div className="auth-right-bg" />

          {/* Overlay for better logo visibility */}
          <div className="auth-right-overlay" />

          {/* White Logo centered */}
          <div className="auth-right-logo">
            <img
              src="/white-logo-web.png"
              alt="Deals Logo"
            />
          </div>
        </div>
      </div>
    </>
  )
}
