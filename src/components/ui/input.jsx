import { cn } from '@/lib/utils';
import * as React from 'react';
 
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e0e0e0] disabled:text-[#999999]',
        className
      )}
      // onCopy={disableCopyPaste}
      // onPaste={disableCopyPaste}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
