import { formatTime, srtTimeToSeconds } from "@/utils";
import type { ISectionSubtitles, ISubtitle } from "@/types";
import { useEffect, useRef } from "react";

interface IProps {
  current: number;
  sections?: ISectionSubtitles[];
  onJumpToSubtitle: (time: number) => void;
}

const Subtitle = ({
  subtitle,
  current,
  onClick,
}: {
  subtitle: ISubtitle;
  current: number;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const isCurrent =
    current >= srtTimeToSeconds(subtitle.start) &&
    current <= srtTimeToSeconds(subtitle.end);

  useEffect(() => {
    if (isCurrent) {
      ref.current?.scrollIntoView({
        block: "center",
        inline: "center",
      });
    }
  }, [isCurrent]);

  return (
    <li
      ref={ref}
      className="px-4 py-2 bg-foreground rounded-lg text-background cursor-pointer
                data-[highlighted=true]:bg-blue-500 data-[highlighted=true]:text-foreground
                data-[current=true]:bg-red-500! data-[current=true]:text-foreground data-[current=true]:scale-y-110"
      data-highlighted={subtitle.isHighlighted}
      data-current={isCurrent}
      onClick={onClick}
    >
      {formatTime(srtTimeToSeconds(subtitle.start))} {subtitle.text}
    </li>
  );
};

export default function Subtitles({
  current,
  sections = [],
  onJumpToSubtitle,
}: IProps) {
  const handleSubtitleClick = (subtitle: ISubtitle) => {
    onJumpToSubtitle(srtTimeToSeconds(subtitle.start));
  };

  return (
    <div className="flex flex-col overflow-y-scroll gap-8 px-10">
      {sections.map(({ section, subtitles }) => (
        <section key={section} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold capitalize sticky top-0 bg-gradient-to-b from-background to-transparent">
            {section}
          </h2>
          <ul className="flex flex-col gap-2">
            {subtitles.map((subtitle) => (
              <Subtitle
                key={subtitle.start}
                subtitle={subtitle}
                current={current}
                onClick={() => handleSubtitleClick(subtitle)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
