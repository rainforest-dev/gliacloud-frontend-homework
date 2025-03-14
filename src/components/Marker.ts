import { PlayerType } from "@/types";
import videojs from "video.js";

const Component = videojs.getComponent("Component");
export type ComponentType = typeof Component;

class Marker extends Component {
  constructor(
    player: PlayerType,
    options: { start: number; end: number; text: string }
  ) {
    super(player, {});

    this.updateTime(
      options.start,
      options.end,
      player.duration() || 0,
      options.text
    );
  }

  createEl() {
    return videojs.dom.createEl("div", {
      className:
        "vjs-marker h-2 min-w-2 rounded-full bg-primary text-on-primary absolute hover:h-4 origin-center transition-all",
    });
  }

  updateTime(time: number, end: number, duration: number, text: string) {
    this.el().setAttribute("title", text);
    this.el().setAttribute(
      "style",
      `left: ${(time / duration) * 100}%; right: ${
        ((duration - end) / duration) * 100
      }%`
    );

    this.on("click", () => {
      this.player().currentTime(time);
    });
  }
}

export default Marker;
