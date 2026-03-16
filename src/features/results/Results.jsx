import React, { useState } from "react";
import { ArrowLeft, Pencil, Check, PlusCircle } from "lucide-react";
import { saveToGoogleSheet } from "../../utils/googleSheets";

const FIELDS = [
  { key: "name",        label: "Full Name",  icon: "👤" },
  { key: "phone",       label: "Phone",       icon: "📱" },
  { key: "email",       label: "Email",       icon: "✉️" },
  { key: "company",     label: "Company",     icon: "🏢" },
  { key: "designation", label: "Designation", icon: "💼" },
  { key: "website",     label: "Website",     icon: "🌐" },
  { key: "address",     label: "Address",     icon: "📍" },
];

export default function Results({ data, allResults, onRescan, onBack }) {
  const raw = Array.isArray(data) ? data[0] : data;
  const [contact, setContact]         = useState(raw || {});
  const [isEditing, setIsEditing]     = useState(false);
  const [sheetStatus, setSheetStatus] = useState("idle");

  if (!data) return null;

  const handleChange = (key, value) =>
    setContact((c) => ({ ...c, [key]: value }));

  const handleSubmit = async () => {
    if (sheetStatus === "saving" || sheetStatus === "saved") return;
    setSheetStatus("saving");
    const res = await saveToGoogleSheet(contact, "scan");
    if (res.success) {
      setSheetStatus("saved");
    } else {
      setSheetStatus("error");
      setTimeout(() => setSheetStatus("idle"), 3000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .res-wrap, .res-wrap * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .res-field-input {
          width: 100%; padding: 9px 12px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #111;
          outline: none; transition: border-color 0.15s;
          background: #fafafa;
        }
        .res-field-input:focus { border-color: #eab308; background: #fff; }
        .res-submit:hover { transform: translateY(-1px); box-shadow: 0 12px 28px -4px rgba(234,179,8,0.5) !important; }
        .res-rescan:hover { background: #111 !important; color: #fff !important; }
      `}</style>

      <div className="res-wrap" style={{ minHeight: "100vh", background: "#f9f9f9", padding: "24px 16px 60px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>

          {/* Back */}
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 700, color: "#9ca3af",
            textTransform: "uppercase", letterSpacing: "0.1em",
            marginBottom: 20, padding: 0,
          }}>
            <ArrowLeft size={14} /> Back
          </button>

          {/* Card */}
          <div style={{
            background: "#fff", borderRadius: 20,
            border: "1px solid #f0f0f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
            animation: "fadeUp 0.3s ease both",
          }}>

            {/* Header */}
            <div style={{
              padding: "18px 20px", borderBottom: "1px solid #f5f5f5",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  AI Extracted
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#111", marginTop: 1 }}>
                  Contact Details
                </div>
              </div>

              <button
                onClick={() => setIsEditing((e) => !e)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "7px 14px", borderRadius: 99,
                  border: `1.5px solid ${isEditing ? "#22c55e" : "#eab308"}`,
                  background: isEditing ? "#f0fdf4" : "#fffbeb",
                  color: isEditing ? "#16a34a" : "#92400e",
                  fontSize: 11, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  cursor: "pointer",
                }}
              >
                {isEditing ? <><Check size={12}/> Done</> : <><Pencil size={12}/> Edit</>}
              </button>
            </div>

            {/* Fields */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {FIELDS.map(({ key, label, icon }) => (
                <div key={key}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, color: "#9ca3af",
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    marginBottom: 5, display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span>{icon}</span> {label}
                  </div>

                  {isEditing ? (
                    <input
                      className="res-field-input"
                      value={contact[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={`Enter ${label}`}
                    />
                  ) : (
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: contact[key] ? "#111" : "#d1d5db",
                      padding: "9px 12px", background: "#fafafa",
                      borderRadius: 10, border: "1.5px solid #f0f0f0",
                    }}>
                      {contact[key] || "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div style={{ padding: "4px 20px 20px" }}>
              <button
                onClick={handleSubmit}
                disabled={sheetStatus === "saving" || sheetStatus === "saved"}
                className="res-submit"
                style={{
                  width: "100%", height: 50,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  border: "none", borderRadius: 14,
                  cursor: sheetStatus === "saving" || sheetStatus === "saved" ? "not-allowed" : "pointer",
                  background: sheetStatus === "saved" ? "#22c55e" : sheetStatus === "error" ? "#ef4444" : "#eab308",
                  color: "#fff", fontSize: 13, fontWeight: 900,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  opacity: sheetStatus === "saving" ? 0.75 : 1,
                  transition: "all 0.2s",
                  boxShadow: "0 8px 24px -4px rgba(234,179,8,0.4)",
                }}
              >
                {sheetStatus === "idle"   && <><span>💾</span> Submit </>}
                {sheetStatus === "saving" && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{animation:"spin 0.8s linear infinite"}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Submitting...</>}
                {sheetStatus === "saved"  && <><Check size={16}/> Submitted ✓</>}
                {sheetStatus === "error"  && <>! Failed — Try Again</>}
              </button>
            </div>
          </div>

          {/* Scan New Card */}
          <button
            onClick={onRescan}
            className="res-rescan"
            style={{
              width: "100%", marginTop: 12, height: 46,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: "#fff", border: "1.5px solid #e5e7eb",
              borderRadius: 14, cursor: "pointer",
              fontSize: 12, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "#6b7280", transition: "all 0.15s",
            }}
          >
            <PlusCircle size={15}/> Scan New Card
          </button>

        </div>
      </div>
    </>
  );
}