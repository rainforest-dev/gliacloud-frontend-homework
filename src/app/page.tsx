"use client";

import { Subtitles, Timeline, VideoPlayer, VideoUpload } from "@/components";
import { subtitlesFetcher } from "@/data";
import useVideo from "@/hooks/use-video";
import { srtTimeToSeconds } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const { data, mutate } = useSWR(file, subtitlesFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
  const {
    current,
    duration,
    handlePlayerReady,
    handleJumpToSubtitle,
    handlePlayerSetup,
    addHighlight,
    clearHighlights,
    pause,
  } = useVideo();
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

  useEffect(() => {
    if (data) {
      clearHighlights();
      data.forEach((section) => {
        section.subtitles.forEach(({ start, end, text, isHighlighted }) => {
          if (isHighlighted) {
            addHighlight(srtTimeToSeconds(start), srtTimeToSeconds(end), text);
          }
        });
      });
    }
  }, [data]);

  return (
    <main className="container mx-auto size-full pt-40 pb-56">
      {!file && (
        <VideoUpload
          onChange={setFile}
          className="aspect-video border-dashed border flex-center 
                    data-[is-dragover=true]:border-cyan-500 data-[is-dragover=true]:bg-cyan-500/10"
        ></VideoUpload>
      )}
      {videoSrc && videoType && (
        <>
          <div className="flex h-full *:w-1/2">
            <Subtitles
              current={current}
              sections={data}
              onJumpToSubtitle={handleJumpToSubtitle}
              onPause={pause}
            ></Subtitles>
            <div className="flex-1 sticky top-1/2 -translate-y-1/2 aspect-video h-fit">
              <VideoPlayer
                src={videoSrc}
                type={videoType}
                onReady={handlePlayerReady}
                onUpdate={handlePlayerSetup}
              ></VideoPlayer>
            </div>
          </div>
          <Timeline
            current={current}
            duration={duration}
            sections={data}
            onJumpToSubtitle={handleJumpToSubtitle}
            className="h-20 fixed bottom-0 inset-x-0"
          />
        </>
      )}
    </main>
  );
}
