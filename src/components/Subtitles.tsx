import useSWR from "swr";
import { subtitlesFetcher } from "@/data";
import { useEffect } from "react";

interface IProps {
  file: File;
}

export default function Subtitles({ file }: IProps) {
  const { data, mutate } = useSWR(file, subtitlesFetcher);

  useEffect(() => {
    if (file) {
      mutate();
    }
  }, [file, mutate]);

  console.log(data);

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
                className="bg-foreground rounded-lg text-background data-[highlighted=true]:bg-cyan-500 cursor-pointer"
                data-highlighted={subtitle.isHighlighted}
              >
                <button
                  className="px-4 py-2"
                  onClick={() => console.log(subtitle)}
                >
                  {subtitle.start} ~ {subtitle.end} {subtitle.text}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
