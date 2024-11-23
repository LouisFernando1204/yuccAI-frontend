import React from "react";

interface FooterProps {
  navigateToHistory: () => void;
  navigateToHome: () => void;
  isNavigateToHistory: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  navigateToHistory,
  navigateToHome,
  isNavigateToHistory,
}) => {
  return (
    <div className="w-full py-4 md:py-10">
      <div className="border-t-2 -mx-10" />
      <div className="py-8 md:py-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-10 font-semibold text-md md:text-lg">
        <h1>
          @{" "}
          <span
            onClick={() => navigateToHome()}
            className="font-bold cursor-pointer text-primary"
          >
            yuccAI.
          </span>{" "}
          2024, All Rights reserved.
        </h1>
        <h1
          onClick={() => navigateToHome()}
          className={`${
            !isNavigateToHistory && "text-primary"
          } text-center cursor-pointer hover:text-primary`}
        >
          Home
        </h1>
        <h1
          onClick={() => navigateToHistory()}
          className={`${
            isNavigateToHistory && "text-primary"
          } cursor-pointer hover:text-primary`}
        >
          History
        </h1>
      </div>
    </div>
  );
};
