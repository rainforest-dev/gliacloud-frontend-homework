"use client";

import { Subtitles, VideoPlayer, VideoUpload } from "@/components";
import type { PlayerType } from "@/components/VideoPlayer";
import { useMemo, useRef, useState } from "react";
import videojs from "video.js";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const playerRef = useRef<PlayerType | null>(null);
  const [videoSrc, videoType] = useMemo(() => {
    if (!file) {
      return [];
    }
    return [URL.createObjectURL(file), file.type];
  }, [file]);

  const handlePlayerReady = (player: PlayerType) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const handleJumpToSubtitle = (time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime(time);
    }
  };

  return (
    <main className="container mx-auto size-full pt-40">
      {!file && (
        <VideoUpload
          onChange={setFile}
          className="aspect-video border-dashed border flex-center 
                    data-[is-dragover=true]:border-cyan-500 data-[is-dragover=true]:bg-cyan-500/10"
        ></VideoUpload>
      )}
      {videoSrc && videoType && (
        <div className="flex h-[50vh] overflow-hidden *:w-1/2">
          {file && (
            <Subtitles
              file={file}
              onJumpToSubtitle={handleJumpToSubtitle}
            ></Subtitles>
          )}
          <VideoPlayer
            src={videoSrc}
            type={videoType}
            onReady={handlePlayerReady}
          ></VideoPlayer>
        </div>
      )}
    </main>
  );
}
