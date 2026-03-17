import React, { useState, useEffect, memo } from "react";
import { saveToGoogleSheet } from "../../utils/googleSheets";

/* ---------------- INPUT ROW (FIXED) ---------------- */

const InputRow = memo(({ name, value, onChange, placeholder, isLast }) => (
  <div style={{
    borderBottom: isLast ? "none" : "1px solid #f2f2f7",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    background: "#fff"
  }}>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        border: "none",
        outline: "none",
        fontSize: "16px",
        color: "#000",
        background: "transparent",
        fontFamily: "inherit"
      }}
    />
  </div>
));

/* ---------------- MANUAL FORM ---------------- */

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

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

      setTimeout(() => {
        setStatus("idle");
        setMsg("");
      }, 3000);
    } else {
      setStatus("error");
      setMsg(res.message || "Something went wrong.");
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 360,
      background: "#f2f2f7",
      borderRadius: 28,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      maxHeight: isMobile ? "none" : "80vh",
      overflowY: isMobile ? "visible" : "auto",
      paddingBottom: 20
    }}>
      
      {/* HEADER */}
      <div style={{ padding: "24px 16px 12px", textAlign: "center" }}>
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#6b7280",
          marginBottom: 8
        }}>
          Enter Card Details Manually
        </p>

        <div style={{
          width: 72,
          height: 72,
          background: "#a2a2a7",
          borderRadius: "50%",
          margin: "0 auto 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 32
        }}>
          👤
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600 }}>
          Contact Details
        </h2>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 15 }}>
        
        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <InputRow name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name *" />
          <InputRow name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
          <InputRow name="company" value={form.company} onChange={handleChange} placeholder="Company" isLast />
        </div>

        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <InputRow name="phone" value={form.phone} onChange={handleChange} placeholder="Add phone" />
          <InputRow name="email" value={form.email} onChange={handleChange} placeholder="Add email" isLast />
        </div>

        {!showOptional && (
          <button
            onClick={() => setShowOptional(true)}
            style={{
              background: "none",
              border: "none",
              color: "#007aff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            + Add Designation & Website
          </button>
        )}

        {showOptional && (
          <div style={{ borderRadius: 12, overflow: "hidden" }}>
            <InputRow name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" />
            <InputRow name="website" value={form.website} onChange={handleChange} placeholder="Website" isLast />
          </div>
        )}

        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <InputRow name="address" value={form.address} onChange={handleChange} placeholder="Address" />
          <div style={{ padding: "12px 16px", background: "#fff" }}>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              style={{
                width: "100%",
                height: 50,
                border: "none",
                outline: "none",
                fontSize: 16
              }}
            />
          </div>
        </div>

        {msg && (
          <div style={{
            textAlign: "center",
            fontSize: 13,
            color: status === "success" ? "#34c759" : "#ff3b30"
          }}>
            {msg}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === "saving"}
          style={{
            width: "100%",
            height: 52,
            background: "#f7be39",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 16
          }}
        >
          {status === "saving" ? "Saving..." : "SUBMIT CONTACT"}
        </button>

      </div>
    </div>
  );
}

/* ---------------- LANDING PAGE ---------------- */

export default function LandingUI({ onStart }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "90px 20px" : "20px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 40,
        alignItems: "center"
      }}>

        <ManualEntryForm isMobile={isMobile} />

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{ width: isMobile ? 80 : 2, height: isMobile ? 2 : 100, background: "#e5e7eb" }} />
          <span style={{ fontWeight: 900, color: "#cbd5e1" }}>OR</span>
          <div style={{ width: isMobile ? 80 : 2, height: isMobile ? 2 : 100, background: "#e5e7eb" }} />
        </div>

        <ScanSection onStart={onStart} isMobile={isMobile} />

      </div>
    </div>
  );
}

/* ---------------- SCAN SECTION ---------------- */

function ScanSection({ onStart, isMobile }) {
  return (
    <div style={{ textAlign: isMobile ? "center" : "left" }}>
      <h1 style={{ fontSize: isMobile ? 36 : 60, fontWeight: 900 }}>
        Scan Any <br />
        <span style={{ color: "#f7be39" }}>Business Card</span>
      </h1>

      <p style={{ marginBottom: 20, color: "#6b7280" }}>
        Turn cards into digital contacts instantly.
      </p>

      <button
        onClick={onStart}
        style={{
          height: 60,
          padding: "0 40px",
          background: "#000",
          color: "#fff",
          borderRadius: 20,
          border: "none",
          fontWeight: 800,
          cursor: "pointer"
        }}
      >
        START SCANNING →
      </button>
    </div>
  );
}