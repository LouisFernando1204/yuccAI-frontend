import { GreetingSection } from "../components/sections/GreetingSection";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { YuccaObject } from "../components/object/YuccaObject";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import React, { useEffect, useState } from "react";
import zapsplat_multimedia_button_click_bright_003_92100 from "../assets/sound/zapsplat_multimedia_button_click_bright_003_92100.mp3";
import { QuestionAndAnswer } from "../utils/objectInterface";
import axios from "axios";
import { ElevenLabsClient } from "elevenlabs";
import TextToSpeech from "../components/TextToSpeech";
import * as dotenv from "dotenv";
import textToSpeech from '@google-cloud/text-to-speech';

interface HomeProps {
  statusModal: boolean;
  loading: boolean;
  recommendation: QuestionAndAnswer[]
}

export const Home: React.FC<HomeProps> = ({ statusModal, loading, recommendation }) => {
  const [text, setText] = useState<string>('Fuck You');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [micOnClick, setMicOnClick] = useState(false);
  const [listening, setListening] = useState<boolean>(false);
  const audio = new Audio(zapsplat_multimedia_button_click_bright_003_92100);

  const clickAction = () => {
    setMicOnClick(!micOnClick);
    audio.play();
    micOnClick ? stopRecording() : startRecording();
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = true; 

    recognition.onstart = () => {
      setListening(true);
      console.log("Speech recognition started.");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(currentTranscript);
      console.log("Recognized Text:", currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setListening(false);
      console.log("Speech recognition stopped.");
    };

    recognition.start();
  };

  const stopRecording = async () => {
    speak("Louis sangat gay");
  };

  const speak = async (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"
    utterance.pitch = 1.8;
    utterance.rate = 1.2;
    const voices = speechSynthesis.getVoices();
    console.log(voices);
    utterance.voice = voices.find((v) => v.lang === "id-ID" && v.name.includes("Google")) || voices[5];
    speechSynthesis.speak(utterance);

  }



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
        <RecommendationSection loading={loading} questionAndAnswer={recommendation} onRecomendationonClick = {(question) => {const response = 'answer of ${question}'; speak(response)}}/>
        <MicrophoneSection clickAction={clickAction} micOnClick={micOnClick} />
      </div>
      <div>
      </div>
    </>
  );
};
