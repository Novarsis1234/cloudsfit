import { ReactNode } from "react"

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  paddingY?: "sm" | "md" | "lg" | "xl"
  bgColor?: "white" | "light" | "dark"
}

const paddingYMap = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-20",
  lg: "py-16 md:py-28",
  xl: "py-20 md:py-32",
}

const bgColorMap = {
  white: "bg-white",
  light: "bg-gray-50",
  dark: "bg-black",
}

const SectionWrapper = ({
  children,
  className = "",
  paddingY = "md",
  bgColor = "white",
}: SectionWrapperProps) => {
  return (
    <section
      className={`${bgColorMap[bgColor]} ${paddingYMap[paddingY]} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

export default SectionWrapper
