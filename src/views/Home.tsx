import { GreetingSection } from "../components/sections/GreetingSection";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { YuccaObject } from "../components/object/YuccaObject";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import React, { useState } from "react";

interface HomeProps {
  statusModal: boolean;
}

export const Home: React.FC<HomeProps> = ({ statusModal }) => {
  const [micOnClick, setMicOnClick] = useState(false);

  const clickAction = () => {
    setMicOnClick(!micOnClick);
  };

  return (
    <>
      <div className="flex flex-col items-center mt-10 space-y-10">
        <GreetingSection />
        <YuccaObject />
        {statusModal == false && <RecommendationSection />}
        <MicrophoneSection clickAction={clickAction} micOnClick={micOnClick} />
      </div>
    </>
  );
}
