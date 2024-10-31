import React from "react";
import { InputProps } from "~/components/ui/input";

export function FloatingInput({ className = "", minLength, maxLength, placeholder, value, onChange, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        value={value} // Use form-controlled value
        onChange={onChange} // Use form-controlled onChange
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value ? true : false)}
        className={`peer w-full text-black rounded-md border bg-white px-4 pt-6 pb-2 text-base outline-none transition-all 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${className}`}
      />
      <span
        className={`absolute left-4 pointer-events-none transition-all duration-200 
          ${isFocused || value ? 'text-xs translate-y-1 text-blue-500' : 'translate-y-4 text-gray-500'}`}
      >
        {placeholder}
      </span>
      {minLength && (
        <div className="mt-1 text-xs text-gray-500">
            {!value ? -minLength : value.toString().length < minLength ? -minLength + value.toString().length : maxLength ? `${value.toString().length}/${maxLength}` : 0} Characters
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