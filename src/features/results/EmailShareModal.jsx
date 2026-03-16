import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Layers, Send } from "lucide-react";

const EmailShareModal = ({ isOpen, onClose, currentData, allResults }) => {
  const [targetEmail, setTargetEmail] = useState("");
  const [includeAll,  setIncludeAll]  = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = () => {
    if (!currentData && !allResults) return;

    const subject = includeAll
      ? `Full Business Cards Report (${allResults.length} Contacts)`
      : `Contact Information: ${currentData?.name || "Business Card"}`;

    let bodyText = "";

    if (includeAll && allResults?.length > 0) {
      bodyText = "Hi,\n\nHere is the complete list of scanned contacts:\n\n";
      allResults.forEach((item, index) => {
        const c = item.savedCard || item.data || item;
        bodyText += `---------------- Contact #${index + 1} ----------------\n`;
        bodyText += `Name: ${c.name || c.fullName || "N/A"}\n`;
        bodyText += `Designation: ${c.designation || "N/A"}\n`;
        bodyText += `Company: ${c.company || "N/A"}\n`;
        bodyText += `Phone: ${c.phone || c.mobile || "N/A"}\n`;
        bodyText += `Email: ${c.email || "N/A"}\n`;
        bodyText += `Website: ${c.website || "N/A"}\n`;
        bodyText += `Address: ${c.address || "N/A"}\n\n`;
      });
      bodyText += "Sent via Business Card Scanner App.";
    } else {
      const c = currentData;
      bodyText =
        `Hi,\n\nHere are the contact details for ${c.name || "the scanned card"}:\n\n` +
        `Name: ${c.name || "N/A"}\n` +
        `Designation: ${c.designation || "N/A"}\n` +
        `Company: ${c.company || "N/A"}\n` +
        `Phone: ${c.phone || "N/A"}\n` +
        `Email: ${c.email || "N/A"}\n` +
        `Website: ${c.website || "N/A"}\n` +
        `Address: ${c.address || "N/A"}\n\n` +
        `Sent via Business Card Scanner App.`;
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, "_blank");
    onClose();
  };

  const isValid = targetEmail.includes("@");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4"
           style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>

        {/* Backdrop close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full sm:max-w-md"
          style={{
            background: "#fff",
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
          // Desktop rounded
          data-desktop-rounded
        >
          <style>{`
            @media (min-width: 640px) {
              [data-desktop-rounded] {
                border-radius: 24px !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.14) !important;
              }
            }
          `}</style>

          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          <div className="px-6 pb-8 pt-4 sm:px-8 sm:pt-6 sm:pb-8">

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Icon — same style as ScanMode card icons */}
                <div className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0"
                     style={{ background: "#fffbeb" }}>
                  <Mail size={20} style={{ color: "#F5A623" }} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 leading-tight m-0"
                      style={{ fontSize: 18, letterSpacing: "-0.3px" }}>
                    Email Export
                  </h3>
                  <p className="font-semibold text-gray-400 uppercase m-0"
                     style={{ fontSize: 10, letterSpacing: "0.16em" }}>
                    Direct Draft to Gmail
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
                style={{ background: "#F3F4F6", color: "#9CA3AF" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#E5E7EB";
                  e.currentTarget.style.color = "#1A1A1A";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#F3F4F6";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* ── DIVIDER ── */}
            <div className="mb-5" style={{ height: 1, background: "#F3F4F6" }} />

            <div className="flex flex-col gap-4">

              {/* ── EMAIL INPUT ── */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase text-gray-400"
                       style={{ fontSize: 10, letterSpacing: "0.18em" }}>
                  Recipient Email
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={targetEmail}
                  onChange={e => setTargetEmail(e.target.value)}
                  className="w-full font-semibold text-gray-800 outline-none transition-all"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: targetEmail && !isValid
                      ? "1.5px solid #FECACA"
                      : isValid
                      ? "1.5px solid #F5A623"
                      : "1.5px solid #E5E7EB",
                    background: "#F9FAFB",
                    fontSize: 14,
                  }}
                />
              </div>

              {/* ── INCLUDE ALL TOGGLE ── */}
              <div
                onClick={() => setIncludeAll(!includeAll)}
                className="flex items-center justify-between cursor-pointer rounded-xl px-4 py-3.5 transition-all"
                style={{
                  border: includeAll ? "1.5px solid #F5A623" : "1.5px solid #E5E7EB",
                  background: includeAll ? "#fffbeb" : "#F9FAFB",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: includeAll ? "#F5A623" : "#fff",
                      border: includeAll ? "1.5px solid #F5A623" : "1.5px solid #D1D5DB",
                      boxShadow: includeAll ? "0 2px 6px rgba(245,166,35,0.3)" : "none",
                    }}
                  >
                    {includeAll && (
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-gray-800 m-0" style={{ fontSize: 13 }}>
                      Include All Records
                    </p>
                    <p className="font-semibold text-gray-400 uppercase m-0 flex items-center gap-1"
                       style={{ fontSize: 9, letterSpacing: "0.14em" }}>
                      <Layers size={9} />
                      Batch Export: {allResults?.length || 0} Cards
                    </p>
                  </div>
                </div>
              </div>

              {/* ── SEND BUTTON — same amber as Trav "Search" ── */}
              <button
                onClick={handleSendEmail}
                disabled={!isValid}
                className="w-full flex items-center justify-center gap-2.5 border-none font-black uppercase transition-all"
                style={{
                  height: 50,
                  borderRadius: 13,
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  marginTop: 4,
                  cursor: isValid ? "pointer" : "not-allowed",
                  background: isValid ? "#F5A623" : "#E5E7EB",
                  color:      isValid ? "#fff"    : "#9CA3AF",
                  boxShadow:  isValid ? "0 6px 16px rgba(245,166,35,0.28)" : "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (isValid) e.currentTarget.style.background = "#e09620"; }}
                onMouseLeave={e => { if (isValid) e.currentTarget.style.background = "#F5A623"; }}
              >
                <Send size={14} className="shrink-0" />
                Draft in Gmail
              </button>

              {/* Cancel text link */}
              <button
                onClick={onClose}
                className="w-full border-none bg-transparent cursor-pointer font-bold uppercase text-gray-400 hover:text-gray-700 transition-colors"
                style={{ fontSize: 10, letterSpacing: "0.2em", paddingTop: 2 }}
              >
                Cancel
              </button>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmailShareModal;