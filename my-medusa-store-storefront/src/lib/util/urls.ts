export const sanitizeUrls = <T>(obj: T): T => {
    if (!obj) return obj

    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://cloudsfit-backend.onrender.com"
    const LOCALHOST_URL = "http://localhost:9000"

    // Simple string replacement if it's just a string
    if (typeof obj === "string") {
        return obj.replace(new RegExp(LOCALHOST_URL, "g"), BACKEND_URL) as any
    }

    // Recursive cleaning if it's an object or array
    if (typeof obj === "object") {
        // Handle arrays
        if (Array.isArray(obj)) {
            return obj.map(v => sanitizeUrls(v)) as any
        }

        // Handle objects
        const newObj: any = {}
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = sanitizeUrls((obj as any)[key])
            }
        }
        return newObj
    }

    return obj
}
