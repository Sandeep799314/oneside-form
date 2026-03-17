import React, { useState, useEffect } from "react";
import { saveToGoogleSheet } from "../../utils/googleSheets";

/* ---------------- MANUAL FORM (With Scroll & Laptop Fix) ---------------- */

function ManualEntryForm({ isMobile }) {
  const EMPTY = {
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    designation: "",
    website: "",
    address: "",
    notes: ""
  };

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.firstName.trim()) {
      setMsg("First Name is required.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setMsg("");
    const res = await saveToGoogleSheet(form, "manual");
    if (res.success) {
      setStatus("success");
      setMsg("Contact saved successfully ✓");
      setForm(EMPTY);
      setShowOptional(false);
      setTimeout(() => { setStatus("idle"); setMsg(""); }, 3000);
    } else {
      setStatus("error");
      setMsg(res.message || "Something went wrong.");
    }
  };

  const InputRow = ({ name, placeholder, isLast }) => (
    <div style={{
      borderBottom: isLast ? "none" : "1px solid #f2f2f7",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      background: "#fff"
    }}>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: "100%", border: "none", outline: "none",
          fontSize: "16px", color: "#000", background: "transparent",
          fontFamily: "inherit"
        }}
      />
    </div>
  );

  return (
    <div style={{
      width: "100%",
      maxWidth: 360,
      background: "#f2f2f7",
      borderRadius: 28,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      // Laptop fix: Limit height and add scroll
      maxHeight: isMobile ? "none" : "80vh",
      overflowY: isMobile ? "visible" : "auto",
      flexShrink: 0,
      paddingBottom: 20,
      // Custom scrollbar styling
      scrollbarWidth: "none", 
      msOverflowStyle: "none"
    }}>
      <div style={{ padding: "24px 16px 12px", textAlign: "center" }}>
        <div style={{ 
          width: 72, height: 72, background: "#a2a2a7", 
          borderRadius: "50%", margin: "0 auto 12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 32
        }}>👤</div>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#000" }}>New Contact</h2>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <InputRow name="firstName" placeholder="First name *" />
          <InputRow name="lastName" placeholder="Last name" />
          <InputRow name="company" placeholder="Company" isLast />
        </div>

        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <InputRow name="phone" placeholder="Add phone" />
          <InputRow name="email" placeholder="Add email" isLast />
        </div>

        {!showOptional && (
          <button 
            onClick={() => setShowOptional(true)}
            style={{ background: "none", border: "none", color: "#007aff", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", padding: "0 5px" }}
          >
            + Add Designation & Website
          </button>
        )}

        {showOptional && (
          <div style={{ borderRadius: 12, overflow: "hidden" }}>
            <InputRow name="designation" placeholder="Designation" />
            <InputRow name="website" placeholder="Website" isLast />
          </div>
        )}

        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <InputRow name="address" placeholder="Address" />
          <div style={{ padding: "12px 16px", background: "#fff" }}>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              style={{ width: "100%", height: 50, border: "none", outline: "none", fontSize: "16px", resize: "none", fontFamily: "inherit" }}
            />
          </div>
        </div>

        {msg && (
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 500, color: status === "success" ? "#34c759" : "#ff3b30" }}>
            {msg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === "saving"}
          style={{
            width: "100%", height: 52, background: "#f7be39", color: "#fff",
            border: "none", borderRadius: 14, fontWeight: 700, fontSize: 16,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(247,184,57,0.3)",
            // Laptop par button hamesha niche chipka rahega
            position: isMobile ? "static" : "sticky",
            bottom: 0
          }}
        >
          {status === "saving" ? "Saving..." : "SUBMIT CONTACT"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- LANDING PAGE (Alignment Fix) ---------------- */

export default function LandingUI({ onStart }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Laptop par vertically center
        padding: isMobile ? "90px 20px 40px" : "20px",
        overflowX: "hidden",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 30 : 60,
        }}
      >
        {/* FORM SECTION - Desktop Order: Left */}
        <div style={{ order: isMobile ? 3 : 1, flex: 1, display: "flex", justifyContent: "center" }}>
          <ManualEntryForm isMobile={isMobile} />
        </div>

        {/* OR DIVIDER - Perfectly Centered Between Sections */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "row" : "column",
            gap: 15,
            order: 2,
            width: isMobile ? "100%" : "auto",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <div style={{ width: isMobile ? "30%" : 2, height: isMobile ? 2 : 120, background: "#e5e7eb" }} />
          <span style={{ fontWeight: 900, color: "#cbd5e1", fontSize: 14 }}>OR</span>
          <div style={{ width: isMobile ? "30%" : 2, height: isMobile ? 2 : 120, background: "#e5e7eb" }} />
        </div>

        {/* SCAN SECTION - Desktop Order: Right */}
        <div style={{ order: isMobile ? 1 : 3, flex: 1, display: "flex", justifyContent: "center" }}>
          <ScanSection onStart={onStart} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- SCAN SECTION ---------------- */

function ScanSection({ onStart, isMobile }) {
  return (
    <div style={{ 
      maxWidth: 480, 
      textAlign: isMobile ? "center" : "left" 
    }}>
      <h1
        style={{
          fontWeight: 900,
          fontSize: isMobile ? "36px" : "60px",
          lineHeight: 1,
          marginBottom: 16,
          letterSpacing: "-0.04em",
          color: "#000"
        }}
      >
        Scan Any <br />
        <span style={{ color: "#f7be39" }}>Business Card</span>
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 32,
          fontSize: isMobile ? 16 : 19,
          lineHeight: 1.6,
          maxWidth: 420,
          margin: isMobile ? "0 auto 32px" : "0 0 32px"
        }}
      >
        Turn paper cards into digital contacts instantly 
        using AI. Save directly to your sheets.
      </p>

      <button
        onClick={onStart}
        style={{
          height: 64,
          padding: "0 50px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
          transition: "transform 0.2s"
        }}
      >
        START SCANNING NOW →
      </button>
    </div>
  );
}