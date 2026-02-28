import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,

    http: {
      storeCors:
        process.env.STORE_CORS ||
        "http://localhost:8000,https://cloudsfit.vercel.app",

      adminCors:
        process.env.ADMIN_CORS ||
        "http://localhost:5173,https://cloudsfit-backend.onrender.com",

      authCors:
        process.env.AUTH_CORS ||
        "http://localhost:8000,http://localhost:5173,https://cloudsfit.vercel.app",

      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  admin: {
    disable: false,
    path: "/app",
    backendUrl:
      process.env.MEDUSA_BACKEND_URL ||
      "https://cloudsfit-backend.onrender.com",
  },

  modules: [
    // 🔐 AUTH MODULE
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {},
          },
          {
            resolve: "@medusajs/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID || "temp",
              clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temp",
              callbackUrl: `${
                process.env.MEDUSA_BACKEND_URL ||
                "https://cloudsfit-backend.onrender.com"
              }/auth/google/callback`,
            },
          },
        ],
      },
    },

    // 💳 PAYMENT MODULE
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@sgftech/payment-razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_ID,
              key_secret: process.env.RAZORPAY_SECRET,
              ...(process.env.RAZORPAY_ACCOUNT_NUMBER
                ? { razorpay_account: process.env.RAZORPAY_ACCOUNT_NUMBER }
                : {}),
              ...(process.env.RAZORPAY_WEBHOOK_SECRET
                ? { webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET }
                : {}),
            },
          },
        ],
      },
    },

    // 📦 FULFILLMENT MODULE
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
            options: {},
          },
        ],
      },
    },

    // ☁️ CLOUDINARY FILE STORAGE MODULE (NEW)
    {
      resolve: "@medusajs/file-cloudinary",
      options: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
    },
  ],
})