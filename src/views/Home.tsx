import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { ElevenLabsClient } from "elevenlabs";
import Swal from "sweetalert2";
import zapsplat_multimedia_button_click_bright_003_92100 from "../assets/sound/zapsplat_multimedia_button_click_bright_003_92100.mp3";
import failedToFindAnswer from "../assets/sound/failedToFindAnswer.mp3";
import searchingAnswer from "../assets/sound/searchingAnswer.mp3";
import successFindAnswer from "../assets/sound/successFindAnswer.mp3";
import "animate.css";
import { GreetingSection } from "../components/sections/GreetingSection";
import { MicrophoneSection } from "../components/sections/MicrophoneSection";
import { RecommendationSection } from "../components/sections/RecommendationSection";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { QuestionAnswer } from "../utils/objectInterface";
import angkaTerbilang from "@develoka/angka-terbilang-js";
import YuccaModel from "../components/object/YuccaModel";

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
  const [micOnClick, setMicOnClick] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [isWait, setIsWait] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const audio = new Audio(zapsplat_multimedia_button_click_bright_003_92100);
  const searchingAnswerAudio = new Audio(searchingAnswer);
  const successfullyFindAnswerAudio = new Audio(successFindAnswer);
  const failedToFindAnswerAudio = new Audio(failedToFindAnswer);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [animation, setAnimation] = useState<string>("");

  const switchAnimation = (animation: string) => {
    setAnimation(animation);
  };

  const speakRandomThinkingMessage = () => {
    const messages = [
      "Tunggu ya, YuccAI lagi mikir keras buat kasih jawaban yang pas buat kamu.",
      "Sabar sebentar, YuccAI lagi nyari solusi terbaik nih!",
      "Sebentar ya, YuccAI lagi sibuk nyusun jawaban kece buat kamu.",
      "Mohon tunggu sebentar, YuccAI lagi ngecek info yang paling cocok buat kamu.",
      "Tenang aja, YuccAI lagi brainstorming biar jawabannya keren dan pas.",
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
      console.log("MASUK START RECORDING");
      startRecording();
    } else {
      console.log("MASUK STOP RECORDING");
      stopRecording();
      if (question) {
        if (isValidQuestion(question)) {
          setIsDisabled(true);
          speakRandomThinkingMessage();

          // ============================== //
          // play searching answer audio
          searchingAnswerAudio.loop = true;
          searchingAnswerAudio.play();
          // ============================== //

          try {
            const yuccAIResponse = await askToYuccAI(question);

            if (yuccAIResponse) {
              // ============================== //
              // stop searching answer audio
              searchingAnswerAudio.pause();
              searchingAnswerAudio.currentTime = 0;
              // ============================== //

              // ============================== //
              // if jawaban contains "maaf" --> play failed to find answer audio then speak
              // else --> play success find answer and then speak
              (yuccAIResponse.response.toLowerCase().includes("maaf")
                ? failedToFindAnswerAudio
                : successfullyFindAnswerAudio
              ).play();
              // ============================== //

              await speak(yuccAIResponse.response);
              await showPopUpResponse(
                yuccAIResponse.response,
                yuccAIResponse.source
              );
              const surveyAnswer = sessionStorage.getItem("surveyAnswer");
              if (surveyAnswer) {
                await fetchRecommendation(surveyAnswer);
              }
            }
          } catch (error) {
            // ============================== //
            // stop searching answer audio
            searchingAnswerAudio.pause();
            searchingAnswerAudio.currentTime = 0;
            // ============================== //
            console.error(error);
            await speak("Terjadi kesalahan. Silakan coba lagi.");
          } finally {
            setIsDisabled(false);
            setQuestion("");
          }
        } else {
          // ============================== //
          // play failed to find answer audio then speak
          // ============================== //
          failedToFindAnswerAudio.play();
          await speak("Maaf, saya tidak mengerti. Silakan coba lagi.");
        }
      }
    }
  };

  const isValidQuestion = (question: string): boolean => {
    const validKeywords = [
      "siapa",
      "apa",
      "bagaimana",
      "kenapa",
      "kapan",
      "di mana",
      "berapa",
      "mengapa",
      "siapa yang",
      "apa yang",
      "bagaimana cara",
      "bagaimana jika",
      "apakah",
      "rekomendasi",
      "saran",
      "bisa kasih ide",
      "bisa bantu",
      "apa solusi",
      "butuh bantuan",
      "pendapat",
      "apa yang kamu pikirkan",
      "menurutmu",
      "bagaimana menurutmu",
      "apakah kamu setuju",
      "apakah itu baik",
      "jelaskan",
      "beri tahu",
      "tunjukkan",
      "beri penjelasan",
      "bantu saya",
      "beri contoh",
      "bantu cari",
      "ceritakan",
      "topik",
      "tentang",
      "sejarah",
      "fakta",
      "teknologi",
      "ilmu pengetahuan",
      "cuaca",
      "politik",
      "ekonomi",
      "hiburan",
      "seberapa lama",
      "apakah ada",
      "jika",
      "sebelum",
      "sesudah",
      "selama",
      "lokasi",
      "tempat terbaik",
      "sebutkan",
      "berikan",
    ];
    return validKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );
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

  const stopRecording = () => {
    console.log("Stopped recording.");
  };

  const romanToDecimal = (roman: string): number => {
    const romanMap: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
    let total = 0;
    let prevValue = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
      const currentValue = romanMap[roman[i]];
      if (!currentValue) return NaN;
      if (currentValue < prevValue) {
        total -= currentValue;
      } else {
        total += currentValue;
      }
      prevValue = currentValue;
    }
    return total;
  };

  const speak = async (text: string) => {
    try {
      let processedText = text
        .replace(/\+/g, " tambah ")
        .replace(/-/g, " kurang ")
        .replace(/\*/g, " kali ")
        .replace(/×/g, " kali ")
        .replace(/\//g, " bagi ")
        .replace(/÷/g, " bagi ")
        .replace(/%/g, " persen ")
        .replace(/=/g, " sama dengan ");
      processedText = processedText.replace(
        /Rp\.?\s?(\d[\d.,]*)/g,
        (match, amount) => {
          const cleanAmount = amount.replace(/[.,]/g, "");
          const angkaKata = angkaTerbilang(parseInt(cleanAmount, 10));
          return `rupiah ${angkaKata}`;
        }
      );
      processedText = processedText.replace(/\b[MCDXLIV]+\b/gi, (match) => {
        const decimal = romanToDecimal(match.toUpperCase());
        if (isNaN(decimal)) return match;
        const angkaKata = angkaTerbilang(decimal);
        return angkaKata;
      });
      const formattedText = processedText.replace(/\d+/g, (match) => {
        const number = parseInt(match, 10);
        const angkaKata = angkaTerbilang(number);
        return angkaKata;
      });
      console.log("Formatted Text: ", formattedText);
      const audioStream = await elevenlabs.generate({
        voice: "Kira",
        model_id: "eleven_turbo_v2_5",
        text: formattedText,
      });
      const chunks: Uint8Array[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioData = new Blob(chunks, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioData);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();

        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
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
          await showPopUpResponse(
            yuccAIResponse.response,
            yuccAIResponse.source
          );
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

  const addNewInformation = async (
    question: string,
    answer: string,
    answerSource: string
  ) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_GOLANG_API_URL}/api/add_information`,
        {
          question: question,
          answer: answer,
          answersource: answerSource,
        }
      );
      console.log("History Added: ", result);
    } catch (error) {
      console.log(error);
    }
  };

  const showPopUpResponse = async (
    yuccAIResponse: string,
    yuccAISource: string
  ) => {
    try {
      const result = await Swal.fire({
        title: "",
        html: `
              <div style="text-align: center;" id="swal-text-container">
                  <!-- TextGenerateEffect -->
              </div>
            `,
        confirmButtonText: "Selesai",
        showCancelButton: true,
        cancelButtonText: "Berhenti",
        customClass: {
          popup: "swal-modal",
          confirmButton: "swal-confirm-button swal-wide-button",
          cancelButton: "swal-cancel-button swal-wide-button",
          actions: "swal-two-buttons",
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
        willOpen: () => {
          createRoot(document.getElementById("swal-text-container")!).render(
            <TextGenerateEffect
              className="font-semibold italic text-base sm:text-lg text-gray-900"
              words={yuccAIResponse}
            />
          );
        },
      });
      if (result.isDismissed) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        await addNewInformation(question, yuccAIResponse, yuccAISource);
      }
    } catch (error) {
      console.log(error);
    }
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
          actions: "swal-two-buttons",
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

  const greeting = async () => {
    const text =
      "Jalan jalan ke luar kota. Jangan lupa membawa jamu. Perkenalkan namaku Yucca. Siap menjadi asistenmu!";

    try {
      const audioStream = await elevenlabs.generate({
        voice: "Kira",
        model_id: "eleven_turbo_v2_5",
        text: text,
      });
      const chunks: Uint8Array[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioData = new Blob(chunks, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioData);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = 0.9;
        audioRef.current.play();

        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const waiting = async () => {};

  const handleChatMessage = (question: string, subtitleText: string) => {
    // HAPUS INI NANTI LOUIS
    // sayUniqueFact();

    // YANG DBAWAH INI JGN
    setIsChatOpen(!isChatOpen);
    if (isChatOpen) {
      openChat(question, subtitleText);
    } else {
      closeChat();
    }
  };

  const openChat = async (question: string, subtitleText: string) => {
    try {
      // const modifiedSubtitleText = subtitleText
      //   .replace(/(^|\n)- (.*)/gm, "$1<strong>$2</strong>") // Ganti "-" menjadi bullet point dan semibold
      //   .replace(
      //     /(https?:\/\/[^\s]+)/gm,
      //     '<img src="$1" style="max-width: 100%; height: auto; margin-top: 1rem;">'
      //   );
      const modifiedSubtitleText = subtitleText
        .replace(/(^|\n)- (.*)/gm, "$1<strong>$2</strong>") // Ganti "-" menjadi bullet point dan semibold
        .replace(
          /(https?:\/\/[^\s]+)/gm,
          '<img src="$1" style="width: 100%; height: auto; margin-top: 1rem;">'
        );

      const result = await Swal.fire({
        title: "",
        html: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="text-align: center; font-weight: bold; font-size: 1.2rem;">
            ${question}
          </div>
          <div style="text-align: left; font-weight: normal; font-size: 1rem; color: #333; white-space: pre-line;"
            class="animate__animated animate__fadeIn" id="swal-live-subtitle-container">
            ${modifiedSubtitleText}
          </div>
        </div>
        `,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "Tutup",
        customClass: {
          popup: "swal-modal",
          confirmButton: "swal-confirm-button swal-wide-button",
          cancelButton: "swal-cancel-button swal-wide-button",
          actions: "swal-two-buttons",
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
        // await clickAction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeChat = () => {};

  useEffect(() => {
    if (!statusModal) {
      // setAnimation("../assets/video/findAnswerVideo.mp4")
      // greeting();
    }
  }, [statusModal]);

  useEffect(() => {
    setAnimation("findAnswerVideo");
  }, []);

  return (
    <>
      {/* <img
        src="https://drive.google.com/thumbnail?id=1NbzMEhEQOVM2K370_-SmYHFOBpJRu2sk&sz=1000.jpg"
        alt="asdasd"
      /> */}

      <div className="flex flex-col items-center mt-10 space-y-10">
        {/* <GreetingSection key={statusModal ? "open" : "closed"} /> */}
        <div className="flex justify-center w-1/5 m-0">
          <YuccaModel animation={animation} />
        </div>
        <MicrophoneSection
          clickAction={clickAction}
          isDisabled={isDisabled}
          micOnClick={micOnClick}
        />
        <RecommendationSection
          loading={loading}
          isDisabled={isDisabled}
          recommendation={recommendation}
          onRecommendationClick={onRecommendationClick}
        />
        {showChat && (
          <div className="fixed bottom-1 right-1">
            <button
              onClick={() =>
                handleChatMessage(
                  "Apa saja makanan yang ada di sekitar Universitas Ciputra Surabaya?",
                  `Tentu, berikut adalah fakultas yang ada di UC:\n\n1. School of Business Management\nhttps://imgs.search.brave.com/ZW16koXAvfxrot-NprvOxwBmgDH36uakg8JFpZ-y1e8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kaWVu/Zy5ibG9iLmNvcmUu/d2luZG93cy5uZXQv/d2VibWFzdGVyLzIw/MjEvMDYvTG9nby1V/Qy1BcHBsZS1BY2Fk/ZW15LVVDLmpwZw\n2. School of Creative Industry\nhttps://iili.io/2rLrNRa.jpg\n3. School of Tourism\n4. School of Information Technology\n5. School of Medicine\n6. School of Dental Medicine\n7. School of Psychology\n8. School of Communication and Media Business  `
                )
              }
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
