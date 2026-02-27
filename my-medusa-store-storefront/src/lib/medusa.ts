import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://cloudsfit-backend.onrender.com",
  maxRetries: 3,
  withCredentials: true,
})
