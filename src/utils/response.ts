import { speakWithChanger } from "./helper";

export const answerResponse = async (
  text: string,
  audio: HTMLAudioElement,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setAnimation: React.Dispatch<React.SetStateAction<string>>,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  audio.loop = true;
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 3000);

  speakWithChanger(text, audioRef, setAnimation);
};
