export const sanitizeUrls = <T>(obj: T): T => {
    if (!obj) return obj

    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://cloudsfit-backend.onrender.com"
    const LOCALHOST_URL = "http://localhost:9000"

    const str = JSON.stringify(obj)
    if (str.includes(LOCALHOST_URL)) {
        try {
            // Replace all occurrences of localhost:9000 with the production backend URL
            const sanitizedStr = str.replace(new RegExp(LOCALHOST_URL, "g"), BACKEND_URL)
            return JSON.parse(sanitizedStr)
        } catch (e) {
            console.error("[sanitizeUrls] Failed to parse sanitized string", e)
            return obj
        }
    }

    return obj
}
