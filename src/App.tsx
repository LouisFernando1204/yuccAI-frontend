import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./views/Home";
import History from "./views/History";
import { Navbar } from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";
import { SurveyModal } from "./components/modal/SurveyModal";
import { QuestionAndAnswer } from "./utils/objectInterface";
import { dummyQuestionAndAnswer } from "./utils/list";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNavigateToHistory, setIsNavigateToHistory] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<QuestionAndAnswer[]>([]);
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

  const fetchRecommendation = async (answer: string) => {
    // fetch recommendation here
    try {
      const data = dummyQuestionAndAnswer;
      setRecommendation(data);
    } catch (error) {
      console.log(error);
    } finally {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      // setLoading(false);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    const surveyAnswer = sessionStorage.getItem("surveyAnswer");
    if (!surveyAnswer) {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    const surveyAnswer = sessionStorage.getItem("surveyAnswer");
    if (surveyAnswer) {
      fetchRecommendation(surveyAnswer);
    }
  }, [loading, showModal]);

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
            <Route
              path="/"
              element={
                <Home
                  statusModal={showModal}
                  loading={loading}
                  recommendation={recommendation}
                />
              }
            />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
        <Footer
          navigateToHistory={navigateToHistory}
          navigateToHome={navigateToHome}
          isNavigateToHistory={isNavigateToHistory}
        />
      </div>
      {showModal && !sessionStorage.getItem("surveyAnswer") && (
        <SurveyModal chooseAnswer={chooseAnswer} />
      )}
    </>
  );
}

export default App;
