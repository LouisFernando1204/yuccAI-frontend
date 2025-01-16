import React from "react";

interface NavbarProps {
  isNavigateToHistory?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isNavigateToHistory,
}) => {
  return (
    <div className="absolute -top-20 left-0 w-full z-20 pb-5">
      <div
        style={{ transform: "scaleX(1.1) scaleY(0.8)" }}
        className="h-44 flex justify-center items-center bg-lightNavy rounded-b-full"
      >
        <div>
          <h1
            className="text-center font-dynaPuff cursor-pointer text-6xl font-bold md:text-4xl text-lightOrange"
          > {isNavigateToHistory ? 'HISTORY' : 'YUCCA'}
          </h1>
        </div>
      </div>
    </div>
  );
};
