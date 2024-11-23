import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./views/Home";
import History from "./views/History";
import { Navbar } from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";
import { SurveyModal } from "./components/modal/SurveyModal";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNavigateToHistory, setIsNavigateToHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const switchMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateToHistory = () => {
    setIsNavigateToHistory(true);
    navigate("/history");
  };

  const navigateToHome = () => {
    setIsNavigateToHistory(false);
    navigate("/");
  };

  const chooseAnswer = (answer: string) => {
    sessionStorage.setItem("surveyAnswer", answer);
    setShowModal(false);
  };

  useEffect(() => {
    const surveyAnswer = sessionStorage.getItem("surveyAnswer");
    if (!surveyAnswer) {
      setShowModal(true);
    }
  }, []);

  return (
    <>
      <div
        className={`min-h-screen min-w-screen font-poppins ${
          isDarkMode ? "text-light bg-dark" : "text-dark bg-light"
        }`}
      >
        <Navbar
          switchMode={switchMode}
          isDarkMode={isDarkMode}
          navigateToHistory={navigateToHistory}
          navigateToHome={navigateToHome}
          isNavigateToHistory={isNavigateToHistory}
        />
        <div className="m-4 lg:m-10">
          <Routes>
            <Route path="/" element={<Home statusModal={showModal} />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
        <Footer
          navigateToHistory={navigateToHistory}
          navigateToHome={navigateToHome}
          isNavigateToHistory={isNavigateToHistory}
        />
      </div>
      {showModal && <SurveyModal chooseAnswer={chooseAnswer} />}
    </>
  );
}

export default App;
