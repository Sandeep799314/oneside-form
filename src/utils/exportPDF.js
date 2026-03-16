import axios from "axios";

export const exportToPDF = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/export/pdf",
      data,
      {
        responseType: "blob", // important for file download
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "business-cards.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("Failed to export PDF file.");
  }
};