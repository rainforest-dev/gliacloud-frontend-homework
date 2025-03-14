import { formatTime, srtTimeToSeconds } from "@/utils";
import type { ISectionSubtitles, ISubtitle } from "@/types";
import { useEffect, useRef } from "react";

interface IProps {
  current: number;
  sections?: ISectionSubtitles[];
  onJumpToSubtitle: (time: number) => void;
  onPause?: () => void;
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
      className="px-4 py-2 bg-background-higher rounded-lg text-foreground cursor-pointer shadow
                data-[highlighted=true]:bg-primary data-[highlighted=true]:text-on-primary
                data-[current=true]:outline-2 data-[current=true]:outline-offset-1 data-[current=true]:outline-rose-500"
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
  onPause,
}: IProps) {
  const handleScroll = () => {
    onPause?.();
  };

  const handleSubtitleClick = (subtitle: ISubtitle) => {
    onJumpToSubtitle(srtTimeToSeconds(subtitle.start));
  };

  return (
    <div className="flex flex-col px-10" onWheel={handleScroll}>
      {sections.map(({ section, subtitles }) => (
        <section key={section} className="flex flex-col">
          <h2 className="pb-4 pt-10 text-2xl font-bold capitalize sticky top-0 bg-gradient-to-b from-background via-background/80 to-transparent">
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
