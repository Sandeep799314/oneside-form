import { useState, useEffect } from "react";
import useStep from "../hooks/useStep";
import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";
import Landing from "../features/landing/Landing";
import ScanMode from "../features/scan/ScanMode";
import SingleScan from "../features/scan/SingleScan";
import BulkScan from "../features/scan/BulkScan";
import Results from "../features/results/Results";

export default function App() {
  const { step, goTo } = useStep("landing");
  const [contactData, setContactData] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captureMethod, setCaptureMethod] = useState("upload");
  const [returnToResults, setReturnToResults] = useState(false);

  const isLanding = step === "landing";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const handleBack = () => {
    if (step === "landing") return;
    if (step === "results") return goTo("mode");
    if (step === "mode") return goTo("landing");
    goTo("mode");
  };

  const renderScreen = () => {
    switch (step) {
      case "landing":
        return <Landing onStart={() => goTo("mode")} />;
      case "mode":
        return (
          <ScanMode
            onBack={() => goTo("landing")}
            onSingle={(m) => { setCaptureMethod(m); goTo("single"); }}
            onBulk={() => goTo("bulk")}
          />
        );
      case "single":
        return (
          <SingleScan
            onBack={() => goTo(returnToResults ? "results" : "mode")}
            onBulk={() => goTo("bulk")}
            setStep={goTo}
            setContactData={(d) => { setContactData(d); setAllResults(p => [...p, d]); setLoading(false); goTo("results"); }}
            setLoading={setLoading}
            captureMethod={captureMethod}
          />
        );
      case "results":
        return (
          <Results
            data={contactData}
            allResults={allResults}
            onRescan={() => { setReturnToResults(true); goTo("single"); }}
            onBack={() => goTo("mode")}
          />
        );
      default:
        return <Landing onStart={() => goTo("mode")} />;
    }
  };

  return (
    <>
      <style>{`
        /* Global Mobile Fixes */
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background: #fff;
          /* Horizontal scroll bilkul band */
          overflow-x: hidden !important; 
        }

        /* Desktop par landing block rahega, mobile par scroll hoga */
        @media (min-width: 768px) {
          body.no-vscroll {
            overflow: hidden !important;
            height: 100vh !important;
          }
        }

        /* Scan section ko mobile par top par lane ke liye */
        @media (max-width: 767px) {
          .mobile-order-1 { order: 1 !important; } /* Scan Section */
          .mobile-order-2 { order: 2 !important; } /* OR Divider */
          .mobile-order-3 { order: 3 !important; } /* Manual Form */
          
          .landing-container {
            padding: 80px 20px 40px !important; /* Navbar ke liye top padding */
            flex-direction: column !important;
            gap: 40px !important;
          }
        }
      `}</style>

      <BodyScrollController step={step} />

      <div className="w-full flex flex-col" style={{ minHeight: "100vh" }}>
        
        {/* Navbar humesha top par rahega */}
        <div className="fixed top-0 left-0 w-full z-[100]">
          <Navbar onBack={handleBack} />
        </div>

        {/* Loader Component */}
        {loading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] p-8 flex flex-col items-center gap-4 w-full max-w-[320px]">
              <Loader />
              <p className="font-bold text-gray-900 animate-pulse">Extracting Data...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div 
          className="flex-1 w-full"
          style={{ 
            paddingTop: isLanding ? 0 : "60px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {renderScreen()}
        </div>
      </div>
    </>
  );
}

function BodyScrollController({ step }) {
  useEffect(() => {
    if (step === "landing" && window.innerWidth >= 768) {
      document.body.classList.add("no-vscroll");
    } else {
      document.body.classList.remove("no-vscroll");
    }
    return () => document.body.classList.remove("no-vscroll");
  }, [step]);
  return null;
}