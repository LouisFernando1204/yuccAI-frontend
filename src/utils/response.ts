import { speak } from "./helper";

export const goodAnswerResponse = async (
  text: string,
  audio: HTMLAudioElement,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  audio.play();
  await speak(text, audioRef);
};

export const badAnswerResponse = async (
  text: string,
  audio: HTMLAudioElement,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  audio.play();
  await speak(text, audioRef);
};
