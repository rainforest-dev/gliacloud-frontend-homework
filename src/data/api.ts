import type { ISectionSubtitles } from "@/types";

export const subtitlesFetcher = async () =>
  // file: File
  {
    const formData = new FormData();
    // formData.append("file", file);
    const response = await fetch("/api/video/subtitles", {
      method: "POST",
      body: formData,
    });
    return ((await response.json()) as { url: string }).url;
  };

export const analyzeFetcher = async () => {
  const formData = new FormData();
  // formData.append("file", file);
  const response = await fetch("/api/video/analyze", {
    method: "POST",
    body: formData,
  });
  return response.json() as Promise<ISectionSubtitles[]>;
};
