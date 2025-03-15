import type { ISectionSubtitles } from "@/types";
import { srtTimeToSeconds } from "@/utils";
import clsx from "clsx";
import { useRef } from "react";

interface IProps {
  className?: string;
  sections?: ISectionSubtitles[];
  current: number;
  duration: number;
  onJumpToSubtitle: (time: number) => void;
}

export const Block = ({
  lastSection,
  section,
  current,
  index,
  subtitle,
  duration,
  containerWidth,
  onJumpToSubtitle,
}: {
  lastSection?: ISectionSubtitles;
  section: ISectionSubtitles;
  current: number;
  index: number;
  duration: number;
  containerWidth: number;
  subtitle: ISectionSubtitles["subtitles"][number];
  onJumpToSubtitle: (time: number) => void;
}) => {
  const lastTime = srtTimeToSeconds(
    index === 0
      ? lastSection?.subtitles[lastSection.subtitles.length - 1].end ||
          "00:00:00,000"
      : section.subtitles[index - 1].end
  );
  const startTime = srtTimeToSeconds(subtitle.start);
  const endTime = srtTimeToSeconds(subtitle.end);
  const isCurrent = current >= startTime && current <= endTime;
  const offset = ((startTime - lastTime) / duration) * containerWidth;
  const width = ((endTime - startTime) / duration) * containerWidth;
  return (
    <>
      <div
        key={lastTime}
        className="h-full"
        style={{
          width: `${offset}px`,
        }}
      ></div>
      <button
        key={startTime}
        className="h-full cursor-pointer hover:border hover:scale-110
              data-[highlighted=true]:bg-primary data-[highlighted=true]:text-on-primary 
              data-[current=true]:outline-2 data-[current=true]:outline-red-500 data-[current=true]:outline-offset-1"
        style={{
          width: `${width}px`,
        }}
        title={subtitle.text}
        data-highlighted={subtitle.isHighlighted}
        data-current={isCurrent}
        onClick={() => onJumpToSubtitle(startTime)}
      ></button>
    </>
  );
};

export default function Timeline({
  sections = [],
  current,
  duration,
  onJumpToSubtitle,
  className,
}: IProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={clsx(
        className,
        "w-full min-h-4 bg-background-higher shadow flex"
      )}
    >
      {sections.map((section, sectionIndex) => {
        return (
          <div key={section.section} className="relative h-full group z-0 flex">
            <>
              <div className="group-odd:bg-amber-300/20 group-even:bg-green-300/20 absolute inset-0 -z-10"></div>
              {section.subtitles.map((subtitle, index) => (
                <Block
                  key={subtitle.start}
                  current={current}
                  duration={duration}
                  section={section}
                  lastSection={sections[sectionIndex - 1] ?? null}
                  index={index}
                  containerWidth={ref.current?.clientWidth || 0}
                  subtitle={subtitle}
                  onJumpToSubtitle={onJumpToSubtitle}
                />
              ))}
              {sectionIndex === sections.length - 1 && (
                <div
                  className="h-full"
                  style={{
                    width: `${
                      ((duration -
                        srtTimeToSeconds(
                          section.subtitles[section.subtitles.length - 1].end
                        )) /
                        duration) *
                      (ref.current?.clientWidth || 0)
                    }px`,
                  }}
                ></div>
              )}
            </>
          </div>
        );
      })}
    </div>
  );
}
