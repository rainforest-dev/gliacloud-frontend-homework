import type { PlayerType } from "@/types";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface IProps {
  src: string;
  type: string;
  onReady?: (player: PlayerType) => void;
  onUpdate?: VoidFunction;
}

export default function VideoPlayer({ src, type, onReady, onUpdate }: IProps) {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerType | null>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered", "size-full");
      ref.current?.appendChild(videoElement);

      const player = videojs(
        videoElement,
        {
          controls: true,
          autoplay: true,
          preload: "auto",
          responsive: true,
          fill: true,
          sources: [
            {
              src,
              type,
            },
          ],
        },
        () => {
          videojs.log("player ready");
          onReady?.(player);
        }
      );
      playerRef.current = player;
    } else {
      const player = playerRef.current;
      player.autoplay(true);
      player.src({
        src,
        type,
      });
      onUpdate?.();
    }
  }, [src, type]);

  return <div ref={ref} data-vjs-player className="size-full"></div>;
}
