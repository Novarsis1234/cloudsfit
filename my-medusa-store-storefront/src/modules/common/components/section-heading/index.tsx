interface SectionHeadingProps {
  title: string
  subtitle?: string
  alignment?: "left" | "center" | "right"
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: {
    title: "text-2xl sm:text-3xl",
    subtitle: "text-base sm:text-lg",
    gap: "gap-3",
  },
  md: {
    title: "text-3xl sm:text-4xl md:text-5xl",
    subtitle: "text-lg sm:text-xl",
    gap: "gap-4",
  },
  lg: {
    title: "text-4xl sm:text-5xl md:text-6xl",
    subtitle: "text-xl sm:text-2xl",
    gap: "gap-6",
  },
}

const alignmentMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

const SectionHeading = ({
  title,
  subtitle,
  alignment = "center",
  size = "md",
  className = "",
}: SectionHeadingProps) => {
  const sizeConfig = sizeMap[size]

  return (
    <div
      className={`flex flex-col ${sizeConfig.gap} ${alignmentMap[alignment]} ${className}`}
    >
      <h2 className={`font-bold tracking-tight ${sizeConfig.title}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-gray-600 ${sizeConfig.subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
