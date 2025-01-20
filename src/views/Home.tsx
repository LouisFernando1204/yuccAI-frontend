import React, { useEffect, useState, useRef } from "react";
import zapsplat_multimedia_button_click_bright_003_92100 from "../assets/sound/zapsplat_multimedia_button_click_bright_003_92100.mp3";
import failedToFindAnswer from "../assets/sound/failedToFindAnswer.mp3";
import searchingAnswer from "../assets/sound/searchingAnswer.mp3";
import successFindAnswer from "../assets/sound/successFindAnswer.mp3";
import "animate.css";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import { QuestionAnswer } from "../utils/objectInterface";
import YuccaModel from "../components/object/YuccaModel";
import { TextSection } from "../components/sections/TextSection";
import { speakWithoutChanger } from "../utils/helper";
import { getResponse } from "../utils/popup";
import {
  askByText,
  onRecommendationClick,
  processQuestion,
} from "../utils/handler";
import Swal from "sweetalert2";

interface HomeProps {
  statusModal: boolean;
  loading: boolean;
  recommendation: QuestionAnswer[];
  fetchRecommendation: (answerSource: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  statusModal,
  loading,
  recommendation,
  fetchRecommendation,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const [micOnClick, setMicOnClick] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);

  const audio = new Audio(zapsplat_multimedia_button_click_bright_003_92100);
  const searchingAnswerAudio = new Audio(searchingAnswer);
  const successfullyFindAnswerAudio = new Audio(successFindAnswer);
  const failedToFindAnswerAudio = new Audio(failedToFindAnswer);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [animation, setAnimation] = useState<string>("goodAnswerVideo");

  const clickAction = async () => {
    setMicOnClick(!micOnClick);
    audio.play();
    if (!micOnClick) {
      console.log("MASUK START RECORDING");
      startRecording();
    } else {
      console.log("MASUK STOP RECORDING");
      stopRecording();
      await handleAskByVoice();
    }
  };

  const stopRecording = () => {
    console.log("Recording stopped.");
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
      console.log("Speech recognition started.");
      showLiveSubtitlePopup("yuccAI sedang mendengarkan...");
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setQuestion(currentTranscript);
      console.log("Recognized Text:", currentTranscript);
      const subtitleContainer = document.getElementById(
        "swal-live-subtitle-container"
      );
      if (subtitleContainer) {
        subtitleContainer.innerText = currentTranscript;
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      console.log("Speech recognition stopped.");
      Swal.close();
    };
    recognition.start();
  };

  const showLiveSubtitlePopup = async (subtitleText: string) => {
    try {
      const result = await Swal.fire({
        title: "",
        html: `
          <div style="text-align: center; font-weight: bold; font-style: italic; font-size: 1rem; color: #333;" 
            class="animate__animated animate__fadeIn" id="swal-live-subtitle-container">
            ${subtitleText}
          </div>
        `,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "Tanya Ulang",
        customClass: {
          popup: "swal-modal",
          confirmButton: "swal-confirm-button swal-wide-button",
          cancelButton: "swal-cancel-button swal-wide-button",
          actions: "swal-one-buttons",
        },
        buttonsStyling: false,
        position: "bottom",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
      if (result.isConfirmed) {
        await clickAction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openChat = async (question: string, subtitleText: string) => {
    try {
      const modifiedSubtitleText = subtitleText // .replace(/(^|\n)- (.*)/gm, "$1<strong>$2</strong>") // Ganti "-" menjadi bullet point dan semibold
        .replace(/(^|\n)- (.*)/gm, "$1$2")
        .replace(
          /(https:\/\/iili\.io[^\s]+)/gm,
          '<a href="$1" target="_blank"><img src="$1" style="width: 100%; height: auto; margin-top: 1rem;"></a>'
        )
        .replace(
          /(https:\/\/www\.google\.com\/maps[^\s]+)/gm,
          '<iframe src="$1" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
        )
        .replace(
          /(https:\/\/api\.whatsapp\.com[^\s]+)/gm,
          '<a href="$1" target="_blank" style="text-decoration: none;"><button style="padding: 10px 20px; background-color: #f8a557; margin-top: 1rem; color: white; border: none; border-radius: 5px; cursor: pointer;">Chat via WhatsApp</button></a>'
        );
      // .replace(
      //   /(https?:\/\/[^\s]+)/gm,
      //   '<img src="$1" style="width: 100%; height: auto; margin-top: 1rem;">'
      // );

      await getResponse(question, modifiedSubtitleText);
    } catch (error) {
      console.log(error);
    }
  };

  const greeting = async () => {
    const text =
      "Jalan jalan ke luar kota. Jangan lupa membawa jamu. Perkenalkan namaku Yucca. Siap menjadi asistenmu!";

    try {
      await speakWithoutChanger(text, audioRef);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!statusModal) {
      setAnimation("introVideo");
      greeting();
    } else {
      setAnimation("idleVideo");
    }
  }, [statusModal]);

  useEffect(() => {}, [animation]);

  const handleAskByVoice = async () => {
    setShowChat(false);
    await processQuestion(
      question,
      setIsDisabled,
      setQuestion,
      audioRef,
      searchingAnswerAudio,
      failedToFindAnswerAudio,
      successfullyFindAnswerAudio,
      setAnswer,
      setAnimation,
      fetchRecommendation
    );
    setShowChat(true);
  };

  const handleRecommendationClick = async (question: string) => {
    setShowChat(false);
    await onRecommendationClick(
      question,
      setIsDisabled,
      setQuestion,
      audioRef,
      searchingAnswerAudio,
      failedToFindAnswerAudio,
      successfullyFindAnswerAudio,
      setAnswer,
      setAnimation,
      fetchRecommendation
    );
    setShowChat(true);
  };

  const handleAskByText = async (question: string) => {
    setShowChat(false);
    await askByText(
      question,
      setIsDisabled,
      setQuestion,
      audioRef,
      searchingAnswerAudio,
      failedToFindAnswerAudio,
      successfullyFindAnswerAudio,
      setAnswer,
      setAnimation,
      fetchRecommendation
    );
    setShowChat(true);
  };

  return (
    <>
      <div className="flex flex-col items-center mt-10 space-y-6">
        <div className="flex justify-center w-1/5 m-0">
          <YuccaModel animation={animation} />
        </div>
        <MicrophoneSection
          clickAction={clickAction}
          isDisabled={isDisabled}
          micOnClick={micOnClick}
        />
        <TextSection askByText={handleAskByText} isDisabled={isDisabled} />
        <RecommendationSection
          loading={loading}
          isDisabled={isDisabled}
          recommendation={recommendation}
          onRecommendationClick={handleRecommendationClick}
        />

        {showChat && (
          <div className="fixed bottom-1 right-1">
            <button
              onClick={() => openChat(question, answer)}
              className={`rounded-full bg-cream cursor-pointer shadow-lg animate-bounce`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-16 md:size-20 p-3"
              >
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        <audio ref={audioRef} controls className="hidden" />
      </div>
    </>
  );
};
