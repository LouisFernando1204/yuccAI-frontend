import { speak } from "./helper";

export const answerResponse = async (
  text: string,
  audio: HTMLAudioElement,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {

  audio.loop = true;
  audio.play();

  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0; 
  }, 4000);

  speak(text, audioRef);

};
