"use client";

import { Subtitles, VideoPlayer, VideoUpload } from "@/components";
import { useMemo, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, videoType] = useMemo(() => {
    if (!file) {
      return [];
    }
    return [URL.createObjectURL(file), file.type];
  }, [file]);

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
          {file && <Subtitles file={file}></Subtitles>}
          <VideoPlayer src={videoSrc} type={videoType}></VideoPlayer>
        </div>
      )}
    </main>
  );
}
