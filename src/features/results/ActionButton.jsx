import React from "react";

export default function ActionButton({
  label,
  onClick,
  variant = "default",
  icon,
  className = "",
  disabled = false,
}) {
  // Base styles matching the modern rounded design
  const baseStyle =
    "flex items-center justify-center gap-2 rounded-2xl py-3 px-6 text-sm font-bold transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  // Variants updated with exact project hex colors
  const variants = {
    // Light gray background for secondary actions (Back/Cancel)
    default: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    
    // Main Yellow theme color for primary actions
    yellow: "bg-[#eab308] hover:bg-[#d9a306] text-white shadow-[#eab308]/20 shadow-lg",
    
    // Transparent style for subtle buttons
    ghost: "bg-transparent hover:bg-gray-50 text-gray-500 border border-gray-100",
    
    // Other utility colors
    green: "bg-green-500 hover:bg-green-600 text-white",
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.default} ${className}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  );
}