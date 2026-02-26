import { sdk } from "@/lib/config"
import { setAuthToken } from "@/lib/data/cookies"
import { NextRequest, NextResponse } from "next/server"

const decodeJwtPayload = (token: string): Record<string, any> | null => {
    try {
        const parts = token.split(".")
        if (parts.length < 2) return null

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
        const json = Buffer.from(padded, "base64").toString("utf-8")

        return JSON.parse(json)
    } catch {
        return null
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    // Google sends back ?code=...&state=... to this callback URL.
    // We pass all query params to the Medusa backend which exchanges the
    // code for a JWT using the OAuth provider's secret.
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
        console.error("Google OAuth error:", error)
        return NextResponse.redirect(new URL("/account?error=" + encodeURIComponent(error), request.url))
    }

    if (!code) {
        console.error("No code received in Google callback")
        return NextResponse.redirect(new URL("/account?error=google_auth_failed", request.url))
    }

    try {
        // Exchange the code + state with Medusa backend for a JWT token
        const query: Record<string, string> = {}
        searchParams.forEach((value, key) => {
            query[key] = value
        })

        const token = await sdk.auth.callback("customer", "google", query)

        if (!token) {
            throw new Error("No token returned from Medusa callback")
        }

        const headers = {
            authorization: `Bearer ${token}`,
        }
        const tokenPayload = decodeJwtPayload(token)
        const userMetadata = (tokenPayload?.user_metadata ?? {}) as Record<string, unknown>

        // First-time social login may have an auth identity without a customer actor yet.
        // Create the customer and refresh token so actor_id claims are present.
        try {
            await sdk.store.customer.retrieve({}, headers)
        } catch {
            const customerInput: Record<string, string> = {}
            if (typeof userMetadata.email === "string") {
                customerInput.email = userMetadata.email
            }
            if (typeof userMetadata.given_name === "string") {
                customerInput.first_name = userMetadata.given_name
            }
            if (typeof userMetadata.family_name === "string") {
                customerInput.last_name = userMetadata.family_name
            }

            try {
                await sdk.store.customer.create(customerInput, {}, headers)
                await sdk.store.customer.create(customerInput, {}, headers)
            } catch (createErr: any) {
                const isDuplicateEmail = String(createErr?.message || "")
                    .toLowerCase()
                    .includes("already has an account")

                if (!isDuplicateEmail) {
                    throw createErr
                }

                await sdk.client.fetch("/store/custom", {
                    method: "POST",
                    headers,
                })
            }

            const refreshedToken = await sdk.auth.refresh(headers)
            await setAuthToken(refreshedToken)
            return NextResponse.redirect(new URL("/account", request.url))
        }

        // Store the JWT in an httpOnly cookie
        await setAuthToken(token)

        // Redirect to the account page
        return NextResponse.redirect(new URL("/account", request.url))
    } catch (err: any) {
        const message = err?.message || "google_auth_failed"
        console.error("Error in Google OAuth callback:", message)
        return NextResponse.redirect(
            new URL(`/account?error=google_auth_failed&reason=${encodeURIComponent(String(message))}`, request.url)
        )
    }
}
