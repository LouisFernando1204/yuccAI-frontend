import React, { useEffect, useRef, useState } from "react";
import yucca from "../../assets/video/yucca.mp4";
import laugh from "../../assets/sound/laugh.mp3";

interface YuccaModelProps {
  animation: string;
}

const YuccaModel: React.FC<YuccaModelProps> = ({ animation }) => {
  const [animationObject, setAnimationObject] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const laughAudio = new Audio(laugh);

  const introPlayback = {
    start: 0,
    end: 18,
  };
  const idlePlayback = {
    start: 20,
    end: 44,
  };
  const searchingAnswerPlayback = {
    start: 47,
    end: 57,
  };
  const goodAnswerPlayback = {
    start: 65,
    end: 81,
  };
  const badAnswerPlayback = {
    start: 82,
    end: 86,
  };
  const tickledPlayback = {
    start: 87,
    end: 90,
  };

  useEffect(() => {
    setAnimationObject(animation);
  }, [animation]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      handleLoadedMetadata();

      const handleTimeUpdate = () => {
        if (
          animationObject == "introVideo" &&
          video.currentTime >= introPlayback.end
        ) {
          setAnimationObject("idleVideo");
          video.play();
          console.log("i");
        } else if (
          animationObject == "idleVideo" &&
          video.currentTime >= idlePlayback.end
        ) {
          video.currentTime = idlePlayback.start;
          video.play();
          console.log("ii");
        } else if (
          animationObject == "goodAnswerVideo" &&
          video.currentTime >= goodAnswerPlayback.end
        ) {
          video.currentTime = goodAnswerPlayback.start + 7;
          video.play();
          console.log("g");
        } else if (
          animationObject == "searchingAnswerVideo" &&
          video.currentTime >= searchingAnswerPlayback.end
        ) {
          video.currentTime = searchingAnswerPlayback.start + 5.3;
          video.play();
          console.log("s");
        } else if (
          animationObject == "badAnswerVideo" &&
          video.currentTime >= badAnswerPlayback.end
        ) {
          video.currentTime = badAnswerPlayback.start;
          video.play();
          console.log("b");
        } else if (
          animationObject == "tickledVideo" &&
          video.currentTime >= tickledPlayback.end
        ) {
          laughAudio.pause();
          laughAudio.currentTime = 0;
          setAnimationObject("idleVideo");
          video.play();
          console.log("t");
        }
      };
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [animationObject]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      if (animationObject == "goodAnswerVideo") {
        video.currentTime = goodAnswerPlayback.start;
      } else if (animationObject == "searchingAnswerVideo") {
        video.currentTime = searchingAnswerPlayback.start;
      } else if (animationObject == "badAnswerVideo") {
        video.currentTime = badAnswerPlayback.start;
      } else if (animationObject == "idleVideo") {
        video.currentTime = idlePlayback.start;
      } else if (animationObject == "introVideo") {
        video.currentTime = introPlayback.start;
      } else if (animationObject == "tickledVideo") {
        video.currentTime = tickledPlayback.start + 1;
        laughAudio.play();
      }
    }
  };

  const handleTicklish = () => {
    const video = videoRef.current;
    if (video) {
      if (animationObject == "idleVideo") {
        setAnimationObject("tickledVideo");
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="w-screen h-auto">
        <video
          ref={videoRef}
          // src='https://gateway.pinata.cloud/ipfs/bafybeifljatihjpigj2sgucfmkxzuxkosymy4ozl5jk7j6m5rpzbhjalne'
          src={yucca}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handleTicklish}
        />
      </div>
    </div>
  );
};

export default YuccaModel;
