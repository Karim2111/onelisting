'use client';

import { useState, KeyboardEvent, ChangeEvent, FocusEvent, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface TagsFieldProps {
  maxTags?: number;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagsField({
  maxTags = Infinity,
  value,
  onChange,
  placeholder = "Add Tags",
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
    <div className="w-full max-w-md mx-auto p-6">
      <div className="relative" onBlur={handleBlur}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          className={`w-full px-3 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--foreground)] transition-all duration-300 ease-out ${
            isMaxTagsReached ? 'bg-gray-100' : ''
          }`}
          disabled={isMaxTagsReached}
        />
        <span
          className={`absolute left-3 text-gray-400 pointer-events-none transition-all duration-300 ease-out ${
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
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          variant="ghost"
        >
          <Plus className="h-4 w-4 hover:bg-white-900" color="gray" />
        </Button>
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>} {/* Show error message */}
      <p className="text-sm text-gray-600 mt-2">
        Optional. Tags added: {tags.length}
        {maxTags !== Infinity && ` / ${maxTags}`}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-1.5 text-blue-800 hover:text-blue-900 focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
