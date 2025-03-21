import type { PlayerType } from "@/types";
import { useRef, useState } from "react";
import videojs from "video.js";
import { throttle } from "lodash-es";
import Marker, { type ComponentType } from "@/components/Marker";

videojs.registerComponent("Marker", Marker as ComponentType);

export default function useVideo() {
  const [current, setCurrent] = useState<number>(0);
  const playerRef = useRef<PlayerType | null>(null);
  const [duration, setDuration] = useState<number>(0);

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
    playerRef.current?.on("loadedmetadata", () => {
      setDuration(playerRef.current?.duration() || 0);
    });

    playerRef.current?.on(
      "timeupdate",
      throttle(() => {
        const time = playerRef.current?.currentTime() || 0;
        setCurrent(time);
      })
    );
  };

  const updateSubtitles = (url: string) => {
    if (playerRef.current) {
      playerRef.current.addRemoteTextTrack(
        {
          kind: "subtitles",
          src: url,
          srclang: "en",
          label: "English",
        },
        false
      );
    }
  };

  const handleJumpToSubtitle = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime(time);
      playerRef.current.play();
    }
  };

  const addHighlight = (start: number, end: number, text: string) => {
    if (playerRef.current) {
      const controlBar = playerRef.current.getChild("ControlBar");
      const progressControl = controlBar?.getChild("ProgressControl");
      if (progressControl) {
        progressControl.addChild("Marker", { start, end, text });
      }
    }
  };

  const removeHighlight = (start: number) => {
    if (playerRef.current) {
      const controlBar = playerRef.current.getChild("ControlBar");
      const progressControl = controlBar?.getChild("ProgressControl");
      if (progressControl) {
        progressControl.children().forEach((child) => {
          if (child instanceof Marker && child.options_.start === start) {
            progressControl.removeChild(child);
          }
        });
      }
    }
  };

  const clearHighlights = () => {
    if (playerRef.current) {
      const controlBar = playerRef.current.getChild("ControlBar");
      const progressControl = controlBar?.getChild("ProgressControl");
      if (progressControl) {
        progressControl.children().forEach((child) => {
          if (child instanceof Marker) {
            progressControl.removeChild(child);
          }
        });
      }
    }
  };

  const pause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  return {
    playerRef,
    current,
    duration,
    updateSubtitles,
    handlePlayerReady,
    handlePlayerSetup,
    handleJumpToSubtitle,
    addHighlight,
    removeHighlight,
    clearHighlights,
    pause,
  };
}
