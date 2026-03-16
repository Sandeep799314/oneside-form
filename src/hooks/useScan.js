import { useState } from "react";
import { scanSingleCard, scanBulkCards } from "../features/scan/scanService";

export default function useScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================================
     SINGLE SCAN
  ================================= */
  const handleSingleScan = async (frontImage, backImage = null) => {
    if (!frontImage) {
      setError("Front image is required");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Service call
      const data = await scanSingleCard(frontImage, backImage);
      
      // Backend successful response
      return data; 
    } catch (err) {
      console.error("Single scan hook failed:", err);
      
      // Backend se jo error message aa raha hai wahi dikhayenge
      const errorMessage = err.response?.data?.message || "Something went wrong during scan";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     BULK SCAN
  ================================= */
  const handleBulkScan = async (files) => {
    if (!files || files.length === 0) {
      setError("Please upload at least one file");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await scanBulkCards(files);
      return data;
    } catch (err) {
      console.error("Bulk scan hook failed:", err);
      setError("Bulk scan failed. Check your connection.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSingleScan,
    handleBulkScan,
    loading,
    error,
  };
}