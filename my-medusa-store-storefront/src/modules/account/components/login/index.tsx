import Link from "next/link"
import Image from "next/image"

const Login = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-cloudsfit-blue hover:text-cloudsfit-purple transition mb-8 sm:mb-12 font-semibold text-sm sm:text-base"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-black border-2 border-cloudsfit-purple/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl hover:shadow-purple-500/20 hover:border-cloudsfit-purple/50 transition-all duration-300">
          
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-cloudsfit-purple via-cloudsfit-blue to-pink-500 bg-clip-text text-transparent">
              Welcome to CloudsFit
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-8 sm:mb-10 font-medium">
            Sign in to your account
          </p>

          {/* Google Sign In Button */}
          <button 
            type="button" 
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Image 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              width={20} 
              height={20} 
            />
            Sign in with Google
          </button>

          {/* Terms & Privacy */}
          <p className="text-gray-500 text-xs sm:text-xs md:text-sm mt-8 sm:mt-10 leading-relaxed">
            By signing in, you agree to our{" "}
            <a href="#" className="text-cloudsfit-purple hover:text-cloudsfit-blue hover:underline transition-colors font-medium">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#" className="text-cloudsfit-purple hover:text-cloudsfit-blue hover:underline transition-colors font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

