import angkaTerbilang from "@develoka/angka-terbilang-js";
import { elevenlabs } from "./global";

export const romanToDecimal = (roman: string): number => {
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

export const isValidQuestion = (question: string): boolean => {
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

export const speakRandomThinkingMessage = async (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  const messages = [
    "Tunggu ya, YuccAI lagi mikir keras buat kasih jawaban yang pas buat kamu.",
    "Sabar sebentar, YuccAI lagi nyari solusi terbaik nih!",
    "Sebentar ya, YuccAI lagi sibuk nyusun jawaban kece buat kamu.",
    "Mohon tunggu sebentar, YuccAI lagi ngecek info yang paling cocok buat kamu.",
    "Tenang aja, YuccAI lagi brainstorming biar jawabannya keren dan pas.",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  await speak(randomMessage, audioRef);
};

export const speak = async (
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
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