import { GreetingSection } from "../components/sections/GreetingSection";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { YuccaObject } from "../components/object/YuccaObject";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import React, { useEffect, useState } from "react";
import zapsplat_multimedia_button_click_bright_003_92100 from "../assets/sound/zapsplat_multimedia_button_click_bright_003_92100.mp3";
import { QuestionAndAnswer } from "../utils/objectInterface";
import axios from "axios";

interface HomeProps {
  statusModal: boolean;
  loading: boolean;
  recommendation: QuestionAndAnswer[]
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
  }, [statusModal]);

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL)
    // try to fetch all information
    const fetchAllInformation = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/get_all_information`)
        console.log(result)
      }
      catch (error) {
        console.log(error)
      }
    }

    // try to add new information
    const addNewInformation = async () => {
      try {
        const result = await axios.post(`${import.meta.env.VITE_API_URL}/add_information`, {
          question: "siapa itu steve go",
          answer: "dia adalah..."
        })
        console.log(result)
      }
      catch (error) {
        console.log(error)
      }
    }

    fetchAllInformation()
    addNewInformation()
  }, []);

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
