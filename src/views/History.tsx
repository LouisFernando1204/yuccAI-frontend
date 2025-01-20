import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { QuestionAnswer } from "../utils/objectInterface";

interface HistoryProps {
  isHistoryLoading: boolean;
  setIsHistoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  allInformation: QuestionAnswer[];
}

export const History: React.FC<HistoryProps> = ({
  isHistoryLoading,
  setIsHistoryLoading,
  allInformation
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const capitalizeFirstLetter = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const handleToggle = (index: number) => {
    const originalIndex = allInformation.length - 1 - index;
    setOpenIndex(openIndex === originalIndex ? null : originalIndex);
  };

  const isEmpty = !allInformation || allInformation.length === 0;

  if (!isHistoryLoading) {
    return (
      <div
        className={`w-full mt-10 pt-28 font-poppins text-darkOrange bg-darkNavy`}
      >
        <div className="mx-4 space-y-4">
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
                  className={`shadow-md rounded-lg overflow-hidden border-2  border-primary bg-light backdrop-blur-md`}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className={`flex flex-row justify-between w-full text-sm md:text-lg text-left py-4 px-6 hover:bg-primary/20
                     transition-colors font-bold focus:outline-none text-dark`}
                  >
                    {capitalizeFirstLetter(item.question)}?{" "}
                    <FontAwesomeIcon
                      className="text-darkOrange"
                      icon={
                        openIndex === allInformation.length - 1 - index
                          ? faCaretUp
                          : faCaretDown
                      }
                      size="xl"
                    />
                  </button>
                  {openIndex === allInformation.length - 1 - index && (
                    <div
                      className={`px-6 py-4 bg-light/10 border-t text-sm md:text-md border-darkOrange font-normal text-darkOrange hover:bg-primary/20`}
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
  }
};
