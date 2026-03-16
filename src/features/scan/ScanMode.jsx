import React, { useState } from "react";
import { ArrowLeft, Camera, Upload, ChevronRight, Layers } from "lucide-react";

const SHARED_CSS = `
  /* Google Fonts Poppins Import */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

  /* Poppins for everything with sans-serif fallback */
  .pg-root, .pg-root * { 
    font-family: 'Poppins', sans-serif !important; 
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }

  .pg-root { min-height: calc(100vh - 50px); background: #fff; }
  
  .pg-bar { 
    position: sticky; top: 0; z-index: 40; height: 60px; 
    background: rgba(255,255,255,0.96); backdrop-filter: blur(10px); 
    border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; 
  }
  
  .pg-bar-inner { 
    width: 100%; max-width: 640px; margin: 0 auto; padding: 0 24px; 
    display: flex; align-items: center; justify-content: flex-start; gap: 12px; 
  }
  
  .pg-back { 
    display: inline-flex; align-items: center; gap: 7px; padding: 8px 18px; 
    border-radius: 99px; border: 1.5px solid #E5E7EB; background: #fff; 
    cursor: pointer; font-size: 11px; font-weight: 700; 
    letter-spacing: 0.12em; text-transform: uppercase; color: #9CA3AF; 
    transition: all 0.15s; outline: none; white-space: nowrap; 
  }
  
  .pg-back:hover { background: #F5A623; color: #fff; border-color: #F5A623; }
  
  .pg-toggle { 
    display: flex; align-items: center; border-radius: 99px; 
    background: #F9FAFB; border: 1px solid #E5E7EB; padding: 4px; gap: 2px; margin-left: auto; 
  }
  
  .pg-tab { 
    display: flex; align-items: center; gap: 5px; padding: 7px 20px; 
    border-radius: 99px; font-size: 12px; font-weight: 700; 
    border: none; cursor: pointer; transition: all 0.15s; white-space: nowrap; 
  }
  
  .pg-tab-on  { background: #F5A623; color: #fff; box-shadow: 0 2px 8px rgba(245,166,35,0.35); }
  .pg-tab-off { background: transparent; color: #9CA3AF; }
  
  .pg-content { max-width: 640px; margin: 0 auto; padding: 36px 24px 64px; }
  
  /* Poppins Heading with Image-style Tight Spacing */
  .pg-h1 { 
    font-size: 38px; 
    font-weight: 900; 
    color: #111; 
    letter-spacing: -0.04em; /* Letters ko aapas mein tight karne ke liye */
    line-height: 1.05; 
    margin: 0 0 8px; 
  }
  
  .pg-sub { 
    font-size: 11px; 
    font-weight: 700; 
    color: #9CA3AF; 
    text-transform: uppercase; 
    letter-spacing: 0.2em; /* Modern wide-look sub-headings */
    margin: 0; 
  }
  
  .pg-footer { 
    display: flex; align-items: center; justify-content: center; 
    gap: 12px; opacity: 0.28; margin-top: 40px; 
  }
  
  .pg-footer-line { height: 1px; width: 28px; background: #9CA3AF; }
  
  .pg-footer-text { 
    font-size: 9px; font-weight: 900; color: #6B7280; 
    text-transform: uppercase; letter-spacing: 0.3em; 
  }

  @media (max-width: 600px) {
    .pg-back    { display: none !important; }
    .pg-toggle  { margin-left: auto; margin-right: auto; }
    .pg-bar-inner { justify-content: center !important; }
    .pg-h1      { font-size: 28px !important; }
    .pg-content { padding: 24px 16px 48px !important; }
  }
`;

export default function ScanMode({ onBack, onSingle, onBulk }) {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <>
      <style>{`
        ${SHARED_CSS}
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        .sm-wrap { animation: fadeUp 0.3s ease-out both; }

        .sm-card {
          display: flex; flex-direction: column; align-items: flex-start;
          text-align: left; padding: 24px; border-radius: 20px;
          background: #F9FAFB; border: 1.5px solid #E5E7EB;
          cursor: pointer; transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
          outline: none; width: 100%;
        }
        .sm-card:hover { background: #fff; border-color: #1A1A1A; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .sm-card:hover .sm-icon { background: #F5A623 !important; }
        .sm-card:hover .sm-icon svg { color: #fff !important; }
        .sm-card:hover .sm-arrow { color: #1A1A1A !important; }

        .sm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }

        @media (max-width: 600px) {
          .sm-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .sm-card { flex-direction: row !important; align-items: center !important; gap: 14px !important; padding: 18px !important; }
          .sm-icon { margin-bottom: 0 !important; flex-shrink: 0; }
        }
      `}</style>

      <div className="pg-root">
        {/* Background Decorative Circles */}
        <div style={{pointerEvents:"none",position:"fixed",top:0,right:0,width:288,height:288,borderRadius:"50%",opacity:0.5,background:"#fffbeb",filter:"blur(80px)",zIndex:0}}/>
        <div style={{pointerEvents:"none",position:"fixed",bottom:0,left:0,width:208,height:208,borderRadius:"50%",opacity:0.25,background:"#eff6ff",filter:"blur(80px)",zIndex:0}}/>

        {/* TOP BAR */}
        <div className="pg-bar">
          <div className="pg-bar-inner">
            <button className="pg-back" onClick={onBack}>
              <ArrowLeft size={13}/> Back
            </button>
            <div className="pg-toggle">
              <button className={`pg-tab ${activeTab==="single"?"pg-tab-on":"pg-tab-off"}`} onClick={()=>setActiveTab("single")}>
                Single Scan
              </button>
              <button className={`pg-tab ${activeTab==="bulk"?"pg-tab-on":"pg-tab-off"}`} onClick={()=>{setActiveTab("bulk");onBulk();}}>
                <Layers size={12}/> Bulk Scan
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pg-content sm-wrap" style={{position:"relative",zIndex:1}}>
          <div style={{marginBottom:28}}>
            <h2 className="pg-h1">Ready to <span style={{color:"#F5A623"}}>Extract?</span></h2>
            <p className="pg-sub">Select capture method to continue</p>
          </div>

          <div className="sm-grid">
            {[
              {key:"camera", Icon:Camera, title:"Camera",  sub:"Snap a live photo", method:"camera"},
              {key:"upload", Icon:Upload, title:"Gallery", sub:"Pick from files",   method:"upload"},
            ].map(({key,Icon,title,sub,method})=>(
              <button key={key} className="sm-card" onClick={()=>{setActiveTab("single");onSingle(method);}}>
                <div className="sm-icon" style={{width:48,height:48,borderRadius:13,background:"#EFEFEF",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,transition:"background 0.2s",flexShrink:0}}>
                  <Icon size={22} style={{color:"#9CA3AF",transition:"color 0.2s"}}/>
                </div>
                <div style={{width:"100%",display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8}}>
                  <div>
                    {/* Poppins Extra Bold Titles */}
                    <p style={{fontSize:17,fontWeight:900,color:"#111",margin:"0 0 4px",lineHeight:1.2,letterSpacing:"-0.02em"}}>{title}</p>
                    <p style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.14em",margin:0}}>{sub}</p>
                  </div>
                  <ChevronRight size={17} className="sm-arrow" style={{color:"#D1D5DB",marginBottom:2,transition:"color 0.2s",flexShrink:0}}/>
                </div>
              </button>
            ))}
          </div>

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