import subtitles from "@/assets/subtitles.json";

export const POST = async () => {
  // TODO: Implement the logic to analyze the subtitles and generate sections.
  // const formData = await request.formData();
  // const file = formData.get("file") as File;
  const sections = [
    "introduction",
    "key features",
    "demonstration",
    "conclusion",
  ];
  const n = subtitles.length / sections.length;
  return Response.json(
    sections.map((section, index) => ({
      section,
      subtitles: subtitles
        .slice(index * n, Math.min(subtitles.length, (index + 1) * n))
        .map((subtitle) => ({
          ...subtitle,
          isHighlighted: Math.random() > 0.9,
        })),
    }))
  );
};
