import { CIcon } from "@coreui/icons-react";
import { cilMediaStop, cilMicrophone } from "@coreui/icons";
import React, { useState } from "react";



interface MicrophoneSectionProps {
  clickAction: () => void;
  micOnClick: boolean;

}

export const MicrophoneSection: React.FC<MicrophoneSectionProps>  = ({
  clickAction,
  micOnClick,
}) => {
  return (
    <div>
      <div
        onClick={() => clickAction()}
        className={`rounded-full bg-primary cursor-pointer shadow-lg ${micOnClick ? 'animate-bounce' : 'hover:scale-105 duration-200'}`}>
        {micOnClick ? (
          <CIcon icon={cilMediaStop} className="size-16 md:size-20 p-3" />
        ) : (
          <CIcon icon={cilMicrophone} className="size-16 md:size-20 p-3" />
        )}
      </div>
    </div>
  );
};
