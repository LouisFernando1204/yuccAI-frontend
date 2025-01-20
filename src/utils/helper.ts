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
    "Tunggu ya, Yucca lagi mikir keras buat kasih jawaban yang pas buat kamu.",
    "Sabar sebentar, Yucca lagi nyari solusi terbaik nih!",
    "Sebentar ya, Yucca lagi sibuk nyusun jawaban kece buat kamu.",
    "Mohon tunggu sebentar, Yucca lagi ngecek info yang paling cocok buat kamu.",
    "Tenang aja, Yucca lagi brainstorming biar jawabannya keren dan pas.",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  await speakWithoutChanger(randomMessage, audioRef);
};

export const speakWithoutChanger = async (
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  try {
    let processedText = text
      .replace(/\bhttps:\/\/\S+\b/g, "")
      .replace(/\blink\b/g, "");

    processedText = text.replace(/\b[MCDXLIV]+\b/gi, (match) => {
      const romanRegex =
        /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i;
      if (!romanRegex.test(match)) return match;
      const decimal = romanToDecimal(match.toUpperCase());
      if (isNaN(decimal)) return match;
      const angkaKata = angkaTerbilang(decimal);
      if (decimal === 501 && match.toLowerCase() === "di") return match;
      return angkaKata;
    });

    processedText = processedText.replace(
      /Rp\.?\s?(\d[\d.,]*)/g,
      (match, amount) => {
        const cleanAmount = amount.replace(/[.,]/g, "");
        const angkaKata = angkaTerbilang(parseInt(cleanAmount, 10));
        return `${angkaKata} rupiah`;
      }
    );

    processedText = processedText.replace(/\b\d+\b/g, (match) => {
      const number = parseInt(match, 10);
      const angkaKata = angkaTerbilang(number);
      return angkaKata;
    });

    console.log("Processed Text: ", processedText);

    if (!processedText) {
      console.log("Processed text is empty, skipping Eleven Labs generation.");
      return;
    }
    console.log("Formatted Text: ", processedText);
    // const audioStream = await elevenlabs.generate({
    //   voice: "Kira",
    //   model_id: "eleven_turbo_v2_5",
    //   text: processedText,
    // });
    const audioStream = await elevenlabs.generate({
      voice: "Yucca - Professional",
      model_id: "eleven_multilingual_v2",
      text: processedText,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
      },
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
        //
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const speakWithChanger = async (
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setAnimation: React.Dispatch<React.SetStateAction<string>>,
  status: string
) => {
  try {
    let processedText = text
      .replace(/\bhttps:\/\/\S+\b/g, "") // Menghapus URL yang dimulai dengan https://
      .replace(/\[.*?\]\(\S+\)/g, "") // Menghapus format markdown [Link Text](URL)
      .replace(/\blink\b/g, "") // Menghapus kata 'link' jika ada
      .replace(/Link/g, "") // Mengganti kalimat dengan yang diinginkan
      .replace(/Link Foto:/g, "") // Mengganti kalimat dengan yang diinginkan
      .replace(/Link Foto Fasilitas: Gambar tidak tersedia/g, "") // Mengganti kalimat dengan yang diinginkan
      .replace(/Link Foto: Tidak tersedia dalam konteks yang diberikan/g, "") // Mengganti kalimat dengan yang diinginkan
      .replace(/Tidak ada foto yang tersedia/g, "")
      .replace(/Link Peta GMaps:/g, "")
      .replace(/\(/g, "") // Menghapus karakter (
      .replace(/\)/g, "") // Menghapus karakter )      .replace(/Gambar tidak tersedia/g, "")
      .replace(/Tidak tersedia dalam konteks yang diberikan/g, "")
      .replace(/Link Nomor Telepon Whatsapp WA:/g, "");

    if (processedText) {
      processedText = processedText.replace(/\b[MCDXLIV]+\b/gi, (match) => {
        const romanRegex =
          /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i;

        if (!romanRegex.test(match)) return match;

        const decimal = romanToDecimal(match.toUpperCase());

        if (decimal < 1 || decimal > 20 || isNaN(decimal)) return match;

        const angkaKata = angkaTerbilang(decimal);

        if (decimal === 501 && match.toLowerCase() === "di") return match;

        return angkaKata;
      });
      console.log("del1", processedText);

      processedText = processedText.replace(
        /Rp\.?\s?(\d[\d.,]*)/g,
        (match, amount) => {
          const cleanAmount = amount.replace(/[.,]/g, "");
          const angkaKata = angkaTerbilang(parseInt(cleanAmount, 10));
          return `${angkaKata} rupiah`;
        }
      );
      console.log("del2", processedText);

      processedText = processedText.replace(/\b\d+\b/g, (match) => {
        const number = parseInt(match, 10);
        const angkaKata = angkaTerbilang(number);
        return angkaKata;
      });
      console.log("del3", processedText);

      console.log("Processed Text: ", processedText);
    }

    if (!processedText) {
      console.log("Processed text is empty, skipping Eleven Labs generation.");
      return;
    }
    console.log("Formatted Text: ", processedText);
    // const audioStream = await elevenlabs.generate({
    //   voice: "Kira",
    //   model_id: "eleven_turbo_v2_5",
    //   text: processedText,
    // });
    const audioStream = await elevenlabs.generate({
      voice: "Yucca - Professional",
      model_id: "eleven_multilingual_v2",
      text: processedText,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
      },
    });
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioData = new Blob(chunks, { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioData);

    if (audioRef.current) {
      // setAnimation("speakVideo")
      audioRef.current.src = audioUrl;
      if (status == "good") {
        setAnimation("goodAnswerVideo");
        setTimeout(() => {
          audioRef.current!.play();
        }, 6000);
      }
      else {
        setAnimation("badAnswerVideo");
        setTimeout(() => {
          audioRef.current!.play();
        }, 1000);
      }

      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        //
        setAnimation("idleVideo");
      };
    }
  } catch (error) {
    console.log(error);
  }
};
