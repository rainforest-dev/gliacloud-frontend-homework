"use client";

import { Subtitles, Timeline, VideoPlayer, VideoUpload } from "@/components";
import { subtitlesFetcher } from "@/data";
import useVideo from "@/hooks/use-video";
import type { ISubtitle } from "@/types";
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
    removeHighlight,
    clearHighlights,
    pause,
  } = useVideo();
  const [videoSrc, videoType] = useMemo(() => {
    if (!file) {
      return [];
    }
    return [URL.createObjectURL(file), file.type];
  }, [file]);
  const [highlightedSubtitles, setHighlightedSubtitles] = useState<
    Record<number, boolean>
  >({});
  const sections = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((section) => ({
      ...section,
      subtitles: section.subtitles.map((subtitle) => ({
        ...subtitle,
        isHighlighted: highlightedSubtitles[srtTimeToSeconds(subtitle.start)],
      })),
    }));
  }, [data, highlightedSubtitles]);

  const handleSelectSubtitle = (subtitle: ISubtitle) => {
    const time = srtTimeToSeconds(subtitle.start);
    setHighlightedSubtitles((prev) => {
      const isHighlighted = prev[time];
      if (isHighlighted) {
        removeHighlight(time);
      } else {
        addHighlight(time, srtTimeToSeconds(subtitle.end), subtitle.text);
      }
      return {
        ...prev,
        [time]: !isHighlighted,
      };
    });
  };

  useEffect(() => {
    if (file) {
      mutate();
    }
  }, [file, mutate]);

  useEffect(() => {
    if (data) {
      clearHighlights();
      const highlightedSubtitles: Record<number, boolean> = {};
      data.forEach((section) => {
        section.subtitles.forEach(({ start, end, text, isHighlighted }) => {
          if (isHighlighted) {
            addHighlight(srtTimeToSeconds(start), srtTimeToSeconds(end), text);
            highlightedSubtitles[srtTimeToSeconds(start)] = true;
          }
        });
      });
      setHighlightedSubtitles(highlightedSubtitles);
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
              sections={sections}
              onJumpToSubtitle={handleJumpToSubtitle}
              onPause={pause}
              onSelectSubtitle={handleSelectSubtitle}
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
            sections={sections}
            onJumpToSubtitle={handleJumpToSubtitle}
            className="h-20 fixed bottom-0 inset-x-0"
          />
        </>
      )}
    </main>
  );
}
