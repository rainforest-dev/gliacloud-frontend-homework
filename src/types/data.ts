export interface ISubtitle {
  start: string;
  end: string;
  text: string;
  isHighlighted: boolean;
}

export interface ISectionSubtitles {
  section: string;
  subtitles: ISubtitle[];
}
