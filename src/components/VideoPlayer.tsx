import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface IProps {
  src: string;
  type: string;
}

export default function VideoPlayer({ src, type }: IProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // const player = videojs(ref.current, {
    //   controls: true,
    //   autoplay: true,
    //   preload: "auto",
    // });
    // return () => {
    //   player.dispose();
    // };
  }, []);

  return (
    <video ref={ref} className="video-js vjs-theme-city ">
      <source src={src} type={type} />
      <track
        kind="captions"
        src="/demo.vtt"
        srcLang="en"
        label="English"
        default
      />
      <p>
        Your browser doesn&apos;t support HTML5 video. Here is a{" "}
        <a href={src}>link to the video</a> instead.
      </p>
    </video>
  );
}
