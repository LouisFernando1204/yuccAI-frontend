import { GreetingSection } from "../components/sections/GreetingSection";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { YuccaObject } from "../components/object/YuccaObject";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import React, { useEffect, useState } from "react";
import zapsplat_multimedia_button_click_bright_003_92100 from "../assets/sound/zapsplat_multimedia_button_click_bright_003_92100.mp3";
import { QuestionAndAnswer } from "../utils/objectInterface";

interface HomeProps {
  statusModal: boolean;
  loading: boolean;
  recommendation: QuestionAndAnswer[];
}

export const Home: React.FC<HomeProps> = ({ statusModal, loading, recommendation }) => {
  const [micOnClick, setMicOnClick] = useState(false);
  const audio = new Audio(zapsplat_multimedia_button_click_bright_003_92100);

  const clickAction = () => {
    setMicOnClick(!micOnClick);
    audio.play();
    micOnClick ? startRecording() : stopRecording();
  };

  const startRecording = async () => {
    // logic start recording here
  };

  const stopRecording = () => {
    // logic stop recording here
  };

  useEffect(() => {
    console.log("Status modal:", statusModal);
  }, [statusModal]);

  return (
    <>
      <div className="flex flex-col items-center mt-10 space-y-10">
        <GreetingSection key={statusModal ? "open" : "closed"} />
        <YuccaObject />
        <RecommendationSection loading={loading} questionAndAnswer={recommendation} />
        <MicrophoneSection clickAction={clickAction} micOnClick={micOnClick} />
      </div>
    </>
  );
};
