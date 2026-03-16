import axios from "axios";

// Backend port 5000 par chal raha hai
const API_BASE_URL = "https://scanner-backend-60j9.onrender.com/api/cards";



/**
 * 1. UPDATE CARD DATA
 * Agar user scan ke baad results mein koi correction karta hai.
 * Route: PUT /api/cards/:id
 */
export const updateCardData = async (cardId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${cardId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Ye backend se updated card aur whatsappLink return karega
    return response.data;
  } catch (error) {
    console.error("Error updating card:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 2. GET SINGLE CARD DETAILS
 * Kisi specific card ki details fetch karne ke liye (ID ke through).
 * Route: GET /api/cards/:id
 */
export const getCardDetails = async (cardId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${cardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching card details:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 3. DELETE CARD (Soft Delete)
 * Card ko delete karne ke liye.
 * Route: DELETE /api/cards/:id
 */
export const deleteCard = async (cardId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${cardId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting card:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 4. RESTORE CARD (Optional)
 * Agar galti se delete ho jaye toh wapas lane ke liye.
 * Route: PATCH /api/cards/restore/:id
 */
export const restoreCard = async (cardId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/restore/${cardId}`);
    return response.data;
  } catch (error) {
    console.error("Error restoring card:", error.response?.data || error.message);
    throw error;
  }
};