import React from "react";
import { InputProps } from "~/components/ui/input";
import { cn } from "~/lib/utils"


export type FloatingTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  minLength?: number;
  maxLength?: number;
  placeholder: string;
};

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className = "", minLength, maxLength, placeholder, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = Boolean(value && value.toString().length > 0);

    return (
      <div className="relative w-full">
        <textarea
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(hasValue)}
          ref={ref}
          className={cn(
            "peer w-full min-h-[80px] resize-y text-black rounded-md border bg-white px-4 pt-6 pb-2 text-base outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
            className
          )}
        />
        <span
          className={`absolute left-4 top-2 pointer-events-none transition-all duration-200 
            ${isFocused || hasValue
              ? "text-xs translate-y-[-50%] text-blue-500"
              : "translate-y-4 text-gray-500"}
          `}
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
);

FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingTextarea };


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