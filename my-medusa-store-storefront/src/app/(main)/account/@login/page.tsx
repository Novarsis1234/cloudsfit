import { Metadata } from "next"

import LoginTemplate from "@/modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in - CloudsFit",
  description: "Sign in to your CloudsFit account with Google.",
}

export default function Login() {
  return <LoginTemplate />
}

