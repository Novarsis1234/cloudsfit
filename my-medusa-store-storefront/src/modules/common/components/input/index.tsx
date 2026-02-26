import { Label, clx } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import Eye from "@/modules/common/icons/eye"
import EyeOff from "@/modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, any>
  touched?: Record<string, any>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, errors, required, topLabel, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password") {
        setInputType(showPassword ? "text" : "password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    const hasError = !!(errors && touched && errors[name] && touched[name])
    const errorMessage = (errors?.[name]?.message || errors?.[name]) as string

    return (
      <div className="flex flex-col relative w-full group">
        {topLabel && (
          <Label className="text-[10px] text-white/30 mb-1 ml-1 uppercase tracking-widest font-black">
            {topLabel}
          </Label>
        )}
        <div className="relative">
          <input
            {...props}
            type={inputType}
            name={name}
            placeholder=" "
            className={clx(
              "flex w-full px-4 pt-6 pb-2 text-white bg-black/40 border border-white/10 rounded-xl transition-all duration-300 outline-none",
              "focus:bg-black/60 focus:border-cloudsfit-blue/50 focus:ring-4 focus:ring-cloudsfit-blue/10",
              "group-hover:border-white/20",
              {
                "border-rose-500/50 focus:border-rose-500": hasError,
              },
              className
            )}
            ref={inputRef}
          />
          <label
            onClick={() => inputRef.current?.focus()}
            className={clx(
              "absolute left-4 top-4 text-white/30 transition-all duration-300 pointer-events-none text-base select-none",
              "group-focus-within:top-1.5 group-focus-within:text-[10px] group-focus-within:text-cloudsfit-blue/70 group-focus-within:uppercase group-focus-within:font-black group-focus-within:tracking-widest",
              {
                "top-1.5 text-[10px] text-white/50 uppercase font-black tracking-widest": props.value || props.defaultValue || inputRef.current?.value,
              }
            )}
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {hasError && (
          <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
            {errorMessage}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
