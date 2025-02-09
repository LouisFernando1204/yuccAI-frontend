import React from "react";
import { informationOptions } from "../../utils/list";

interface SurveyModalProps {
  chooseAnswer: (answer: string) => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({ chooseAnswer }) => {
  return (
    <div
      className={`fixed flex items-center justify-center w-screen h-screen inset-0 bg-dark bg-opacity-50 z-50`}
    >
      {" "}
      <div
        data-aos="zoom-in-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="500"
        className="bg-light rounded-xl shadow-xl w-11/12 md:w-2/5 max-h-[90%] py-6 md:py-8 px-4 md:px-6 overflow-y-auto no-scrollbar relative">
        <h1 className="font-semibold text-center text-md md:text-xl mb-6">
          Haii mantemann! Yucca kepo nihh, informasi apa sih yang sedang kamu
          cari ? 🤔
        </h1>
        <div className="flex flex-col space-y-4">
          {informationOptions.map((info, index) => (
            <div
              key={index}
              onClick={() => chooseAnswer(info.key)}
              className="outline outline-darkOrange cursor-pointer hover:scale-105 hover:bg-darkOrange hover:text-white duration-200 rounded-xl p-4 md:p-5"
            >
              <h1 className="text-sm md:text-md font-normal"> {info.words}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
