import React from "react";
import DarkModeToggle from "react-dark-mode-toggle";

interface NavbarProps {
  navigateToHistory: () => void;
  navigateToHome: () => void;
  isNavigateToHistory?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  navigateToHistory,
  navigateToHome,
  isNavigateToHistory,
}) => {
  return (
    // <div className="relative top-0 left-0 w-full z-50 pb-5">
    //   <div
    //     style={{ transform: "scaleX(1.1) scaleY(0.8)" }}
    //     className="h-44 flex justify-center items-center bg-lightNavy rounded-b-full"
    //   >
    //     <div className="py-4 md:py-5">
    //       <h1
    //         // onClick={() => navigateToHome()}
    //         className="text-center cursor-pointer font-bold text-4xl md:text-2xl text-lightOrange"
    //       >
    //         YUCCA{" "}
    //       </h1>
    //     </div>
    //   </div>
    // </div>
    <section>
      <div className="curved-header">
        YUCCA
      </div>
    </section>
    // <div className="mx-4 md:mx-10 h-auto">
    //   <div className="flex justify-between py-4 md:py-5 items-center ">
    //     <div className="flex items-center">
    //       <h1
    //         onClick={() => navigateToHome()}
    //         className="cursor-pointer font-bold text-xl md:text-2xl text-primary"
    //       >
    //         yuccAI.
    //       </h1>
    //     </div>
    //     <div className="flex flex-row items-center justify-center space-x-4">
    //       <h1
    //         onClick={() => navigateToHistory()}
    //         className={`text:md md:text-lg font-semibold hover:text-primary cursor-pointer ${
    //           isNavigateToHistory && "text-primary"
    //         }`}
    //       >
    //         History
    //       </h1>
    //     </div>
    //   </div>
    //   <div className="border-b-2 -mx-10 mt-2 md:mt-0" />
    // </div>
  );
};
