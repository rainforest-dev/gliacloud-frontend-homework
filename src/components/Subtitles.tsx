import { formatTime, srtTimeToSeconds } from "@/utils";
import type { ISectionSubtitles, ISubtitle } from "@/types";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface IProps {
  current: number;
  sections?: ISectionSubtitles[];
  isLoading?: boolean;
  onJumpToSubtitle: (time: number) => void;
  onPause?: () => void;
  onSelectSubtitle?: (subtitle: ISubtitle) => void;
  className?: string;
}

const Subtitle = ({
  subtitle,
  current,
  onClick,
  onSelect,
}: {
  subtitle: ISubtitle;
  current: number;
  onClick: () => void;
  onSelect?: (subtitle: ISubtitle) => void;
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
      className="bg-background-higher rounded-lg text-foreground shadow flex
                data-[highlighted=true]:bg-primary data-[highlighted=true]:text-on-primary
                data-[current=true]:outline-2 data-[current=true]:outline-offset-1 data-[current=true]:outline-rose-500"
      data-highlighted={subtitle.isHighlighted}
      data-current={isCurrent}
    >
      <button
        className="text-left pl-4 pr-2 py-2 cursor-pointer 
                    hover:bg-primary/50 hover:backdrop-brightness-110 hover:rounded-[inherit]"
        onClick={onClick}
      >
        {formatTime(srtTimeToSeconds(subtitle.start))}
      </button>
      <button
        className="text-left pr-4 pl-2 py-2 grow cursor-pointer 
                    hover:bg-primary/50 hover:backdrop-brightness-110 hover:rounded-[inherit]"
        onClick={() => onSelect?.(subtitle)}
      >
        {subtitle.text}
      </button>
    </li>
  );
};

export default function Subtitles({
  current,
  sections = [],
  isLoading,
  onJumpToSubtitle,
  onPause,
  onSelectSubtitle,
  className,
}: IProps) {
  const handleScroll = () => {
    onPause?.();
  };

  const handleSubtitleClick = (subtitle: ISubtitle) => {
    onJumpToSubtitle(srtTimeToSeconds(subtitle.start));
  };

  if (isLoading) {
    return (
      <div className={className}>
        <h2 className="text-2xl h-[1lh] w-1/2 mb-4 mt-10 shadow rounded-lg bg-background-higher animate-pulse"></h2>
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="size-full px-4 py-2 shadow rounded-lg bg-background-higher animate-pulse"
            >
              <div className="h-[1lh] w-full"></div>
            </div>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={clsx("flex flex-col w-full", className)}
      onWheel={handleScroll}
      onTouchMove={handleScroll}
    >
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
                onSelect={onSelectSubtitle}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
