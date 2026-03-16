// ─────────────────────────────────────────────────────────────
//  Google Sheets Integration via Apps Script Web App
//  ➜ Yahan apna Apps Script Web App URL paste karo
// ─────────────────────────────────────────────────────────────

export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygqcgG8fam81BNtOaBsRtXWNf6EmCNRqreKnEbgAUnSwPTrWguQwRigkUbZJ4QS3Gf/exec";

/**
 * Ek contact row Google Sheet mein save karta hai.
 * @param {object} contact  – { name, phone, email, company, designation, website, address }
 * @param {string} source   – "manual" | "scan"
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const saveToGoogleSheet = async (contact, source = "scan") => {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
    console.warn("⚠️  Google Sheets URL not configured in src/utils/googleSheets.js");
    return { success: false, message: "Google Sheets URL not configured." };
  }

  const payload = {
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    source,
    name:        contact.name        || "",
    phone:       contact.phone       || "",
    email:       contact.email       || "",
    company:     contact.company     || "",
    designation: contact.designation || "",
    website:     contact.website     || "",
    address:     contact.address     || "",
  };

  try {
    // Apps Script ko no-cors se call karte hain (POST + redirect)
    await fetch(APPS_SCRIPT_URL, {
      method:  "POST",
      mode:    "no-cors",          // Apps Script CORS allow nahi karta, isliye
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    // no-cors mein response body read nahi hoti — assume success
    return { success: true, message: "Saved to Google Sheet ✓" };
  } catch (err) {
    console.error("Google Sheets save failed:", err);
    return { success: false, message: "Failed to save to Google Sheet." };
  }
};
