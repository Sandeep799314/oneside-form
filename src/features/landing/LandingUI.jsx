import React, { useState } from "react";
import { saveToGoogleSheet } from "../../utils/googleSheets";

// ─── Manual Entry Form (replaces animated demo on left) ───────
function ManualEntryForm() {
  const EMPTY = { name: "", phone: "", email: "", company: "", designation: "", address: "" };
  const [form, setForm]     = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [msg, setMsg]       = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setMsg("Name is required."); setStatus("error"); return; }
    setStatus("saving");
    setMsg("");
    const res = await saveToGoogleSheet(form, "manual");
    if (res.success) {
      setStatus("success");
      setMsg("Contact saved to Google Sheet ✓");
      setForm(EMPTY);
      setTimeout(() => { setStatus("idle"); setMsg(""); }, 3000);
    } else {
      setStatus("error");
      setMsg(res.message || "Something went wrong.");
    }
  };

  const fields = [
    { name: "name",        label: "Full Name",  placeholder: "Rajesh Kumar",       required: true  },
    { name: "phone",       label: "Phone",       placeholder: "+91 98765 43210",    required: false },
    { name: "email",       label: "Email",       placeholder: "rajesh@techcorp.in", required: false },
    { name: "company",     label: "Company",     placeholder: "TechCorp Pvt. Ltd.", required: false },
    { name: "designation", label: "Designation", placeholder: "Sales Manager",      required: false },
    { name: "address",     label: "Address",     placeholder: "Mumbai, Maharashtra",required: false },
  ];

  return (
    <div style={{
      width: "100%", maxWidth: 320,
      background: "#fff",
      border: "1px solid #ebebeb",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column",
    }}>
      {/* macOS-style title bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "9px 14px",
        background: "#f9f9f9",
        borderBottom: "1px solid #ebebeb",
      }}>
        {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }} />
        ))}
        <div style={{ flex:1, textAlign:"center", fontSize:10, color:"#aaa", letterSpacing:"0.03em" }}>
          Manual Entry
        </div>
      </div>

      {/* Badge */}
      <div style={{ padding:"12px 16px 6px" }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:6,
          background:"#fffbeb", border:"1px solid #fde68a",
          padding:"3px 10px", borderRadius:99,
        }}>
          <span style={{ fontSize:10 }}>✏️</span>
          <span style={{ fontSize:9, fontWeight:700, color:"#92400e", textTransform:"uppercase", letterSpacing:"0.1em" }}>
            Enter Contact Details
          </span>
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding:"8px 16px 4px", display:"flex", flexDirection:"column", gap:7 }}>
        {fields.map(({ name, label, placeholder, required }) => (
          <div key={name}>
            <div style={{ fontSize:9, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>
              {label}{required && <span style={{ color:"rgb(247,190,57)", marginLeft:2 }}>*</span>}
            </div>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              style={{
                width:"100%", padding:"7px 10px",
                border:"1.5px solid #e5e7eb",
                borderRadius:8, fontSize:11,
                fontFamily:"inherit", outline:"none",
                transition:"border-color 0.15s",
                boxSizing:"border-box",
                background:"#fafafa",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgb(247,190,57)")}
              onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>
        ))}
      </div>

      {/* Status */}
      {msg && (
        <div style={{
          margin:"4px 16px 0",
          padding:"6px 10px",
          borderRadius:8,
          fontSize:10, fontWeight:600,
          background: status === "success" ? "#f0fdf4" : "#fef2f2",
          color:      status === "success" ? "#16a34a" : "#dc2626",
          border:`1px solid ${status==="success"?"#bbf7d0":"#fecaca"}`,
        }}>
          {msg}
        </div>
      )}

      {/* Submit */}
      <div style={{ padding:"10px 16px 14px" }}>
        <button
          onClick={handleSubmit}
          disabled={status === "saving"}
          style={{
            width:"100%", height:40,
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            background: status === "success" ? "#22c55e" : "rgb(247,190,57)",
            color:"#fff",
            border:"none", borderRadius:10,
            fontSize:11, fontWeight:800,
            textTransform:"uppercase", letterSpacing:"0.08em",
            cursor: status === "saving" ? "not-allowed" : "pointer",
            opacity: status === "saving" ? 0.8 : 1,
            transition:"all 0.15s",
            fontFamily:"inherit",
            boxShadow:"0 4px 14px rgba(247,190,57,0.35)",
          }}
        >
          {status === "saving"  && <span style={{ fontSize:13 }}>⏳</span>}
          {status === "success" && <span style={{ fontSize:13 }}>✓</span>}
          {status === "idle"    && <span style={{ fontSize:13 }}>💾</span>}
          {status === "error"   && <span style={{ fontSize:13 }}>!</span>}
          {status === "submitting"  ? "Submitting..." : status === "success" ? "Submitted!" : "*"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Landing Page ─────────────────────────────────────────
export default function LandingUI({ onStart }) {
  return (
    <div style={{
      height:"100vh", width:"100%",
      background:"#fff",
      display:"flex", flexDirection:"column",
      color:"#111", overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; font-family:'Poppins',sans-serif !important; }
        @keyframes floatAnim { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .cta-btn:hover {
          background:rgb(224,150,32) !important;
          transform:translateY(-1px);
          box-shadow:0 12px 28px -4px rgba(247,190,57,0.55) !important;
        }
        @media(min-width:1024px){
          .lp-grid  { flex-direction:row !important; align-items:center !important; gap:72px !important; }
          .lp-left  { flex:0 0 auto; width:340px !important; align-items:center !important; }
          .lp-right { flex:1 1 0; align-items:flex-start !important; text-align:left !important; max-width:520px; }
          .lp-logo  { display:flex !important; }
          .lp-right .lp-cta { align-items:flex-start !important; }
        }
      `}</style>

      <main style={{
        flex:1,
        display:"flex", alignItems:"center", justifyContent:"center",
        paddingTop:10, paddingBottom:24, paddingLeft:40, paddingRight:40,
        overflow:"hidden", background:"#fff",
      }}>
        <div className="lp-grid" style={{
          width:"100%", maxWidth:1040,
          display:"flex", flexDirection:"column",
          alignItems:"center", gap:40,
        }}>

          {/* LEFT — Manual Entry Form */}
          <div className="lp-left" style={{
            width:"100%", display:"flex",
            flexDirection:"column", alignItems:"center", gap:10,
          }}>
            <div style={{ animation:"floatAnim 4s ease-in-out infinite", width:"100%", display:"flex", justifyContent:"center" }}>
              <ManualEntryForm />
            </div>
          </div>

          {/* RIGHT — CTA */}
          <div className="lp-right" style={{
            width:"100%", display:"flex",
            flexDirection:"column", alignItems:"center",
            textAlign:"center", gap:24,
          }}>

            <div className="lp-logo" style={{ display:"none", alignItems:"center", marginBottom:2 }}>
              <img src="/logo3.png" alt="trav platforms" style={{ height:30, width:"auto", objectFit:"contain" }} />
            </div>

            <h1 style={{
              fontWeight:900, color:"#111", lineHeight:1.1,
              margin:0, letterSpacing:"-0.02em",
              fontSize:"clamp(28px,3.4vw,52px)",
            }}>
              Scan Any{" "}
              <span style={{ color:"rgb(247,190,57)" }}>Business Card</span>
              {" "}With AI Precision
            </h1>

            <p style={{ color:"#6b7280", lineHeight:1.8, margin:0, fontSize:"clamp(14px,1.1vw,16px)", fontWeight:400, maxWidth:420 }}>
              Got a stack of business cards?{" "}
              <strong style={{ color:"#111", fontWeight:700 }}>Scan any card in seconds</strong>
              {" "}— then WhatsApp, email, or export every contact instantly.
            </p>

            <div className="lp-cta" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, width:"100%" }}>
              <button onClick={onStart} className="cta-btn" style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                border:"none", cursor:"pointer",
                width:"100%", maxWidth:260, height:52,
                background:"rgb(247,190,57)", color:"#fff",
                fontWeight:800, fontSize:13, letterSpacing:"0.07em", textTransform:"uppercase",
                borderRadius:12, boxShadow:"0 8px 24px -4px rgba(247,190,57,0.45)",
                transition:"all 0.15s",
              }}>
                Start Scanning
                <svg style={{ width:14, height:14, flexShrink:0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
