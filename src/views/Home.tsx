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
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null);
  const [userSpeech, setUserSpeech] = useState(null);

  const clickAction = () => {
    setMicOnClick(!micOnClick);
    micOnClick == true ? startRecording() : stopRecording()
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
    setIsRecording(true);

  }

  const stopRecording = () => {

  }

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
