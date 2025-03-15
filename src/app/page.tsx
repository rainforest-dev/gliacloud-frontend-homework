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
    <main className="lg:container mx-auto h-screen lg:h-full lg:pt-40 lg:pb-56">
      {!file && (
        <VideoUpload
          onChange={setFile}
          className="aspect-video p-6 flex-center
                    data-[is-dragover=true]:border-cyan-500 data-[is-dragover=true]:bg-cyan-500/10"
        >
          <p className="size-full border-dashed border flex-center">
            Drag and drop your video here
          </p>
        </VideoUpload>
      )}
      {videoSrc && videoType && (
        <>
          <div className="flex size-full flex-col-reverse lg:*:flex-1 lg:flex-row">
            <Subtitles
              current={current}
              sections={sections}
              onJumpToSubtitle={handleJumpToSubtitle}
              onPause={pause}
              onSelectSubtitle={handleSelectSubtitle}
              className="overflow-scroll lg:overflow-visible pb-28 px-4 lg:px-10"
            ></Subtitles>
            <div className="aspect-video h-fit sticky top-0 w-full lg:top-1/2 lg:-translate-y-1/2">
              <VideoPlayer
                src={videoSrc}
                type={videoType}
                onReady={handlePlayerReady}
                onUpdate={handlePlayerSetup}
              ></VideoPlayer>
            </div>
          </div>
          <div className="fixed bottom-0 inset-x-0 overflow-scroll z-10">
            <Timeline
              current={current}
              duration={duration}
              sections={sections}
              onJumpToSubtitle={handleJumpToSubtitle}
              className="h-20 min-w-250"
            />
          </div>
        </>
      )}
    </main>
  );
}
