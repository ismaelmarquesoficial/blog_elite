import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  tooltip?: string;
}

export function IconButton({ icon: Icon, onClick, className = '', tooltip }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${className}`}
      title={tooltip}
    >
      <Icon size={18} />
      {tooltip && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {tooltip}
        </span>
      )}
    </button>
  );
}