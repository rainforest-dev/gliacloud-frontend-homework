import type { PlayerType } from "@/types";
import { useRef, useState } from "react";
import videojs from "video.js";
import { throttle } from "lodash-es";

export default function useVideo() {
  const [current, setCurrent] = useState<number>(0);
  const playerRef = useRef<PlayerType | null>(null);

  const handlePlayerReady = (player: PlayerType) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    handlePlayerSetup();
  };

  const handlePlayerSetup = () => {
    playerRef.current?.addRemoteTextTrack({
      kind: "subtitles",
      src: "/demo.vtt",
      srclang: "en",
      label: "English",
    });

    playerRef.current?.on(
      "timeupdate",
      throttle(() => {
        const time = playerRef.current?.currentTime() || 0;
        setCurrent(time);
      })
    );
  };

  const handleJumpToSubtitle = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime(time);
    }
  };

  return {
    playerRef,
    current,
    handlePlayerReady,
    handlePlayerSetup,
    handleJumpToSubtitle,
  };
}
