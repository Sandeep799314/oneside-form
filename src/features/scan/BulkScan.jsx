import React from "react";
import { ArrowLeft, Layers, Sparkles } from "lucide-react";

const SHARED_CSS = `
  /* Poppins Import */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  
  /* Global Font apply with fallback */
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
  
  /* Logo-style Heading (Poppins 900 + Tight Spacing) */
  .pg-h1 { 
    font-size: 38px; 
    font-weight: 900; 
    color: #111; 
    letter-spacing: -0.04em; /* Match Bulk Card Image */
    line-height: 1.05; 
    margin: 0 0 8px; 
  }
  
  .pg-sub { 
    font-size: 10px; 
    font-weight: 700; 
    color: #9CA3AF; 
    text-transform: uppercase; 
    letter-spacing: 0.25em; /* Wide spacing for sub-text */
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

export default function BulkScan({ onBack, onSingle }) {
  return (
    <>
      <style>{`
        ${SHARED_CSS}
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes bs-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .bs-wrap { animation: fadeUp 0.3s ease-out both; }
        .bs-icon { animation: bs-float 3s ease-in-out infinite; }
      `}</style>

      <div className="pg-root">
        {/* Decorative Background */}
        <div style={{pointerEvents:"none",position:"fixed",top:0,right:0,width:288,height:288,borderRadius:"50%",opacity:0.5,background:"#fffbeb",filter:"blur(80px)",zIndex:0}}/>
        <div style={{pointerEvents:"none",position:"fixed",bottom:0,left:0,width:208,height:208,borderRadius:"50%",opacity:0.25,background:"#eff6ff",filter:"blur(80px)",zIndex:0}}/>

        {/* TOP BAR */}
        <div className="pg-bar">
          <div className="pg-bar-inner">
            <button className="pg-back" onClick={onBack}><ArrowLeft size={13}/> Back</button>
            <div className="pg-toggle">
              <button className="pg-tab pg-tab-off" onClick={onSingle}>Single Scan</button>
              <button className="pg-tab pg-tab-on"><Layers size={12}/> Bulk Scan</button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pg-content bs-wrap" style={{position:"relative",zIndex:1}}>
          <div style={{marginBottom:32}}>
            {/* Header matching your image design */}
            <h2 className="pg-h1">Bulk Card <span style={{color:"#F5A623"}}>Scanner</span></h2>
            <p className="pg-sub">Scan multiple cards at once • Batch export</p>
          </div>

          <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"36px 24px",borderRadius:20,background:"#F9FAFB",border:"1.5px solid #E5E7EB"}}>
            <div className="bs-icon" style={{width:52,height:52,borderRadius:16,background:"#fff",border:"1px solid #E5E7EB",boxShadow:"0 4px 14px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
              <Layers size={24} style={{color:"#F5A623"}}/>
            </div>
            
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:99,background:"#fffbeb",border:"1px solid #fef3c7",marginBottom:16}}>
              <Sparkles size={10} style={{color:"#d97706"}}/>
              <span style={{fontSize:9,fontWeight:900,color:"#d97706",textTransform:"uppercase",letterSpacing:"0.15em"}}>Coming Soon</span>
            </div>

            <h3 style={{fontSize:18,fontWeight:900,color:"#111",margin:"0 0 10px",lineHeight:1.2}}>Bulk Scan is Under Development</h3>
            
            <p style={{fontSize:13,color:"#9CA3AF",lineHeight:1.7,margin:0,maxWidth:340,fontWeight:500}}>
              Soon you'll be able to scan{" "}
              <span style={{color:"#374151",fontWeight:700}}>multiple business cards</span>{" "}
              simultaneously and export all contacts to Excel instantly.
            </p>
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