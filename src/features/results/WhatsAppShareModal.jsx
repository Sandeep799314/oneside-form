import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppShareModal = ({
  isOpen,
  onClose,
  currentData,
  allResults,
  myNumber,
}) => {
  const [detailsMessage, setDetailsMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  // Data check karne ka behtar tarika
  const isDataValid = (val) => {
    if (val === undefined || val === null) return false;
    const checkVal = val.toString().toLowerCase().trim();
    const invalidValues = ["n/a", "not available", "none", "", "null", "undefined"];
    return !invalidValues.includes(checkVal);
  };

  useEffect(() => {
    if (!isOpen) return; // Jab modal open ho tabhi run kare

    const dataToProcess = allResults && allResults.length > 0 ? allResults : [currentData];
    let message = "";

    dataToProcess.forEach((card, index) => {
      if (!card) return;

      if (dataToProcess.length > 1) {
        message += `*Entry ${index + 1}*\n`; // Bold heading for WhatsApp
      }

      const fields = [
        { label: "Name", value: card.name },
        { label: "Job", value: card.designation || card.jobTitle },
        { label: "Phone", value: card.phone },
        { label: "Email", value: card.email },
        { label: "Company", value: card.company },
        { label: "Website", value: card.website },
        { label: "Address", value: card.address },
      ];

      fields.forEach((field) => {
        if (isDataValid(field.value)) {
          message += `*${field.label}:* ${field.value}\n`;
        }
      });

      if (index !== dataToProcess.length - 1) {
        message += `\n-------------------\n\n`;
      }
    });

    setDetailsMessage(message);
  }, [currentData, allResults, isOpen]);

  const handleSend = (targetNumber = "") => {
    const finalMessage = customMessage 
      ? `${customMessage}\n\n${detailsMessage}` 
      : detailsMessage;
      
    const cleanedNumber = targetNumber.replace(/\D/g, "");
    // Agar number hai toh direct chat, nahi toh contact picker
    const baseUrl = cleanedNumber ? `https://wa.me/${cleanedNumber}` : `https://wa.me/`;
    const whatsappURL = `${baseUrl}?text=${encodeURIComponent(finalMessage)}`;
    
    window.open(whatsappURL, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Background click par band hoga
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-[32px] p-6 md:p-8 shadow-2xl relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()} // Modal click par band nahi hoga
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                WhatsApp Share
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition-colors text-3xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 mb-2 block tracking-wider">
                  Details to Share
                </label>
                <textarea
                  rows="5"
                  value={detailsMessage}
                  onChange={(e) => setDetailsMessage(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 mb-2 block tracking-wider">
                  Add a Personal Note
                </label>
                <textarea
                  rows="2"
                  placeholder="Hey, check these contact details..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm transition-all"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleSend()}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Send to Contact</span>
                </button>

                
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppShareModal;