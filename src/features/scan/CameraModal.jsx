import React, { useRef, useEffect, useState } from "react";

export default function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "environment", 
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied! Please enable camera permissions.");
        onClose();
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onClose]);

  const capturePhoto = () => {
    if (!isReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured_card.jpg", { type: "image/jpeg" });
        onCapture(file);
      }
    }, "image/jpeg", 0.9);
  };

  return (
    // CHANGE: BG ko pure black se badal kar dark charcoal/pencil gray kiya hai
    <div className="fixed inset-0 z-[1000] bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      
      {/* Header with Close Button */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Video Preview Container */}
      {/* CHANGE: Border color ko soft white/pencil line kiya gaya hai */}
      <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border-2 border-gray-700">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Guide Overlay - Helps user align the card */}
        <div className="absolute inset-0 border-[30px] md:border-[60px] border-black/40 pointer-events-none">
          {/* CHANGE: Dashed border ko pencil thin grey line banaya hai */}
          <div className="w-full h-full border border-dashed border-white/40 rounded-xl" />
        </div>
      </div>

      {/* Capture Button Section */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <button 
          onClick={capturePhoto}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
        >
          {/* CHANGE: Yellow ring intact hai as requested */}
          <div className="w-16 h-16 rounded-full border-4 border-[#eab308]" />
        </button>
        <p className="text-gray-400 font-medium text-sm">Align card and tap to capture</p>
      </div>
    </div>
  );
}