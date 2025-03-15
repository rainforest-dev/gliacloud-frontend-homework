import type { ISectionSubtitles } from "@/types";

export const subtitlesFetcher = async () =>
  // file: File
  {
    const formData = new FormData();
    // formData.append("file", file);
    const response = await fetch("/api/video/analyze", {
      method: "POST",
      body: formData,
    });
    return response.json() as Promise<ISectionSubtitles[]>;
  };
