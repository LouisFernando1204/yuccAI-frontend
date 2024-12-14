import CIcon from "@coreui/icons-react";
import React from "react";
import { cilLightbulb } from "@coreui/icons";
import { QuestionAnswer } from "../../utils/objectInterface";

interface RecommendationSectionProps {
  loading: boolean;
  recommendation: QuestionAnswer[];
  isDisabled: boolean;
  onRecommendationClick: (question: string) => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  loading,
  recommendation,
  isDisabled,
  onRecommendationClick
}) => {
  const isEmpty = !recommendation || recommendation.length === 0;

  const capitalizeFirstLetter = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className="flex justify-start items-start w-full">
      <div
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="500"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 w-full">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-primary p-2 shadow-lg cursor-pointer"
            >
              <div className="basis-3/10 flex justify-center">
                <CIcon icon={cilLightbulb} className="size-6 md:size-8" />
              </div>
              <div className="basis-7/10">
                <h1 className="text-[10px] md:text-[14px] font-normal">
                  Loading...
                </h1>
              </div>
            </div>
          ))
          : isEmpty
            ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-primary p-2 shadow-lg cursor-pointer"
              >
                <div className="basis-3/10 flex justify-center">
                  <CIcon icon={cilLightbulb} className="size-6 md:size-8" />
                </div>
                <div className="basis-7/10">
                  <h1 className="text-[10px] md:text-[14px] font-normal">
                    Masih belum ada
                  </h1>
                </div>
              </div>
            ))
            : recommendation.slice(-4).reverse().map((item, index) => (
              <button
                disabled={isDisabled}
                key={index}
                onClick={() => onRecommendationClick(item.question)}
                className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-primary p-2 shadow-lg cursor-pointer"
              >
                <div className="basis-3/10 flex justify-center">
                  <CIcon icon={cilLightbulb} className="size-6 md:size-8" />
                </div>
                <div className="basis-7/10">
                  <h1 className="text-[10px] md:text-[14px] font-normal">
                    {capitalizeFirstLetter(item.question)}?
                  </h1>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
};