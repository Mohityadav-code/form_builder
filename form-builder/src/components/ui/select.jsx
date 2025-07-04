import React, { useState, useRef, useEffect } from 'react';

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            setIsOpen,
            value,
            onValueChange,
            ...props
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ 
  className, 
  children, 
  isOpen, 
  setIsOpen, 
  ...props 
}, ref) => (
  <button
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    {children}
    <svg
      className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder, value }) => (
  <span className="block truncate">
    {value || placeholder}
  </span>
);

const SelectContent = React.forwardRef(({ 
  className, 
  children, 
  isOpen, 
  setIsOpen, 
  onValueChange,
  ...props 
}, ref) => {
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 ${className || ''}`}
      {...props}
    >
      <div className="max-h-60 overflow-auto p-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onValueChange,
              setIsOpen
            });
          }
          return child;
        })}
      </div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ 
  className, 
  children, 
  value, 
  onValueChange, 
  setIsOpen,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`}
    onClick={() => {
      onValueChange(value);
      setIsOpen(false);
    }}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
