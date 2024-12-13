import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./views/Home";
import { History } from "./views/History";
import { Navbar } from "./components/fixed/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "./components/fixed/Footer";
import { SurveyModal } from "./components/modal/SurveyModal";
import { LoadingScreen } from "./components/ui/loading-screen";
import { QuestionAnswer } from "./utils/objectInterface";
import axios from "axios";

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isNavigateToHistory, setIsNavigateToHistory] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [recommendationLoading, setRecommendationLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<QuestionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const fetchRecommendation = async (answerSource: string) => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_GOLANG_API_URL}/get_all_information`
      );
      const filteredRecommendation = result.data.filter(
        (item: { answer_source: string }) => item.answer_source.includes(answerSource)
      );
      setRecommendation(filteredRecommendation);
    } catch (error) {
      console.error(error);
    } finally {
      setRecommendationLoading(false);
    }
  };

  useEffect(() => {
    const surveyAnswer = sessionStorage.getItem("surveyAnswer");
    if (!surveyAnswer) {
      setRecommendationLoading(true);
    }
  }, []);

  useEffect(() => {
    const surveyAnswer = sessionStorage.getItem("surveyAnswer");
    if (surveyAnswer) {
      fetchRecommendation(surveyAnswer);
    }
  }, [recommendationLoading, showModal]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <div
        className={`min-h-screen w-screen font-poppins ${isDarkMode ? "text-light bg-dark" : "text-dark bg-light"
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
                  loading={recommendationLoading}
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
