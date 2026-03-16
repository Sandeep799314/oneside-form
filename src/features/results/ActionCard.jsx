import React from "react";

export default function ActionCard({ label, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-[18px] p-2 sm:p-3 flex flex-col items-center justify-center text-center 
      shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 
      hover:bg-gray-50 transition-all flex-1 min-w-[65px]"
    >
      
      {/* Icon */}
      <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-2 ${color}`}>
        <div className="w-4 h-4 sm:w-5 sm:h-5">
          {icon}
        </div>
      </div>

      {/* Label */}
      <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-500 leading-tight">
        {label}
      </span>

    </button>
  );
}