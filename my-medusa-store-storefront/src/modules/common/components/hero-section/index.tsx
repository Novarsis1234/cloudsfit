import { ReactNode } from "react"

interface HeroProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  ctaText?: string
  ctaHref?: string
  secondaryCta?: {
    text: string
    href: string
  }
  backgroundImage?: string
  fullHeight?: boolean
  textColor?: "light" | "dark"
}

const Hero = ({
  title,
  subtitle,
  ctaText = "Shop Now",
  ctaHref = "/store",
  secondaryCta,
  backgroundImage,
  fullHeight = true,
  textColor = "light",
}: HeroProps) => {
  return (
    <div
      className={`relative w-full overflow-hidden bg-black ${
        fullHeight ? "min-h-screen" : "min-h-96"
      } flex items-center justify-center`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-30" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Main Title */}
        <h1
          className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${
            textColor === "light" ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={`mt-6 text-lg sm:text-xl md:text-2xl ${
              textColor === "light"
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            {subtitle}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href={ctaHref}
            className="inline-block bg-white px-8 py-3 text-center font-semibold text-black transition-all duration-300 hover:bg-gray-100 hover:shadow-lg md:px-10 md:py-4 md:text-lg"
          >
            {ctaText}
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className={`inline-block border-2 px-8 py-3 text-center font-semibold transition-all duration-300 md:px-10 md:py-4 md:text-lg ${
                textColor === "light"
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              {secondaryCta.text}
            </a>
          )}
        </div>
      </div>

      {/* Scroll indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden animate-bounce md:block">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  )
}

export default Hero
