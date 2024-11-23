import { Typewriter } from "react-simple-typewriter";

export const GreetingSection = () => {
  return (
    <div className="text-md md:text-2xl font-semibold text-primary">
      <Typewriter
        words={[
          "Haii! Dengan Yucca disini!",
          "Jadi apa yang bisa Yucca bantu hari ini ?",
        ]}
        cursor
        cursorStyle="|"
        cursorBlinking
        typeSpeed={100}
        deleteSpeed={100}
        delaySpeed={1000}
      />
    </div>
  );
};
