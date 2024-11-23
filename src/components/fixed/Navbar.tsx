import React from "react";
import DarkModeToggle from "react-dark-mode-toggle";

interface NavbarProps {
  switchMode: () => void;
  isDarkMode: boolean;
  navigateToHistory: () => void;
  navigateToHome: () => void;
  isNavigateToHistory: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  switchMode,
  isDarkMode,
  navigateToHistory,
  navigateToHome,
  isNavigateToHistory,
}) => {
  return (
    <div className="mx-4 md:mx-10 h-auto">
      <div className="flex justify-between py-4 md:py-5 items-center ">
        <div className="flex items-center">
          <h1
            onClick={() => navigateToHome()}
            className="cursor-pointer font-bold text-xl md:text-2xl text-primary"
          >
            yuccAI.
          </h1>
        </div>
        <div className="flex flex-row items-center justify-center space-x-4">
          <h1
            onClick={() => navigateToHistory()}
            className={`text:md md:text-lg font-semibold hover:text-primary cursor-pointer ${
              isNavigateToHistory && "text-primary"
            }`}
          >
            History
          </h1>
          <DarkModeToggle
            onChange={switchMode}
            checked={isDarkMode}
            className="size-52 md:size-80"
          />
        </div>
      </div>
      <div className="border-b-2 -mx-10 mt-2 md:mt-0" />
    </div>
  );
};
