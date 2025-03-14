"use client";

import { Subtitles, VideoPlayer, VideoUpload } from "@/components";
import { subtitlesFetcher } from "@/data";
import useVideo from "@/hooks/use-video";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const { data, mutate } = useSWR(file, subtitlesFetcher);
  const { playerRef, current, handlePlayerReady, handleJumpToSubtitle } =
    useVideo();
  const [videoSrc, videoType] = useMemo(() => {
    if (!file) {
      return [];
    }
    return [URL.createObjectURL(file), file.type];
  }, [file]);

  useEffect(() => {
    if (file) {
      mutate();
    }
  }, [file, mutate]);

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
              current={current}
              sections={data}
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
