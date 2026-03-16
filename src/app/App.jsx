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

  /* NEW STATE */
  const [returnToResults, setReturnToResults] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  const handleFullReset = () => {
    setContactData(null);
    setAllResults([]);
    goTo("landing");
  };

  const handleNewScan = (d) => {
    setContactData(d);
    setAllResults((p) => [...p, d]);
    setLoading(false);
    goTo("results");
  };

  const handleSingleSelection = (m) => {
    setCaptureMethod(m);
    setReturnToResults(false);
    goTo("single");
  };

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
            onBack={handleFullReset}
            onSingle={handleSingleSelection}
            onBulk={() => goTo("bulk")}
          />
        );

      case "single":
        return (
          <SingleScan
            onBack={() => {
              if (returnToResults) {
                setReturnToResults(false);
                goTo("results");
              } else {
                goTo("mode");
              }
            }}
            onBulk={() => goTo("bulk")}
            setStep={goTo}
            setContactData={handleNewScan}
            setLoading={setLoading}
            captureMethod={captureMethod}
          />
        );

      case "bulk":
        return (
          <BulkScan
            onBack={() => goTo("mode")}
            onSingle={() => goTo("mode")}
          />
        );

      case "results":
        return (
          <Results
            data={contactData}
            allResults={allResults}
            onRescan={() => {
              setReturnToResults(true);
              goTo("single");
            }}
            onBack={() => goTo("mode")}
          />
        );

      default:
        return <Landing onStart={() => goTo("mode")} />;
    }
  };

  const isLanding = step === "landing";

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        body.no-vscroll {
          overflow: hidden !important;
          height: 100vh !important;
        }
      `}</style>

      <BodyScrollController step={step} />

      <div
        className="w-full bg-white font-sans selection:bg-yellow-100"
        style={{
          height: isLanding ? "100vh" : "auto",
          overflow: isLanding ? "hidden" : "visible",
          display: "flex",
          flexDirection: "column",
        }}
      >

        <Navbar onBack={handleBack} />

        {loading && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={{ background: "rgba(26,26,26,0.65)", backdropFilter: "blur(4px)" }}
          >
            <div
              className="bg-white rounded-[24px] shadow-2xl flex flex-col items-center gap-5 w-full p-8"
              style={{ maxWidth: 340 }}
            >
              <Loader />

              <div className="text-center">
                <p
                  className="font-black text-gray-900 animate-pulse"
                  style={{ fontSize: 18, letterSpacing: "-0.3px" }}
                >
                  Analyzing Card Details
                </p>

                <p
                  className="text-gray-400 font-medium mt-1"
                  style={{ fontSize: 13 }}
                >
                  AI is extracting data...
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ paddingTop: isLanding ? 0 : 50, flex: 1 }}>
          {renderScreen()}
        </div>

      </div>
    </>
  );
}

function BodyScrollController({ step }) {
  useEffect(() => {

    const update = () => {
      if (step === "landing") {
        document.body.classList.add("no-vscroll");
      } else {
        document.body.classList.remove("no-vscroll");
      }
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      document.body.classList.remove("no-vscroll");
      window.removeEventListener("resize", update);
    };

  }, [step]);

  return null;
}