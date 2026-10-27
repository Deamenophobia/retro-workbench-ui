export type ChartColor = "blue" | "sage" | "amber" | "brick";

export type ChartDatum = {
  label: string;
  value: number;
  color?: ChartColor;
};

export type ChartSeries = {
  id: string;
  label: string;
  values: readonly number[];
  color: ChartColor;
};

export const chartColors: readonly ChartColor[] = ["blue", "sage", "amber", "brick"];
