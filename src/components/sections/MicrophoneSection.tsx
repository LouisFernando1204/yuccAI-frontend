import { CIcon } from "@coreui/icons-react";
import { cilMediaStop, cilMicrophone } from "@coreui/icons";
import React from "react";

interface MicrophoneSectionProps {
  clickAction: () => void;
  micOnClick: boolean;
  isDisabled: boolean;
}

export const MicrophoneSection: React.FC<MicrophoneSectionProps> = ({
  clickAction,
  micOnClick,
  isDisabled,
}) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      data-aos-duration="500"
    >
      <button
        disabled={isDisabled}
        onClick={() => clickAction()}
        className={`rounded-full bg-cream cursor-pointer shadow-lg ${
          micOnClick ? "animate-bounce" : "hover:scale-105 duration-200"
        }`}
      >
        {micOnClick ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-16 md:size-20 p-3 text-darkOrange"
          >
            <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3h-9.5Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-16 md:size-20 p-3 text-darkOrange"
          >
            <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
            <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
          </svg>

          // <CIcon icon={cilMicrophone} className="size-16 md:size-20 p-3 text-darkOrange" />
        )}
      </button>
    </div>
  );
};
