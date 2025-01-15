import { addNewInformation, askToYuccAI } from "../server/information";
import { isValidQuestion, speakRandomThinkingMessage } from "./helper";
import { answerResponse } from "./response";

export const askByText = async (
  question: string,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setQuestion: React.Dispatch<React.SetStateAction<string>>,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  searchingAnswerAudio: HTMLAudioElement,
  failedToFindAnswerAudio: HTMLAudioElement,
  successfullyFindAnswerAudio: HTMLAudioElement,
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setAnimation: React.Dispatch<React.SetStateAction<string>>,
  fetchRecommendation: (answerSource: string) => void
) => {
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
};

export const onRecommendationClick = async (
  question: string,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setQuestion: React.Dispatch<React.SetStateAction<string>>,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  searchingAnswerAudio: HTMLAudioElement,
  failedToFindAnswerAudio: HTMLAudioElement,
  successfullyFindAnswerAudio: HTMLAudioElement,
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setAnimation: React.Dispatch<React.SetStateAction<string>>,
  fetchRecommendation: (answerSource: string) => void
) => {
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
};

export const processQuestion = async (
  question: string,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setQuestion: React.Dispatch<React.SetStateAction<string>>,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  searchingAnswerAudio: HTMLAudioElement,
  failedToFindAnswerAudio: HTMLAudioElement,
  successfullyFindAnswerAudio: HTMLAudioElement,
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setAnimation: React.Dispatch<React.SetStateAction<string>>,
  fetchRecommendation: (answerSource: string) => void
) => {
  if (question) {
    if (isValidQuestion(question)) {
      setIsDisabled(true);

      await speakRandomThinkingMessage(audioRef);
      setAnimation("searchingAnswerVideo");

      await new Promise((resolve) => setTimeout(resolve, 4000));

      searchingAnswerAudio.loop = true;
      searchingAnswerAudio.play();

      try {
        const yuccAIResponse = await askToYuccAI(question);

        if (yuccAIResponse) {
          searchingAnswerAudio.pause();
          searchingAnswerAudio.currentTime = 0;

          if (yuccAIResponse.response.toLowerCase().includes("maaf")) {
            setAnimation("goodAnswerVideo");
            answerResponse(
              yuccAIResponse.response,
              failedToFindAnswerAudio,
              audioRef
            );
          } else {
            setAnimation("goodAnswerVideo");
            answerResponse(
              yuccAIResponse.response,
              successfullyFindAnswerAudio,
              audioRef
            );
          }

          await addNewInformation(
            question,
            yuccAIResponse.response,
            yuccAIResponse.source
          );
          setAnswer(yuccAIResponse.response);
          const surveyAnswer = sessionStorage.getItem("surveyAnswer");
          if (surveyAnswer) {
            fetchRecommendation(surveyAnswer);
          }
        }
      } catch (error) {
        searchingAnswerAudio.pause();
        searchingAnswerAudio.currentTime = 0;
        console.error(error);
        await answerResponse(
          "Terjadi kesalahan. Silakan coba lagi.",
          failedToFindAnswerAudio,
          audioRef
        );
        setAnswer("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsDisabled(false);
        setQuestion(question);
      }
    } else {
      await answerResponse(
        "Maaf, saya tidak mengerti. Silakan coba lagi.",
        failedToFindAnswerAudio,
        audioRef
      );
    }
  }
};
