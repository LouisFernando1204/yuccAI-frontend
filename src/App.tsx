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
import { SideBar } from "./components/fixed/SideBar";

function App() {
  const [isNavigateToHistory, setIsNavigateToHistory] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [recommendationLoading, setRecommendationLoading] =
    useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<QuestionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [allInformation, setAllInformation] = useState<QuestionAnswer[]>([]);
  const navigate = useNavigate();

  const navigateToHistory = () => {
    setIsNavigateToHistory(true);
    setIsHistoryLoading(true);
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
        `${import.meta.env.VITE_GOLANG_API_URL}/api/get_all_information`
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
    const fetchAllInformation = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_GOLANG_API_URL}/api/get_all_information`
        );
        if (result.data != null) {
          console.log("RESULT DATA: ", result.data);
        } else {
          console.log("GA ADA ISI WOI");
        }
        setAllInformation(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    if (isNavigateToHistory) {
      fetchAllInformation();
    }
  }, [isNavigateToHistory]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  });

  if (isLoading || isHistoryLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="flex">
        <SideBar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          navigateToHistory={navigateToHistory}
          navigateToHome={navigateToHome}
        />
        <div>
          <div
            className={`relative min-h-screen w-screen font-poppins text-darkOrange bg-darkNavy`}
          >
            <div
              className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                isOpen ? "opacity-50 z-50" : "opacity-0 pointer-events-none"
              }`}
            ></div>
            <Navbar isNavigateToHistory={isNavigateToHistory} />
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
                  element={
                    <History
                      isHistoryLoading={isHistoryLoading}
                      setIsHistoryLoading={setIsHistoryLoading}
                      allInformation={allInformation}
                    />
                  }
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
        </div>
      </div>
    </>
  );
}

export default App;
