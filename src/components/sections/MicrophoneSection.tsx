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
        className={`rounded-full bg-primary cursor-pointer shadow-lg ${micOnClick ? 'animate-bounce' : 'hover:scale-105 duration-200'}`}>
        {micOnClick ? (
          <CIcon icon={cilMediaStop} className="size-16 md:size-20 p-3" />
        ) : (
          <CIcon icon={cilMicrophone} className="size-16 md:size-20 p-3" />
        )}
      </button>
    </div>
  );
};
