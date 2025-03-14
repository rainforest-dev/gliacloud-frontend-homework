"use client";

import { Subtitles, VideoPlayer, VideoUpload } from "@/components";
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
    handlePlayerReady,
    handleJumpToSubtitle,
    handlePlayerSetup,
    addHighlight,
    clearHighlights,
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
  }, [file]);

  useEffect(() => {
    if (data) {
      clearHighlights();
      let highlighted = 0;
      data.forEach((section) => {
        section.subtitles.forEach(({ start, end, text, isHighlighted }) => {
          if (isHighlighted) {
            addHighlight(srtTimeToSeconds(start), srtTimeToSeconds(end), text);
            highlighted++;
          }
        });
      });
      console.log(`Highlighted ${highlighted} subtitles`);
    }
  }, [data]);

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
            onUpdate={handlePlayerSetup}
          ></VideoPlayer>
        </div>
      )}
    </main>
  );
}
