import axios from "axios";

export const exportToExcel = async (data) => {
  try {
    // Agar backend ID based export karta hai to yaha adjust karo
    // Yaha hum data directly backend ko bhej rahe hain

    const response = await axios.post(
      "http://localhost:5000/api/export/excel",
      data,
      {
        responseType: "blob", // important for file download
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "business-cards.xlsx";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Excel export failed:", error);
    alert("Failed to export Excel file.");
  }
};