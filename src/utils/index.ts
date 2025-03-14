export const srtTimeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":");
  const [secs, millis] = seconds.split(",");
  return (
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(secs) +
    parseInt(millis) / 1000
  );
};

export const formatTime = (
  seconds: number,
  format: string = "HH:mm:ss"
): string => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const sec = (seconds % 60).toFixed(0).padStart(2, "0");
  return format.replace("HH", hours).replace("mm", minutes).replace("ss", sec);
};
