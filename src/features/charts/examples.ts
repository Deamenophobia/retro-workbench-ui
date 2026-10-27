import type { ChartDatum, ChartSeries } from "../../shared/ui";

export const activity: Record<
  "week" | "month",
  { labels: readonly string[]; series: readonly ChartSeries[] }
> = {
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    series: [
      { id: "current", label: "This period", color: "blue", values: [18, 26, 22, 34, 29, 38, 32] },
      {
        id: "previous",
        label: "Previous period",
        color: "sage",
        values: [14, 20, 18, 25, 24, 28, 26],
      },
    ],
  },
  month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    series: [
      { id: "current", label: "This period", color: "blue", values: [118, 142, 126, 164] },
      { id: "previous", label: "Previous period", color: "sage", values: [96, 124, 112, 138] },
    ],
  },
};

export const categories: readonly ChartDatum[] = [
  { label: "Guides", value: 24, color: "blue" },
  { label: "Notes", value: 18, color: "blue" },
  { label: "Templates", value: 14, color: "blue" },
  { label: "Reviews", value: 8, color: "blue" },
];

export const statuses: readonly ChartDatum[] = [
  { label: "Ready", value: 32, color: "blue" },
  { label: "In review", value: 18, color: "sage" },
  { label: "Draft", value: 10, color: "amber" },
  { label: "Archived", value: 4, color: "brick" },
];
