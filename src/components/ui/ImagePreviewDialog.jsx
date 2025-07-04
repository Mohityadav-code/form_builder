"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/sadcnDialog";
import { ZoomInIcon } from "lucide-react";

export default function ImagePreviewDialog({
  src,
  alt = "Preview Image",
  fallbackText = "कोई तस्वीर उपलब्ध नहीं है",
  className = "",
}) {
  if (!src) {
    return (
      <div className={`border-2 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500 ${className}`}>
        {fallbackText}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild >
        <div className={`relative group overflow-hidden rounded-md border cursor-zoom-in ${className}`}>
          <img
            src={src}
            alt={alt}
          
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 "
          />
          <ZoomInIcon className="absolute top-2 right-2 text-white bg-black bg-opacity-40 rounded p-1 w-5 h-5" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-4 overflow-scroll">
        <img
          src={src}
          alt={alt}
        
          className="w-full h-auto rounded-md border object-contain max-h-[600px]"
        />
      </DialogContent>
    </Dialog>
  );
}
