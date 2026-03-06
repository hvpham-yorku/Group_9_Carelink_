export type Tag = "Medical" | "Vitals" | "Mood" | "Nutrition" | "Activity" | "General";

export type Note = {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  updatedAt: number;
};

export const TAGS: Tag[] = [
  "Medical",
  "Vitals",
  "Mood",
  "Nutrition",
  "Activity",
  "General",
];