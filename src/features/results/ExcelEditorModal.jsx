import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { Download, X, FileSpreadsheet } from "lucide-react";

const ExcelEditorModal = ({ isOpen, onClose, data, inline, editedContact }) => {
  const [gridData,    setGridData]    = useState([]);
  const processedIds = useRef(new Set());

  useEffect(() => {
    if ((isOpen || inline) && data) {
      const initialArray = Array.isArray(data) ? data : [data];
      const newRows = [];

      initialArray.forEach((item) => {
        const rawContact  = item.savedCard || item.data || item;
        const uniqueKey   = rawContact._id || `${rawContact.phone}-${rawContact.name}`;

        if (!processedIds.current.has(uniqueKey)) {
          const { _id, __v, imageUrl, backImageUrl, source, tags, isDeleted,
                  createdAt, updatedAt, rawText, ...contact } = rawContact;

          newRows.push({
            Timestamp:   new Date().toLocaleString(),
            Name:        contact.name || contact.fullName || "",
            Phone:       contact.phone || contact.mobile || "",
            Email:       contact.email || "",
            Company:     contact.company || "",
            Designation: contact.designation || "",
          });
          processedIds.current.add(uniqueKey);
        }
      });

      if (newRows.length > 0) setGridData(prev => [...prev, ...newRows]);
    }
  }, [data, isOpen, inline]);

  useEffect(() => {
    if (!editedContact || gridData.length === 0) return;
    setGridData(prev => {
      const updated    = [...prev];
      const lastIndex  = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        Name:        editedContact.name        || updated[lastIndex].Name,
        Phone:       editedContact.phone       || updated[lastIndex].Phone,
        Email:       editedContact.email       || updated[lastIndex].Email,
        Company:     editedContact.company     || updated[lastIndex].Company,
        Designation: editedContact.designation || updated[lastIndex].Designation,
      };
      return updated;
    });
  }, [editedContact]);

  const handleCellChange = (rowIndex, field, value) => {
    const updated         = [...gridData];
    updated[rowIndex][field] = value;
    setGridData(updated);
  };

  const downloadExcel = () => {
    if (!gridData.length) return;
    const ws = XLSX.utils.json_to_sheet(gridData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scanned Data");
    XLSX.writeFile(wb, `Batch_Scan_${Date.now()}.xlsx`);
  };

  const clearAll = () => { setGridData([]); processedIds.current.clear(); };

  if (!inline && !isOpen) return null;

  const content = (
    <>
      <style>{`
        .excel-th {
          background: #F9FAFB;
          font-size: 9px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: #9CA3AF; padding: 11px 14px;
          text-align: left; white-space: nowrap;
          border-bottom: 1px solid #F3F4F6;
          border-right: 1px solid #F3F4F6;
        }
        .excel-th:last-child { border-right: none; }
        .excel-td {
          padding: 0;
          border-bottom: 1px solid #F9FAFB;
          border-right: 1px solid #F9FAFB;
        }
        .excel-td:last-child { border-right: none; }
        .excel-input {
          width: 100%; padding: 10px 14px;
          background: transparent; border: none; outline: none;
          font-size: 12px; font-weight: 500; color: #1A1A1A;
          white-space: nowrap;
        }
        .excel-input:focus { background: #FFFBEB; }
        .excel-tr:hover .excel-input { background: #FAFAFA; }
        .excel-tr:hover .excel-input:focus { background: #FFFBEB; }
        .excel-tr:last-child .excel-td { border-bottom: none; }
      `}</style>

      <div className="w-full bg-white flex flex-col overflow-hidden"
           style={{ borderRadius: inline ? 0 : 20, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Header — only when modal (not inline, Results has its own header) */}
        {!inline && (
          <div className="flex items-center justify-between px-5 py-4 border-b"
               style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                   style={{ background: "#fffbeb" }}>
                <FileSpreadsheet size={18} style={{ color: "#F5A623" }} />
              </div>
              <div>
                <h2 className="font-black uppercase text-gray-900 m-0 leading-tight"
                    style={{ fontSize: 14, letterSpacing: "-0.2px" }}>
                  Excel Repository
                </h2>
                <p className="font-semibold uppercase text-gray-400 m-0"
                   style={{ fontSize: 9, letterSpacing: "0.18em" }}>
                  Batch Verification
                </p>
              </div>
              <span className="font-bold rounded-full px-2 py-0.5"
                    style={{ fontSize: 9, background: "#F3F4F6", color: "#6B7280" }}>
                {gridData.length}
              </span>
            </div>
            <button onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors"
                    style={{ background: "#F3F4F6", color: "#9CA3AF" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#E5E7EB"; e.currentTarget.style.color = "#1A1A1A"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.color = "#9CA3AF"; }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto" style={{ maxHeight: inline ? 360 : 420 }}>
          <table className="w-full border-collapse" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                {gridData.length > 0 && Object.keys(gridData[0]).map(key => (
                  <th key={key} className="excel-th sticky top-0">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridData.map((row, rowIndex) => (
                <tr key={rowIndex} className="excel-tr">
                  {Object.keys(row).map(field => (
                    <td key={field} className="excel-td">
                      <input
                        type="text"
                        value={row[field] || ""}
                        onChange={e => handleCellChange(rowIndex, field, e.target.value)}
                        className="excel-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {gridData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <FileSpreadsheet size={28} style={{ color: "#E5E7EB" }} />
              <p className="font-black uppercase text-gray-300 m-0"
                 style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                No Records Found
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t"
             style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <p className="font-black uppercase text-gray-400 m-0"
             style={{ fontSize: 8, letterSpacing: "0.2em" }}>
            {gridData.length > 0 ? "Live Synchronization Active" : "Waiting for scan..."}
          </p>
          <p className="font-black uppercase text-gray-300 m-0 lg:hidden"
             style={{ fontSize: 8, letterSpacing: "0.18em" }}>
            ← Swipe →
          </p>
        </div>
      </div>
    </>
  );

  if (inline) return content;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      >
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.96, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 10 }}
          className="relative w-full"
          style={{ maxWidth: 900, borderRadius: 20, overflow: "hidden",
                   boxShadow: "0 20px 60px rgba(0,0,0,0.14)" }}
        >
          {content}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExcelEditorModal;