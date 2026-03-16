import React, { useState } from "react";
import ActionCard from "./ActionCard";
import useClipboard from "../../hooks/useClipboard";
import WhatsAppShareModal from "./WhatsAppShareModal";
import * as XLSX from "xlsx";

export default function QuickActions({ data, allResults }) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const { copy, copied } = useClipboard();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!data) return null;

  const contact = Array.isArray(data) ? data[0] : data;

  // 📧 DIRECT EMAIL LOGIC (No Modal)
  const handleDirectEmail = () => {
    const subject = encodeURIComponent(`Contact Info: ${contact.name || "Business Card"}`);
    
    const bodyText = encodeURIComponent(
      `Hi,\n\nHere are the contact details:\n\n` +
      `Name: ${contact.name || "N/A"}\n` +
      `Designation: ${contact.designation || "N/A"}\n` +
      `Company: ${contact.company || "N/A"}\n` +
      `Phone: ${contact.phone || "N/A"}\n` +
      `Email: ${contact.email || "N/A"}\n` +
      `Website: ${contact.website || "N/A"}\n` +
      `Address: ${contact.address || "N/A"}\n\n` +
      `Sent via Business Card Scanner.`
    );

    // Direct Gmail Compose Link
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${bodyText}`;
    
    window.open(gmailUrl, "_blank");
  };

  // 🔥 Image Download Logic
  const handleDownloadImage = async () => {
    const imageUrl = contact.imageUrl || contact.image;
    if (!imageUrl) {
      alert("Image not available for download");
      return;
    }

    try {
      setIsDownloading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${contact.name?.replace(/\s+/g, '_') || "contact"}_card.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveContact = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name || ""}`,
      `ORG:${contact.company || ""}`,
      `TITLE:${contact.designation || ""}`,
      `TEL;TYPE=CELL:${contact.phone || ""}`,
      `EMAIL:${contact.email || ""}`,
      `URL:${contact.website || ""}`,
      `ADR;TYPE=WORK:;;${contact.address || ""}`,
      "END:VCARD",
    ].join("\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${contact.name || "contact"}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

const handleCopy = () => {
  const text = `
Name: ${contact.name || "N/A"}
Designation: ${contact.designation || "N/A"}
Company: ${contact.company || "N/A"}
Phone: ${contact.phone || "N/A"}
Email: ${contact.email || "N/A"}
Website: ${contact.website || "N/A"}
Address: ${contact.address || "N/A"}
  `.trim();

  copy(text);
};
  const handleDownloadExcel = () => {
    const rows = Array.isArray(allResults) ? allResults : [contact];
    const processedRows = rows.map((item) => {
      const rawContact = item.savedCard || item.data || item;
      const {
        _id, __v, imageUrl, backImageUrl, source, tags, isDeleted,
        createdAt, updatedAt, rawText, ...contactInfo
      } = rawContact;

      return {
        Timestamp: new Date().toLocaleString(),
        Name: contactInfo.name || contactInfo.fullName || "",
        Phone: contactInfo.phone || contactInfo.mobile || "",
        Email: contactInfo.email || "",
        Company: contactInfo.company || "",
        Designation: contactInfo.designation || "",
        Website: contactInfo.website || "",
        Address: contactInfo.address || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(processedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scanned Data");
    XLSX.writeFile(workbook, `Batch_Scan_${Date.now()}.xlsx`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-1 sm:gap-4 md:gap-8 items-start justify-items-center">
        
        {/* 1. WhatsApp */}
        <ActionCard
  label="WhatsApp"
  icon={
    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
      <svg viewBox="0 0 448 512" fill="#25D366" className="w-full h-full">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
      </svg>
    </div>
  }
  color="bg-[#dcfce7] text-[#22c55e]"
  onClick={() => setIsWhatsAppOpen(true)}
/>

        {/* 2. Copy */}
        <ActionCard
          label="Copy"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="sm:w-5 sm:h-5">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          }
          color="bg-[#fff7ed] text-[#f97316]"
          onClick={handleCopy}
        />

        {/* 3. Save VCF */}
        <ActionCard
  label="Save"
  icon={
    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="w-full h-full"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
      </svg>
    </div>
  }
  color="bg-[#f5f3ff] text-[#8b5cf6]"
  onClick={handleSaveContact}
/>

        {/* 4. Email (DIRECT REDIRECT) */}
        <ActionCard
          label="Email"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="sm:w-5 sm:h-5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          }
          color="bg-[#fef2f2] text-[#ef4444]"
          onClick={handleDirectEmail}
        />

        {/* 5. Excel */}
    <ActionCard
  label="Download Excel"
  icon={
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#107C41"
      className="sm:w-5 sm:h-5 scale-110"
    >
      <path d="M3 4a2 2 0 0 1 2-2h8l6 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4z" fill="#21A366"/>
      <path d="M13 2v6h6" fill="#107C41"/>
      <path
        d="M7 9l2.2 3L7 15h2l1.2-1.8L11.4 15h2l-2.2-3 2.2-3h-2l-1.2 1.8L9 9H7z"
        fill="#ffffff"
      />
    </svg>
  }
  color="bg-[#e8f5e9] text-[#107c41]"
  onClick={handleDownloadExcel}
/>
        {/* 6. Download Image */}
        <ActionCard
          label={isDownloading ? "..." : "Image"}
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={`sm:w-5 sm:h-5 ${isDownloading ? 'animate-bounce' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12l4.5 4.5m0 0 4.5-4.5M12 3v13.5" />
            </svg>
          }
          color="bg-gray-100 text-gray-700"
          onClick={handleDownloadImage}
        />

      </div>

      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        currentData={contact}
        allResults={allResults}
      />

      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl z-[60]">
          ✂️ Text Copied!
        </div>
      )}
    </div>
  );
}