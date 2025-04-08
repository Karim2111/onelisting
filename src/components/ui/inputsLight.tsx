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
    const [isScrolled, setIsScrolled] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!);
    
    // Ensure value is always a string, even if undefined or null
    const textareaValue = value ?? '';
    const hasValue = Boolean(textareaValue && textareaValue.toString().length > 0);

    // Handle scroll events
    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      setIsScrolled(textarea.scrollTop > 0);
    };

    return (
      <div className="relative w-full">
        <textarea
          {...props}
          value={textareaValue}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(hasValue)}
          onScroll={handleScroll}
          ref={textareaRef}
          className={cn(
            "peer w-full rounded-md border px-4 pt-6 pb-2 bg-background",
            "focus:border-primary focus:border-2 outline-none",
            "resize-y min-h-[120px] max-h-[400px]",
            "transition-[border,box-shadow]",
            className
          )}
          style={{
            resize: 'vertical',
            willChange: 'height',
          }}
        />
        <span
          className={cn(
            "absolute left-4 top-2 pointer-events-none",
            "transition-[opacity,transform] duration-200",
            isScrolled ? "opacity-0" : "opacity-100",
            isFocused || hasValue
              ? "text-xs translate-y-[-20%]"
              : "translate-y-2"
          )}
        >
          {placeholder}
        </span>
        {minLength && (
        <div className="mt-1 text-xs">
            {!textareaValue ? -minLength : textareaValue.toString().length < minLength ? -minLength + textareaValue.toString().length : maxLength ? `${textareaValue.toString().length}/${maxLength}` : 0} Characters
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
  
  // Ensure value is always a string, even if it's undefined or null
  const inputValue = value ?? '';

  return (
    <div className="relative w-full">
      <input
        {...props}
        value={inputValue} // Use safe value
        onChange={onChange} // Use form-controlled onChange
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(inputValue ? true : false)}
        className={`peer w-full rounded-md border px-4 pt-6 pb-2 text-base outline-none transition-all bg-background
         focus:border-primary focus:border-2 h-14 ${className}`}
      />
      <span
        className={`absolute left-4 pointer-events-none transition-all duration-300 ease-out
          ${isFocused || inputValue ? 'text-xs translate-y-1 ' : 'translate-y-4 '}`}
      >
        {placeholder}
      </span>
      {minLength && (
        <div className="mt-1 text-xs ">
            {!inputValue ? -minLength : inputValue.toString().length < minLength ? -minLength + inputValue.toString().length : maxLength ? `${inputValue.toString().length}/${maxLength}` : 0} Characters
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
  
  // Convert value to string, handling undefined, null, and NaN
  const safeValue = (value !== undefined && value !== null && !isNaN(Number(value))) 
    ? String(value)
    : '';
    
  const [displayValue, setDisplayValue] = React.useState<string>(safeValue);
  
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
    const newValue = (value !== undefined && value !== null && !isNaN(Number(value))) 
      ? String(value)
      : '';
      
    if (displayValue !== newValue) {
      setDisplayValue(newValue);
    }
  }, [value, displayValue]);

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
          "peer w-full rounded-md border px-4 pt-6 pb-2 text-base transition-all bg-background focus:border-primary focus:border-2 outline-none h-14",
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