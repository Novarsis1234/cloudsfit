import Link from "next/link"

interface PromoBannerProps {
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
  backgroundImage?: string
  layout?: "text-left" | "text-center" | "text-right"
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "h-48 sm:h-64",
  md: "h-64 sm:h-80 md:h-96",
  lg: "h-80 sm:h-96 md:h-[500px]",
}

const PromoBanner = ({
  title,
  description,
  ctaText = "Shop Now",
  ctaHref = "/store",
  backgroundImage,
  layout = "text-left",
  size = "md",
}: PromoBannerProps) => {
  const layoutMap = {
    "text-left": "flex-start",
    "text-center": "flex-center",
    "text-right": "flex-end",
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${sizeMap[size]}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "#f5f5f5" }
      }
    >
      <div
        className={`flex h-full items-center justify-${
          layout === "text-left" ? "start" : layout === "text-right" ? "end" : "center"
        } px-6 sm:px-10 md:px-16`}
      >
        <div
          className={`max-w-xl space-y-6 ${
            layout === "text-left"
              ? "text-left"
              : layout === "text-right"
                ? "text-right"
                : "text-center"
          }`}
        >
          {/* Title */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-base text-gray-100 sm:text-lg md:text-xl">
              {description}
            </p>
          )}

          {/* CTA Button */}
          <div>
            <Link
              href={ctaHref}
              className="inline-block border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black md:px-10 md:py-4 md:text-lg"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoBanner
