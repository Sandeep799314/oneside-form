import axios from "axios";

/**
 * Aapka backend port 5000 par chal raha hai.
 * Base URL: http://localhost:5000/api
 */
const API_BASE_URL = "https://scanner-backend-60j9.onrender.com/api";

/**
 * ================================
 * SINGLE CARD SCAN SERVICE
 * ================================
 * @param {File} frontImage - Business card ki front image
 * @param {File} backImage - Business card ki back image (optional)
 */
export const scanSingleCard = async (frontImage, backImage = null) => {
  try {
    const formData = new FormData();

    // Backend controller ke 'uploadMiddleware' ke hisaab se keys:
    formData.append("front_image", frontImage);

    if (backImage) {
      formData.append("back_image", backImage);
    }

    // Professional API Call
    const response = await axios.post(
      `${API_BASE_URL}/single-cards/upload`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Optional: Progress tracking ke liye
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Uploading: ${percentCompleted}%`);
        }
      }
    );

    /**
     * Backend 'savedCard' object aur 'whatsappLink' return karta hai.
     * Hum wahi data frontend results screen ke liye bhej rahe hain.
     */
    return response.data;

  } catch (error) {
    // Detailed error logging for debugging
    const errorMessage = error.response?.data?.message || "Server connection failed";
    console.error("Single scan service error:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * ================================
 * BULK CARD SCAN SERVICE
 * ================================
 * @param {Array} files - Multiple images ka array
 */
export const scanBulkCards = async (files) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      // Backend bulk route ke liye 'files' key use hoti hai
      formData.append("files", file);
    });

    const response = await axios.post(
      `${API_BASE_URL}/cards/bulk`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Bulk processing failed";
    console.error("Bulk scan service error:", errorMessage);
    throw new Error(errorMessage);
  }
};