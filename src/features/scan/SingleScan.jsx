import React, { useState } from "react";
import { ArrowLeft, Sparkles, ChevronRight, Layers } from "lucide-react";
import UploadBox from "./UploadBox";
import CameraModal from "./CameraModal";
import { scanSingleCard } from "./scanService";
import imageCompression from "browser-image-compression";

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  
  .pg-root, .pg-root * { 
    font-family: 'Poppins', sans-serif !important; 
    box-sizing: border-box;
  }

  .pg-root { min-height: calc(100vh - 50px); background: #fff; }
  .pg-bar { position: sticky; top: 0; z-index: 40; height: 60px; background: rgba(255,255,255,0.96); backdrop-filter: blur(10px); border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; }
  .pg-bar-inner { width: 100%; max-width: 640px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: flex-start; gap: 12px; }
  
  .pg-back { 
    display: inline-flex; align-items: center; gap: 7px; padding: 8px 18px; border-radius: 99px; 
    border: 1.5px solid #E5E7EB; background: #fff; cursor: pointer; font-size: 11px; font-weight: 700; 
    letter-spacing: 0.12em; text-transform: uppercase; color: #9CA3AF; transition: all 0.15s; outline: none; white-space: nowrap; 
  }
  .pg-back:hover { background: #F5A623; color: #fff; border-color: #F5A623; }
  
  .pg-toggle { display: flex; align-items: center; border-radius: 99px; background: #F9FAFB; border: 1px solid #E5E7EB; padding: 4px; gap: 2px; margin-left: auto; }
  .pg-tab { display: flex; align-items: center; gap: 5px; padding: 7px 20px; border-radius: 99px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .pg-tab-on  { background: #F5A623; color: #fff; box-shadow: 0 2px 8px rgba(245,166,35,0.35); }
  .pg-tab-off { background: transparent; color: #9CA3AF; }
  
  .pg-content { max-width: 640px; margin: 0 auto; padding: 36px 24px 64px; }
  .pg-h1 { font-size: 36px; font-weight: 900; color: #111; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 8px; }
  .pg-sub { font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.18em; margin: 0; }
  
  .pg-footer { display: flex; align-items: center; justify-content: center; gap: 12px; opacity: 0.28; margin-top: 40px; }
  .pg-footer-line { height: 1px; width: 28px; background: #9CA3AF; }
  .pg-footer-text { font-size: 9px; font-weight: 900; color: #6B7280; text-transform: uppercase; letter-spacing: 0.3em; }

  @media (max-width: 600px) {
    .pg-back    { display: none !important; }
    .pg-toggle  { margin-left: auto; margin-right: auto; }
    .pg-bar-inner { justify-content: center !important; }
    .pg-h1      { font-size: 26px !important; }
    .pg-content { padding: 24px 16px 48px !important; }
  }
`;

export default function SingleScan({ onBack, onBulk, setStep, setContactData, captureMethod }) {
  const [frontImage,   setFrontImage]   = useState(null);
  const [backImage,    setBackImage]    = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview,  setBackPreview]  = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [showCamera,   setShowCamera]   = useState(false);
  const [activeSide,   setActiveSide]   = useState(null);

  const compressImage = async (file) => {
    try { return await imageCompression(file,{maxSizeMB:1,maxWidthOrHeight:1600,initialQuality:0.8,useWebWorker:true}); }
    catch { return file; }
  };

  const handleFrontChange = async(e)=>{ const f=e.target.files?.[0]; if(!f)return; updateFront(await compressImage(f)); };
  const handleBackChange  = async(e)=>{ const f=e.target.files?.[0]; if(!f)return; updateBack(await compressImage(f)); };
  
  const updateFront = (file)=>{ setFrontImage(file); setFrontPreview(URL.createObjectURL(file)); setError(""); };
  const updateBack  = (file)=>{ setBackImage(file);  setBackPreview(URL.createObjectURL(file)); };
  
  const openCamera  = (side)=>{ setActiveSide(side); setShowCamera(true); };
  const handleCapture = async(file)=>{ const c=await compressImage(file); activeSide==="front"?updateFront(c):updateBack(c); setShowCamera(false); };

  const handleScan = async()=>{
    if(!frontImage){ setError("Front side is required."); return; }
    try{ 
      setLoading(true); 
      setError(""); 
      const data = await scanSingleCard(frontImage, backImage); 
      if(data){ setContactData(data); setStep("results"); } 
    }
    catch{ setError("AI analysis failed. Please check image clarity."); }
    finally{ setLoading(false); }
  };

  const canScan = !!frontImage && !loading;

  return (
    <>
      <style>{`
        ${SHARED_CSS}
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes ss-spin { to{transform:rotate(360deg)} }
        .ss-wrap { animation: fadeUp 0.3s ease both; }

        .ss-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
        .ss-label-row { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
        .ss-label     { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:#374151; }
        .ss-badge-req { font-size:9px; font-weight:700; text-transform:uppercase; background:#F5A623; color:#fff; padding:2px 8px; border-radius:99px; }
        .ss-badge-opt { font-size:9px; font-weight:600; text-transform:uppercase; background:#F9FAFB; border:1px solid #E5E7EB; color:#9CA3AF; padding:2px 8px; border-radius:99px; }
        .ss-sublabel  { font-size:10px; color:#9CA3AF; font-weight:500; margin:0 0 8px; }

        .ss-btn { width:100%; height:52px; display:flex; align-items:center; justify-content:center; gap:8px; border:none; border-radius:14px; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:0.08em; transition:box-shadow 0.15s; cursor:pointer; outline:none; }
        .ss-btn-on  { background:#F5A623; color:#fff; box-shadow:0 8px 24px -4px rgba(245,166,35,0.4); }
        .ss-btn-on:hover { box-shadow:0 12px 28px -4px rgba(245,166,35,0.55); }
        .ss-btn-off { background:#E5E7EB; color:#9CA3AF; cursor:not-allowed; }
        .ss-spinner { width:15px; height:15px; border:2px solid rgba(255,255,255,0.25); border-top-color:#fff; border-radius:50%; animation:ss-spin 0.7s linear infinite; flex-shrink:0; }

        @media(max-width:600px){
          .ss-grid { grid-template-columns:1fr !important; gap:12px !important; }
        }
      `}</style>

      {showCamera && <CameraModal onCapture={handleCapture} onClose={()=>setShowCamera(false)}/>}

      <div className="pg-root">
        {/* TOP BAR */}
        <div className="pg-bar">
          <div className="pg-bar-inner">
            <button className="pg-back" onClick={onBack}><ArrowLeft size={13}/> Back</button>
            <div className="pg-toggle">
              <button className="pg-tab pg-tab-on">Single Scan</button>
              <button className="pg-tab pg-tab-off" onClick={onBulk}><Layers size={12}/> Bulk Scan</button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pg-content ss-wrap">
          <div style={{marginBottom:28}}>
            <h2 className="pg-h1">
              {captureMethod==="camera"?"Snap":"Upload"} Your
              <span style={{color:"#F5A623"}}> Business Card</span>
            </h2>
          </div>

          <div className="ss-grid">
            {/* Front Side */}
            <div>
              <div className="ss-label-row">
                <span className="ss-label">Front Card</span>
                <span className="ss-badge-req">Required</span>
              </div>
              <p className="ss-sublabel">Name, phone, email &amp; details</p>
              <UploadBox 
                preview={frontPreview} 
                onFileChange={handleFrontChange}
                onRemove={()=>{setFrontImage(null);setFrontPreview(null);}}
                onBoxClick={captureMethod==="camera"?()=>openCamera("front"):null}
              />
            </div>

            {/* Back Side */}
            <div>
              <div className="ss-label-row">
                <span className="ss-label">Back Card</span>
                <span className="ss-badge-opt">Optional</span>
              </div>
              <p className="ss-sublabel">Extra info, social links</p>
              <UploadBox 
                preview={backPreview} 
                onFileChange={handleBackChange}
                onRemove={()=>{setBackImage(null);setBackPreview(null);}}
                onBoxClick={captureMethod==="camera"?()=>openCamera("back"):null}
              />
            </div>
          </div>

          {error && (
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:12,background:"#FEF2F2",border:"1px solid #FECACA",marginBottom:12}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#FCA5A5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:10,fontWeight:900,color:"#DC2626"}}>!</span>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:"#EF4444"}}>{error}</span>
            </div>
          )}

          <button onClick={handleScan} disabled={!canScan} className={`ss-btn ${canScan?"ss-btn-on":"ss-btn-off"}`}>
            {loading
              ? <><div className="ss-spinner"/> Processing Card...</>
              : <><Sparkles size={14}/> Process Card <ChevronRight size={14}/></>
            }
          </button>

          <div className="pg-footer">
            <div className="pg-footer-line"/>
            <span className="pg-footer-text">Secure AI Cloud Processing</span>
            <div className="pg-footer-line"/>
          </div>
        </div>
      </div>
    </>
  );
}