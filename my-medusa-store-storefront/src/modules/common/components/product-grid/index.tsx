import { ReactNode } from "react"

interface ProductGridProps {
  children: ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: "sm" | "md" | "lg"
}

const gapMap = {
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
}

const ProductGrid = ({
  children,
  columns = { mobile: 2, tablet: 3, desktop: 4 },
  gap = "md",
}: ProductGridProps) => {
  return (
    <div
      className={`grid gapMap[gap] ${gapMap[gap]} grid-cols-${columns.mobile || 2} sm:grid-cols-${columns.tablet || 3} md:grid-cols-${columns.desktop || 4}`}
    >
      {children}
    </div>
  )
}

export default ProductGrid
