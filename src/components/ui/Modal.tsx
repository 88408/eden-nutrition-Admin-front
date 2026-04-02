import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={cn("relative w-full max-w-lg rounded-[2.5rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/[0.02]", className)}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1d1d1f] font-display">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="h-6 w-6 text-[#86868b]" />
          </button>
        </div>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
