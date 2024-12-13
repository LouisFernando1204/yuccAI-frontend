import React, { useState, useEffect } from 'react';
import axios from "axios";
import { LoadingScreen } from '../components/ui/loading-screen';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { QuestionAnswer } from '../utils/objectInterface';

export const History: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allInformation, setAllInformation] = useState<QuestionAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchAllInformation = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_GOLANG_API_URL}/get_all_information`
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
    return <LoadingScreen />
  }

  const isEmpty = !allInformation || allInformation.length === 0;

  return (
    <div className="w-full font-poppins">
      <h1
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="500"
        className="text-2xl font-bold mb-6 text-primary">History</h1>
      <div className="space-y-4">
        {isEmpty ?
          (
            <p
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-duration="500"
              className="flex justify-center items-center w-full h-screen text-center text-lg text-primary">
              Oops... Kamu belum bertanya apapun ke YuccAI 🧐
            </p>
          )
          : allInformation.map((item, index) => (
            <div
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-duration="500"
              key={index}
              className="shadow-md rounded-lg overflow-hidden border border-primary bg-white backdrop-blur-md"
            >
              <button
                onClick={() => handleToggle(index)}
                className="flex flex-row justify-between w-full text-left py-4 px-6 hover:bg-primary/20 transition-colors font-bold focus:outline-none text-dark"
              >
                {item.question}? <FontAwesomeIcon
                  className=""
                  icon={openIndex === index ? faCaretUp : faCaretDown}
                  size="xl"
                  style={{ color: "#F0843C" }}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-primary/10 border-t border-primary font-normal text-dark">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};