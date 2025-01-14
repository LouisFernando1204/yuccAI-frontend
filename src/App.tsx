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
  const [isNavigateToHistory, setIsNavigateToHistory] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [recommendationLoading, setRecommendationLoading] =
    useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<QuestionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
        `${import.meta.env.VITE_GOLANG_API_URL}/api/get_all_information`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const filteredRecommendation = result.data.filter(
        (item: { answersource: string }) =>
          item.answersource.includes(answerSource)
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
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div
        className={`relative min-h-screen w-screen font-poppins text-darkOrange bg-darkNavy
          }`}
      >
        <Navbar
          navigateToHistory={navigateToHistory}
          navigateToHome={navigateToHome}
          isNavigateToHistory={isNavigateToHistory}
        />
        <div className="my-4 lg:m-10">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  statusModal={showModal}
                  loading={recommendationLoading}
                  recommendation={recommendation}
                  fetchRecommendation={fetchRecommendation}
                />
              }
            />
            <Route
              path="/history"
            />
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
