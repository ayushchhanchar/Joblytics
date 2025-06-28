import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
}

export function InputField({
  label,
  type = 'text',
  placeholder,
  error,
  className,
  required = false,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={props.id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={inputType}
          placeholder={placeholder}
          className={cn(
            'pr-10',
            error && 'border-destructive focus-visible:ring-destructive',
            isPassword && 'pr-10'
          )}
          {...props}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}