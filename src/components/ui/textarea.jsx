// import * as React from 'react';

// import { cn } from '@/lib/utils';
// import { disableCopyPaste } from '@/utils/disableCopyPaste';

// const Textarea = React.forwardRef(({ className,maxLength,charCount, ...props }, ref) => {
//   return (
//     <div style={{ position: 'relative', width: '100%' }}>
//     <textarea
//       className={cn(
//         'flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
//         className
//       )}
//       // onCopy={disableCopyPaste}
//       // onPaste={disableCopyPaste}
//       ref={ref}
//       {...props}
//     />
//     <div style={{
//       position: 'absolute',
//       bottom: '8px',
//       right: '8px',
//       color: '#7C7D7E',
//       fontSize: '12px',
//     }}>
//       {charCount} /{ maxLength?maxLength:500}
//     </div>
//   </div>
//   );
// });
// Textarea.displayName = 'Textarea';

// export { Textarea };

import * as React from "react";
import { cn } from "@/lib/utils";
 
// const Textarea = React.forwardRef(
//   ({ className, maxLength = 500, value = '', onChange, ...props }, ref) => {
//     const [charCount, setCharCount] = React.useState(value.length);

//     const handleInputChange = (e) => {
//       // Set the character count even if the length exceeds the maxLength
//       setCharCount(e.target.value.length);

//       // Call the external onChange function if provided
//       if (onChange) {
//         onChange(e); // If there's an external onChange, call it
//       }
//     };

//     React.useEffect(() => {
//       // Sync charCount with the `value` prop if it's controlled
//       setCharCount(value.length);
//     }, [value]);

//     const isExceedingLimit = charCount > maxLength;

//     return (
//       <div style={{ position: 'relative', width: '100%' }}>
//         <textarea
//           className={cn(
//             'flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e0e0e0] disabled:text-[#999999]',
//             className
//           )}
//           maxLength={maxLength}
//           onChange={handleInputChange}
//           value={value} // Use the controlled `value` prop if provided
//           ref={ref}
//           {...props}
//         />
//         <div
//           style={{
//             position: 'absolute',
//             bottom: '8px',
//             right: '8px',
//             color: '#7C7D7E',
//             fontSize: '12px',
//           }}
//         >
//           {charCount} / {maxLength}
//         </div>
//         {isExceedingLimit && (
//           <span style={{ color: 'red', marginLeft: '4px' }}>
//             Character limit exceeded!
//           </span>
//         )}
//       </div>
//     );
//   }
// );

// Textarea.displayName = 'Textarea';

// export { Textarea };

const Textarea = React.forwardRef(
  (
    { className, maxLength = 500, value = "", onChange, label = "", ...props },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(value.length);

    const handleInputChange = (e) => {
      setCharCount(e.target.value.length);

      // Call the external onChange function if provided
      if (onChange) {
        onChange(e); // If there's an external onChange, call it
      }
    };

    React.useEffect(() => {
      // Sync charCount with the `value` prop if it's controlled
      setCharCount(value.length);
    }, [value]);

    const isExceedingLimit = charCount > maxLength;

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
            // Color changes if exceeding limit
            fontSize: "12px",
          }}
        >
          {" "}
          <label className="text-black font-medium text-[12px]">{label}</label>
          <span
            style={{
              fontSize: "12px",
              color: isExceedingLimit ? "red" : "#7C7D7E",
            }}
          >
            {charCount}/ {maxLength}
          </span>
        </div>
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e36b14] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e0e0e0] disabled:text-[#999999]",
            className
          )}
          // No maxLength attribute, allowing the user to type indefinitely
          onChange={handleInputChange}
          value={value} // Use the controlled `value` prop if provided
          ref={ref}
          {...props}
        />

        {isExceedingLimit && (
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "8px",
              color: "red",
              fontSize: "12px",
            }}
          >
            Character limit exceeded.
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
