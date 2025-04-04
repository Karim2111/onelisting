import React from "react";
import type { InputProps } from "~/components/ui/input";
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
            "peer w-full resize-y rounded-md border px-4 pt-6 pb-2 bg-background transition-all focus:border-primary focus:border-2 outline-none",
            className
          )}
        />
        <span
          className={`absolute left-4 top-2 pointer-events-none transition-all duration-300 ease-out
            ${isFocused || hasValue
              ? "text-xs translate-y-[-20%] "
              : "translate-y-2"}
          `}
        >
          {placeholder}
        </span>
        {minLength && (
        <div className="mt-1 text-xs ">
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
        className={`peer w-full rounded-md border px-4 pt-6 pb-2 text-base outline-none transition-all bg-background
         focus:border-primary focus:border-2 outline-none h-14 ${className}`}
      />
      <span
        className={`absolute left-4 pointer-events-none transition-all duration-300 ease-out
          ${isFocused || value ? 'text-xs translate-y-1 ' : 'translate-y-4 '}`}
      >
        {placeholder}
      </span>
      {minLength && (
        <div className="mt-1 text-xs ">
            {!value ? -minLength : value.toString().length < minLength ? -minLength + value.toString().length : maxLength ? `${value.toString().length}/${maxLength}` : 0} Characters
         </div>
        )}
    </div>
  );
}

export type NumberInputProps = Omit<InputProps, 'type'> & {
  allowDecimals?: boolean;
  step?: number;
};

export function FloatingNumberInput({ 
  className = "", 
  placeholder, 
  value, 
  onChange,
  allowDecimals = false,
  step = 1,
  ...props 
}: NumberInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState<string>(value?.toString() ?? '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Only allow numbers and optionally a decimal point
    const regex = allowDecimals ? /^$|^[0-9]+\.?[0-9]*$/ : /^$|^[0-9]+$/;
    
    if (regex.test(input)) {
      setDisplayValue(input);
      
      // Convert to number or empty string
      if (input === '') {
        if (onChange) {
          onChange({ ...e, target: { ...e.target, value: '' } });
        }
      } else {
        const numericValue = allowDecimals ? parseFloat(input) : parseInt(input, 10);
        if (!isNaN(numericValue)) {
          if (onChange) {
            onChange({ ...e, target: { ...e.target, value: numericValue.toString() } });
          }
        }
      }
    }
  };
  
  // Keep display value in sync with actual value
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const hasValue = displayValue !== '';

  return (
    <div className="relative w-full">
      <input
        {...props}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(hasValue)}
        className={cn(
          "peer w-full rounded-md border px-4 pt-6 pb-2 text-base outline-none transition-all bg-background focus:border-primary focus:border-2 outline-none h-14",
          className
        )}
      />
      <span
        className={`absolute left-4 pointer-events-none transition-all duration-300 ease-out
          ${isFocused || hasValue ? 'text-xs translate-y-1 ' : 'translate-y-4 '}`}
      >
        {placeholder}
      </span>
    </div>
  );
}