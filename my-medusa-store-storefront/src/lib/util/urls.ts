/**
 * Robustly replace LOCALHOST_URL with BACKEND_URL in any data structure.
 * Includes protection against circular references to avoid stack overflows.
 */
export const sanitizeUrls = <T>(obj: T, visited = new WeakSet<any>()): T => {
    if (!obj || typeof obj !== "object") {
        if (typeof obj === "string") {
            const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://cloudsfit-backend.onrender.com"
            const LOCALHOST_URL = "http://localhost:9000"
            return obj.replace(new RegExp(LOCALHOST_URL, "g"), BACKEND_URL) as any
        }
        return obj
    }

    // Protection against circular references
    if (visited.has(obj)) {
        return obj
    }
    visited.add(obj)

    // Recursive cleaning
    if (Array.isArray(obj)) {
        return obj.map(v => sanitizeUrls(v, visited)) as any
    }

    // Handle objects
    const newObj: any = {}
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = sanitizeUrls((obj as any)[key], visited)
        }
    }
    return newObj
}
