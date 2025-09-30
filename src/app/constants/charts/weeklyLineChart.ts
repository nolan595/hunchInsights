export const WEEKLY_LINE_CHART_METRICS = [
  {
    slug: "serbiaPredictor",
    dataKey: "Serbia Predictor",
    label: "Serbia Predictor",
    color: "#6366f1",
  },
  {
    slug: "belgiumPredictor",
    dataKey: "Belgium Predictor",
    label: "Belgium Predictor",
    color: "#22c55e",
  },
  {
    slug: "belgiumStreak",
    dataKey: "Belgium Streak",
    label: "Belgium Streak",
    color: "#0ea5e9",
  },
  {
    slug: "brazilPredictor",
    dataKey: "Brazil Predictor",
    label: "Brazil Predictor",
    color: "#f97316",
  },
  {
    slug: "brazilStreak",
    dataKey: "Brazil Streak",
    label: "Brazil Streak",
    color: "#ea580c",
  },
  {
    slug: "brazilBracket",
    dataKey: "Brazil Bracket",
    label: "Brazil Bracket",
    color: "#facc15",
  },
  {
    slug: "romaniaPredictor",
    dataKey: "Romania Predictor",
    label: "Romania Predictor",
    color: "#f43f5e",
  },
  {
    slug: "romaniaStreak",
    dataKey: "Romania Streak",
    label: "Romania Streak",
    color: "#ef4444",
  },
  {
    slug: "polandPredictor",
    dataKey: "Poland Predictor",
    label: "Poland Predictor",
    color: "#14b8a6",
  },
] as const;

export const WEEKLY_LINE_CHART_DATE_RANGES = [
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last 12 months" },
  { value: "2y", label: "Last 24 months" },
  { value: "all", label: "All time" },
] as const;

export const WEEKLY_LINE_CHART_DEFAULT_METRICS = [
  "serbiaPredictor",
  "belgiumPredictor",
] as const;

export const WEEKLY_LINE_CHART_DEFAULT_RANGE = "1y" as const;

export type WeeklyLineChartMetricConfig =
  (typeof WEEKLY_LINE_CHART_METRICS)[number];
export type WeeklyLineChartMetricSlug = WeeklyLineChartMetricConfig["slug"];
export type WeeklyLineChartMetricDataKey = WeeklyLineChartMetricConfig["dataKey"];

export type WeeklyLineChartDateRangeValue =
  (typeof WEEKLY_LINE_CHART_DATE_RANGES)[number]["value"];
