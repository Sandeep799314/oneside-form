import { useState, useEffect, useCallback } from "react";

export default function useStep(initialStep) {
  const [step, setStep] = useState(initialStep);

  // Mount pe initial history entry push karo
  useEffect(() => {
    // Replace current state with initial step
    window.history.replaceState({ step: initialStep }, "", window.location.pathname);
  }, []);

  // Browser back button listener
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.step) {
        // Directly set step from history state — no goTo (no new push)
        setStep(e.state.step);
      } else {
        setStep(initialStep);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialStep]);

  const goTo = useCallback((nextStep) => {
    // Push new entry into browser history
    window.history.pushState({ step: nextStep }, "", window.location.pathname);
    setStep(nextStep);
  }, []);

  return { step, goTo };
}