import { speak } from "./helper";

export const answerResponse = async (
  text: string,
  audio: HTMLAudioElement,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  audio.loop = true;
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 3000);

  speak(text, audioRef);
};
