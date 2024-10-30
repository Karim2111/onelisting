"use client"

import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  maxLength?: number
}

export function FloatingInput({ className = "", maxLength, placeholder, ...props }: InputProps) {
    const [value, setValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);
  
    return (
      <div className="relative w-full">
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(value.length === 0 ? false : true)}
          // Set text color to black
          className={`peer w-full text-black rounded-md border bg-white px-4 pt-6 pb-2 text-base outline-none transition-all 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${className}`}
        />
        <span
          className={`absolute left-4 pointer-events-none transition-all duration-200 
            ${isFocused || value ? 'text-xs translate-y-1 text-blue-500' : 'translate-y-4 text-gray-500'}`}
        >
          {placeholder} {/* Use only this span for displaying the placeholder */}
        </span>
        {maxLength && (
          <div className="mt-1 text-xs text-gray-500">
            {value.length}/{maxLength} characters
          </div>
        )}
      </div>
    );
  }

export function FloatingSelect({ className = "", placeholder }: { className?: string; placeholder: string }) {
  const [value, setValue] = React.useState("")
  const options = ["United States", "Canada", "United Kingdom", "Australia"]

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`peer w-full rounded-md border bg-white px-4 pt-6 pb-2 text-base outline-none transition-all 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${className}
          ${!value ? 'text-transparent' : 'text-inherit'}`}
      >
        <option value="" disabled hidden></option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span
        className={`absolute left-4 pointer-events-none transition-all duration-200 text-gray-500
          ${value ? 'text-xs translate-y-1 text-blue-500' : 'translate-y-4'}`}
      >
        {placeholder}
      </span>
    </div>
  )
}

export default function Component() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6">
      <FloatingInput 
        placeholder="Name" 
        maxLength={50} 
      />
      <FloatingInput 
        placeholder="Email" 
        type="email" 
      />
      <FloatingSelect 
        placeholder="Select country" 
      />
    </div>
  )
}