import React, { useEffect, useRef, useState } from "react";
import goodAnswerVideo from "../../assets/video/goodAnswerVideo.mp4";
import searchingAnswerVideo from "../../assets/video/searchingAnswerVideo.mp4";
import combine from "../../assets/video/combine.mp4";

interface YuccaModelProps {
  animation: string;
}

const YuccaModel: React.FC<YuccaModelProps> = ({ animation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const goodAnswerPlayback = {
    start: 11,
    end: 15,
  };
  const searchingAnswerPlayback = {
    start: 0,
    end: 10,
  };

  console.log(animation);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      handleLoadedMetadata();

      const handleTimeUpdate = () => {
        if (
          animation == "goodAnswerVideo" &&
          video.currentTime >= goodAnswerPlayback.end
        ) {
          video.currentTime = goodAnswerPlayback.start;
          video.play();
          console.log("g");
        } else if (
          animation == "searchingAnswerVideo" &&
          video.currentTime >= searchingAnswerPlayback.end
        ) {
          video.currentTime = searchingAnswerPlayback.start;
          video.play();
          console.log("s");
        }
      };
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [animation]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      if (animation == "goodAnswerVideo") {
        video.currentTime = goodAnswerPlayback.start;
      } else if (animation == "searchingAnswerVideo") {
        video.currentTime = searchingAnswerPlayback.start;
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="w-screen h-auto">
        {/* {animation === "searchingAnswerVideo" && (
            <video src={searchingAnswerVideo} autoPlay loop muted playsInline />
          )}
          {animation === "goodAnswerVideo" && (
            <video src={goodAnswerVideo} autoPlay loop muted playsInline />
          )} */}
        <video
          ref={videoRef}
          src={combine}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </div>
  );
};

export default YuccaModel;
