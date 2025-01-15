import { ElevenLabsClient } from "elevenlabs";

export const elevenlabs = new ElevenLabsClient({
  apiKey: `${import.meta.env.VITE_ELEVENLABS_API_KEY}`,
});

