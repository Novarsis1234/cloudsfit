import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
      <div>
        <h2 className="text-xl font-bold text-white italic">
          Already have an account?
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium italic">
          Sign in for a faster checkout and a better experience.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-12 px-8 bg-neutral-800 hover:bg-neutral-700 text-white font-bold border-white/10 rounded-xl transition-all" data-testid="sign-in-button">
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt

