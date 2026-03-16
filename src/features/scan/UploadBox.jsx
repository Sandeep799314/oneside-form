import React, { useRef, useState } from "react";
import { X } from "lucide-react";

export default function UploadBox({ preview, onFileChange, onBoxClick, onRemove }) {
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onBoxClick) onBoxClick();
    else fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onRemove) onRemove();
  };

  return (
    <>
      <style>{`
        .ub-overlay { opacity: 0; transition: opacity 0.2s; }
        .ub-box:hover .ub-overlay { opacity: 1; }
        .ub-remove:hover { background: rgba(0,0,0,0.92) !important; }
      `}</style>

      <div
        className="ub-box relative w-full cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-200"
        style={{
          height: 200,
          borderRadius: 16,
          backgroundColor: "#F9FAFB",
          border: preview
            ? "1.5px solid #F5A623"
            : hovered
            ? "1.5px solid #1A1A1A"
            : "1.5px solid #E5E7EB",
          boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
        }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview"
                 className="absolute inset-0 w-full h-full object-cover" />

            {/* Remove btn */}
            <button
              onClick={handleRemove}
              className="ub-remove absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
              style={{ background: "rgba(0,0,0,0.65)", color: "#fff" }}
            >
              <X size={13} />
            </button>

            {/* Hover overlay */}
            <div className="ub-overlay absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                 style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}>
              <span className="bg-white font-black uppercase rounded-full shadow-lg"
                    style={{ fontSize: 10, letterSpacing: "0.16em", padding: "7px 18px", color: "#111827" }}>
                Replace Image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-4">
            {/* Icon box — same style as LandingUI feature cards */}
            <div
              className="w-12 h-12 rounded-[13px] flex items-center justify-center transition-colors duration-200"
              style={{ background: hovered ? "#F5A623" : "#EFEFEF" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={hovered ? "#fff" : "#9CA3AF"}
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "stroke 0.2s" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 m-0 mb-1" style={{ fontSize: 15 }}>Upload Image</p>
              <p className="font-semibold text-gray-400 uppercase m-0"
                 style={{ fontSize: 10, letterSpacing: "0.14em" }}>Max Size 10MB</p>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*"
             onChange={onFileChange} className="hidden" />
    </>
  );
}