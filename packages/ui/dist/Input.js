import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { forwardRef } from 'react';
import { cn } from './utils';
const Input = forwardRef(
  ({ className, label, error, helperText, ...props }, ref) => {
    return _jsxs('div', {
      className: 'w-full',
      children: [
        label &&
          _jsx('label', {
            className: 'block text-sm font-medium text-gray-700 mb-1',
            children: label,
          }),
        _jsx('input', {
          className: cn(
            'flex h-10 w-full border border-gray-300 rounded-md bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500',
            className
          ),
          ref: ref,
          ...props,
        }),
        error &&
          _jsx('p', {
            className: 'mt-1 text-sm text-red-600',
            children: error,
          }),
        helperText &&
          !error &&
          _jsx('p', {
            className: 'mt-1 text-sm text-gray-500',
            children: helperText,
          }),
      ],
    });
  }
);
Input.displayName = 'Input';
export default Input;
