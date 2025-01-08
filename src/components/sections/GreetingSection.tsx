import { Typewriter } from "react-simple-typewriter";

export const GreetingSection = () => {
  return (
    <div
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      data-aos-duration="500"
      className="text-md md:text-2xl font-semibold text-primary text-center">
      <Typewriter
        words={[
          "Hai! Dengan Yucca disini!",
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
