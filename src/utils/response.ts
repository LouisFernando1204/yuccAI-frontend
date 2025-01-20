import { speakWithChanger } from "./helper";

export const answerResponse = async (
  text: string,
  audio: HTMLAudioElement,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setAnimation: React.Dispatch<React.SetStateAction<string>>,
  status: string
) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  speakWithChanger(text, audioRef, setAnimation, status);
};
