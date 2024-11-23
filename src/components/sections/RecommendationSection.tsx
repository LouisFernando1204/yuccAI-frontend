import { cilLightbulb } from "@coreui/icons";
import { dummyQuestionAndAnswer } from "../../utils/list";
import CIcon from "@coreui/icons-react";

export const RecommendationSection = () => {
  return (
    <div className="flex justify-start items-start w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 w-full">
        {dummyQuestionAndAnswer.map((qna, index) => (
          <div
            key={index}
            className="hover:scale-105 duration-200 flex flex-row items-center space-x-2 rounded-xl bg-primary p-2 shadow-lg cursor-pointer"
          >
            <div className="basis-3/10 flex justify-center">
              <CIcon icon={cilLightbulb} className="size-6 md:size-8" />
            </div>
            <div className="basis-7/10">
              <h1 className="text-[10px] md:text-[14px] font-normal">{qna.question}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
