'use client';

import { useState, type KeyboardEvent, type ChangeEvent, type FocusEvent, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface TagsFieldProps {
  maxTags?: number;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  }

export default function TagsField({
  maxTags = Infinity,
  value,
  onChange,
  placeholder = "Add Tags",
  className = "",
}: TagsFieldProps) {
  const [tags, setTags] = useState<string[]>(value || []);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state for tags

  // Sync internal tags state with form state
  useEffect(() => {
    setTags(value);
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null); // Reset error on input change
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== '' && tags.length < maxTags) {
      if (!tags.includes(trimmedValue)) {
        const newTags = [...tags, trimmedValue];
        setTags(newTags);
        onChange(newTags); // Update form state
        setInputValue('');
        setError(null); // Clear any existing error
      } else {
        setError(`The tag "${trimmedValue}" is already added.`); // Set error for duplicate tag
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags); // Update form state
    setError(null); // Reset error on tag removal
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
      if (inputValue.trim() !== '') {
        addTag();
      }
    }
  };

  const isMaxTagsReached = tags.length >= maxTags;

  return (
    <div className="w-full">
      <div className="relative" onBlur={handleBlur}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          className={`w-full px-4 pt-6 pb-2 pr-10 border rounded-md focus:outline-none focus:border-primary focus:border-2 bg-background h-14 transition-all duration-300 ease-out ${
            isMaxTagsReached ? 'bg-muted text-muted-foreground' : ''
          } ${className}`}
          disabled={isMaxTagsReached}
        />
        <span
          className={`absolute left-4 pointer-events-none transition-all duration-300 ease-out ${
            isFocused || inputValue.trim() !== ''
              ? 'top-2 text-xs opacity-100'
              : 'top-1/2 -translate-y-1/2 text-base opacity-100'
          }`}
        >
          {placeholder}
        </span>
        <Button
          onClick={addTag}
          disabled={isMaxTagsReached || inputValue.trim() === ''}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          variant="ghost"
          type="button"
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full flex items-center"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-1.5 text-primary hover:text-primary/80 focus:outline-none"
              aria-label={`Remove ${tag}`}
              type="button"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
