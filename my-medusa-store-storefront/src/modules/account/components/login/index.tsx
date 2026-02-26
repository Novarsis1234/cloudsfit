"use client"

import Link from "next/link"
import Image from "next/image"

import { useActionState, useState, useEffect } from "react"
import { login, signup } from "@/lib/data/customer"
import { sdk } from "@/lib/config"

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loginState, loginAction, isLoginPending] = useActionState(login, null)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null)
  const [registered, setRegistered] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const error = isLogin ? loginState?.error : signupState?.error
  const isPending = isLogin ? isLoginPending : isSignupPending

  useEffect(() => {
    if (signupState?.success) {
      setRegistered(true)
      setIsLogin(true)
    }
  }, [signupState])

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-black py-12">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cloudsfit-blue hover:text-cloudsfit-purple transition mb-8 font-semibold text-sm sm:text-base"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* Card */}
        <div className="relative bg-gradient-to-br from-neutral-900 to-black border-2 border-cloudsfit-purple/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl hover:shadow-purple-500/20 hover:border-cloudsfit-purple/50 transition-all duration-300">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-cloudsfit-purple via-cloudsfit-blue to-pink-500 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Create Account"}
            </span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-8 sm:mb-10 font-medium">
            {isLogin ? "Sign in to your account" : "Join CloudsFit today"}
          </p>

          <form action={isLogin ? loginAction : signupAction} className="space-y-4 mb-8 text-left">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">First Name</label>
                  <input
                    name="first_name"
                    required
                    placeholder="First Name"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-cloudsfit-blue outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Last Name</label>
                  <input
                    name="last_name"
                    required
                    placeholder="Last Name"
                    className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-cloudsfit-blue outline-none transition-all text-sm"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-cloudsfit-blue outline-none transition-all text-sm"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Phone Number</label>
                <input
                  name="phone"
                  placeholder="+91 1234567890"
                  className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-cloudsfit-blue outline-none transition-all text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-1 ml-1 uppercase">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-cloudsfit-blue outline-none transition-all text-sm"
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs font-medium p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                {error}
              </div>
            )}

            {isLogin && registered && !error && (
              <div className="text-green-500 text-xs font-medium p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                Registration successful! Please sign in with your credentials.
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-cloudsfit-purple/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {isPending ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors"
            >
              {isLogin ? "New to CloudsFit? " : "Already have an account? "}
              <span className="text-cloudsfit-blue font-bold underline">
                {isLogin ? "Create an account" : "Log in"}
              </span>
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-neutral-800 flex-1"></div>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Or continue with</span>
              <div className="h-px bg-neutral-800 flex-1"></div>
            </div>

            <button
              disabled={googleLoading}
              onClick={async () => {
                setGoogleLoading(true)
                try {
                  const callbackUrl = window.location.origin + "/auth/callback/google"
                  const result = await sdk.auth.login("customer", "google", {
                    callback_url: callbackUrl,
                  })

                  if (typeof result !== "string" && result.location) {
                    window.location.href = result.location
                  } else {
                    throw new Error("No redirect location received")
                  }
                } catch (error) {
                  console.error("Google login error:", error)
                  setGoogleLoading(false)
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all shadow-lg text-sm disabled:opacity-50"
            >
              {googleLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                  Please wait...
                </span>
              ) : (
                <>
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={18}
                    height={18}
                  />
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          <p className="text-gray-500 text-[10px] sm:text-xs mt-8 text-center opacity-60">
            By continuing, you agree to our{" "}
            <span className="text-gray-400 hover:underline">Terms</span> & <span className="text-gray-400 hover:underline">Privacy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
