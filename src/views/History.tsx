import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoadingScreen } from "../components/ui/loading-screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { QuestionAnswer } from "../utils/objectInterface";

interface HistoryProps {
  isDarkMode: boolean;
}

export const History: React.FC<HistoryProps> = ({ isDarkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allInformation, setAllInformation] = useState<QuestionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const capitalizeFirstLetter = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const handleToggle = (index: number) => {
    const originalIndex = allInformation.length - 1 - index;
    setOpenIndex(openIndex === originalIndex ? null : originalIndex);
  };

  useEffect(() => {
    const fetchAllInformation = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_GOLANG_API_URL}/api/get_all_information`
        );
        setAllInformation(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInformation();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isEmpty = !allInformation || allInformation.length === 0;

  return (
    <div
      className={`w-full font-poppins ${isDarkMode ? "text-light bg-dark" : "text-dark bg-light"
        }`}
    >
      <h1
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="500"
        className="text-2xl font-bold mb-6 text-primary"
      >
        History
      </h1>
      <div className="space-y-4">
        {isEmpty ? (
          <p
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="500"
            className="flex justify-center items-center w-full h-screen text-center text-lg text-primary"
          >
            Oops... Kamu belum bertanya apapun ke YuccAI 🧐
          </p>
        ) : (
          allInformation
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-duration="500"
                key={index}
                className={`shadow-md rounded-lg overflow-hidden border-2 ${isDarkMode ? "border-primary bg-light" : "border-primary bg-dark"
                  } backdrop-blur-md`}
              >
                <button
                  onClick={() => handleToggle(index)}
                  className={`flex flex-row justify-between w-full text-left py-4 px-6 hover:${isDarkMode ? "bg-primary/20" : "bg-primary/20"
                    } transition-colors font-bold focus:outline-none ${isDarkMode ? "text-dark" : "text-light"
                    }`}
                >
                  {capitalizeFirstLetter(item.question)}?{" "}
                  <FontAwesomeIcon
                    className=""
                    icon={
                      openIndex === allInformation.length - 1 - index
                        ? faCaretUp
                        : faCaretDown
                    }
                    size="xl"
                    style={{ color: "#F0843C" }}
                  />
                </button>
                {openIndex === allInformation.length - 1 - index && (
                  <div
                    className={`px-6 py-4 ${isDarkMode
                      ? "bg-light/10 border-t border-primary"
                      : "bg-primary/10 border-t border-primary"
                      } font-normal ${isDarkMode ? "text-dark" : "text-light"
                      } hover:${isDarkMode ? "bg-primary/20" : "bg-primary/20"
                      } `}
                  >
                    <p>{capitalizeFirstLetter(item.answer)}</p>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};