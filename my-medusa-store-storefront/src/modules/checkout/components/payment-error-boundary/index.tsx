"use client"

import React, { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class PaymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    console.error("[PaymentErrorBoundary] Caught error:", error)
    // Restore scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[PaymentErrorBoundary] Error details:", error, errorInfo)
    // Restore scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Payment Error
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                We encountered an issue initializing the payment. This might be due to:
              </p>
              <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] mb-4 space-y-1">
                <li>Payment gateway configuration issue</li>
                <li>Network connectivity problems</li>
                <li>Backend service unavailable</li>
              </ul>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    document.body.style.overflow = "auto"
                    document.documentElement.style.overflow = "auto"
                    this.setState({ hasError: false, error: null })
                  }}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition-colors text-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    document.body.style.overflow = "auto"
                    document.documentElement.style.overflow = "auto"
                    window.location.reload()
                  }}
                  className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-md hover:bg-[var(--color-surface-dark)] transition-colors text-sm"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
