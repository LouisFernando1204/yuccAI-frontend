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
  onRecommendationClick,
}) => {
  const isEmpty = !recommendation || recommendation.length === 0;

  const capitalizeFirstLetter = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

  console.log(isDisabled)

  return (
    <div className="flex justify-start items-start w-full px-3">
      <div
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="500"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 w-full"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-cream p-2 shadow-lg cursor-pointer"
              >
                <div className="basis-3/10 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 md:size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
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
                className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-cream p-2 shadow-lg cursor-pointer"
              >
                <div className="basis-3/10 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 md:size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>{" "}
                </div>
                <div className="basis-7/10">
                  <h1 className="text-[10px] md:text-[14px] font-normal">
                    Masih belum ada
                  </h1>
                </div>
              </div>
            ))
          : recommendation
              .slice(-4)
              .reverse()
              .map((item, index) => (
                <button
                  disabled={isDisabled}
                  key={index}
                  onClick={() => onRecommendationClick(item.question)}
                  className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-cream p-2 shadow-lg cursor-pointer"
                >
                  <div className="basis-3/10 flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 md:size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                      />
                    </svg>{" "}
                  </div>
                  <div className="basis-7/10">
                    <h1 className="text-[10px] md:text-[14px] text-start font-normal">
                      {capitalizeFirstLetter(item.question)}?
                    </h1>
                  </div>
                </button>
              ))}
      </div>
    </div>
  );
};
