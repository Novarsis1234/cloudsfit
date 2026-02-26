export default function medusaError(error: any): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const url = error.config?.url || error.response?.url || "unknown"
    const baseURL = error.config?.baseURL || ""

    try {
      const u = new URL(url, baseURL)
      console.error("Resource:", u.toString())
    } catch {
      console.error("Resource:", url)
    }

    console.error("Status code:", error.response.status)

    // Extracting the error message from the response
    const message = error.message || "An error occurred"

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + ".")
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received from server.")
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || "An unexpected error occurred.")
  }
}
