import useSWR from "swr";
import { subtitlesFetcher } from "@/data";
import { useEffect } from "react";
import { formatTime, srtTimeToSeconds } from "@/utils";
import type { ISubtitle } from "@/types";

interface IProps {
  onJumpToSubtitle: (time: number) => void;
  file: File;
}

export default function Subtitles({ file, onJumpToSubtitle }: IProps) {
  const { data, mutate } = useSWR(file, subtitlesFetcher);

  useEffect(() => {
    if (file) {
      mutate();
    }
  }, [file, mutate]);

  const handleSubtitleClick = (subtitle: ISubtitle) => {
    onJumpToSubtitle(srtTimeToSeconds(subtitle.start));
  };

  return (
    <div className="flex flex-col overflow-y-scroll gap-8 px-10">
      {data?.map(({ section, subtitles }) => (
        <section key={section} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold capitalize sticky top-0 bg-gradient-to-b from-background to-transparent">
            {section}
          </h2>
          <ul className="flex flex-col gap-2">
            {subtitles.map((subtitle) => (
              <li
                key={subtitle.start}
                className="px-4 py-2 bg-foreground rounded-lg text-background data-[highlighted=true]:bg-blue-500 data-[highlighted=true]:text-foreground cursor-pointer"
                data-highlighted={subtitle.isHighlighted}
                onClick={() => handleSubtitleClick(subtitle)}
              >
                {formatTime(srtTimeToSeconds(subtitle.start))} {subtitle.text}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
