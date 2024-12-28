import React, { useEffect, useState, useRef } from "react";
import { createRoot } from 'react-dom/client'
import axios from "axios";
import { ElevenLabsClient } from "elevenlabs";
import Swal from 'sweetalert2'
import zapsplat_multimedia_button_click_bright_003_92100 from "../assets/sound/zapsplat_multimedia_button_click_bright_003_92100.mp3";
import 'animate.css';
import { GreetingSection } from "../components/sections/GreetingSection";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import { YuccaObject } from "../components/object/YuccaObject";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { QuestionAnswer } from "../utils/objectInterface";

interface HomeProps {
  statusModal: boolean;
  loading: boolean;
  recommendation: QuestionAnswer[];
  fetchRecommendation: (answerSource: string) => void;
}

export const Home: React.FC<HomeProps> = ({ statusModal, loading, recommendation, fetchRecommendation }) => {
  const [question, setQuestion] = useState<string>("");
  const [micOnClick, setMicOnClick] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const audio = new Audio(zapsplat_multimedia_button_click_bright_003_92100);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakRandomThinkingMessage = () => {
    const messages = [
      "Tunggu ya, YuccAI lagi mikir keras buat kasih jawaban yang pas buat kamu.",
      "Sabar sebentar, YuccAI lagi nyari solusi terbaik nih!",
      "Sebentar ya, YuccAI lagi sibuk nyusun jawaban kece buat kamu.",
      "Mohon tunggu sebentar, YuccAI lagi ngecek info yang paling cocok buat kamu.",
      "Tenang aja, YuccAI lagi brainstorming biar jawabannya keren dan pas."
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMessage);
  };
  const elevenlabs = new ElevenLabsClient({
    apiKey: `${import.meta.env.VITE_ELEVENLABS_API_KEY}`,
  });

  const clickAction = async () => {
    setMicOnClick(!micOnClick);
    audio.play();
    if (!micOnClick) {
      startRecording();
    } else {
      stopRecording();
      if (question) {
        if (isValidQuestion(question)) {
          setIsDisabled(true);
          speakRandomThinkingMessage();
          try {
            const yuccAIResponse = await askToYuccAI(question);
            await speak(yuccAIResponse.response);
            await showPopUpResponse(yuccAIResponse.response);
            await addNewInformation(question, yuccAIResponse.response, yuccAIResponse.source);
            const surveyAnswer = sessionStorage.getItem("surveyAnswer");
            if (surveyAnswer) {
              fetchRecommendation(surveyAnswer);
            }
          } catch (error) {
            console.error(error);
            await speak("Terjadi kesalahan. Silakan coba lagi.");
          } finally {
            setIsDisabled(false);
            setQuestion("");
          }
        } else {
          await speak("Maaf, saya tidak mengerti. Silakan coba lagi.");
        }
      }
    }
  };

  const isValidQuestion = (question: string): boolean => {
    const validKeywords = [
      "siapa", "apa", "bagaimana", "kenapa", "kapan", "di mana", "berapa",
      "mengapa", "siapa yang", "apa yang", "bagaimana cara", "bagaimana jika",
      "apakah", "rekomendasi", "saran", "bisa kasih ide", "bisa bantu",
      "apa solusi", "butuh bantuan", "pendapat", "apa yang kamu pikirkan",
      "menurutmu", "bagaimana menurutmu", "apakah kamu setuju",
      "apakah itu baik", "jelaskan", "beri tahu", "tunjukkan", "beri penjelasan",
      "bantu saya", "beri contoh", "bantu cari", "ceritakan", "topik", "tentang",
      "sejarah", "fakta", "teknologi", "ilmu pengetahuan", "cuaca", "politik",
      "ekonomi", "hiburan", "seberapa lama", "apakah ada", "jika", "sebelum",
      "sesudah", "selama", "lokasi", "tempat terbaik"
    ];
    return validKeywords.some((keyword) => question.toLowerCase().includes(keyword));
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
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setQuestion(currentTranscript);
      console.log("Recognized Text:", currentTranscript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      console.log("Speech recognition stopped.");
    };
    recognition.start();
  };

  const stopRecording = () => {
    console.log("Stopped recording.");
  };

  const speak = async (text: string) => {
    try {
      const audioStream = await elevenlabs.generate({
        voice: "Kira",
        model_id: "eleven_turbo_v2_5",
        text,
      });
      const chunks: Uint8Array[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioData = new Blob(chunks, { type: "audio/mpeg" });
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(audioData);
        audioRef.current.play();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askToYuccAI = async (question: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PYTHON_API_URL}/query`,
        { query_text: question }
      );
      console.log("YuccAI Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return "Failed to get Answer from YuccAI.";
    }
  };

  const onRecommendationClick = async (question: string) => {
    if (question) {
      if (isValidQuestion(question)) {
        setIsDisabled(true);
        speakRandomThinkingMessage();
        try {
          const yuccAIResponse = await askToYuccAI(question);
          await speak(yuccAIResponse.response);
          await showPopUpResponse(yuccAIResponse.response);
        } catch (error) {
          console.error(error);
          await speak("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
          setIsDisabled(false);
        }
      } else {
        await speak("Maaf, saya tidak mengerti. Silakan coba lagi.");
      }
    }
  };

  const addNewInformation = async (question: string, answer: string, answerSource: string) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_GOLANG_API_URL}/api/add_information`,
        {
          question: question,
          answer: answer,
          answer_source: answerSource,
        }
      );
      console.log("History Added: ", result);
    } catch (error) {
      console.log(error);
    }
  };

  const showPopUpResponse = async (yuccAIResponse: string) => {
    try {
      const result = await Swal.fire({
        title: '',
        html: `
              <div style="text-align: center;" id="swal-text-container">
                  <!-- TextGenerateEffect -->
              </div>
            `,
        confirmButtonText: 'Selesai',
        showCancelButton: true,
        cancelButtonText: 'Berhenti',
        customClass: {
          popup: 'swal-modal',
          confirmButton: 'swal-confirm-button swal-wide-button',
          cancelButton: 'swal-cancel-button swal-wide-button',
          actions: 'swal-two-buttons'
        },
        buttonsStyling: false,
        position: "bottom",
        showClass: {
          popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
        },
        hideClass: {
          popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
        },
        willOpen: () => {
          createRoot(document.getElementById('swal-text-container')!).render(
            <TextGenerateEffect
              className="font-semibold italic text-base sm:text-lg text-gray-900" words={yuccAIResponse} />,
          );
        }
      });

      if (result.isDismissed) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } else {
        console.log("Conversation is done.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { }, [statusModal]);

  return (
    <>
      <div className="flex flex-col items-center mt-10 space-y-10">
        <GreetingSection key={statusModal ? "open" : "closed"} />
        <YuccaObject />
        <RecommendationSection
          loading={loading}
          isDisabled={isDisabled}
          recommendation={recommendation}
          onRecommendationClick={onRecommendationClick}
        />
        <MicrophoneSection
          clickAction={clickAction}
          isDisabled={isDisabled}
          micOnClick={micOnClick}
        />
        <audio ref={audioRef} controls className="hidden" />
      </div>
    </>
  );
};