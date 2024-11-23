import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./views/Home";
import History from "./views/History";
import { Navbar } from "./components/fixed/Navbar";
import { useState } from "react";
import { Footer } from "./components/fixed/Footer";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNavigateToHistory, setIsNavigateToHistory] = useState(false);
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

  return (
    <>
      <div
        className={`h-screen font-poppins ${
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
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
          <Footer navigateToHistory={navigateToHistory} navigateToHome={navigateToHome} isNavigateToHistory={ isNavigateToHistory } />
        </div>
      </div>
    </>
  );
}

export default App;
