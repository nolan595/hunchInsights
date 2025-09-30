"use client";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  WEEKLY_LINE_CHART_DATE_RANGES,
  WEEKLY_LINE_CHART_DEFAULT_METRICS,
  WEEKLY_LINE_CHART_DEFAULT_RANGE,
  WEEKLY_LINE_CHART_METRICS,
  type WeeklyLineChartMetricConfig,
  type WeeklyLineChartDateRangeValue,
  type WeeklyLineChartMetricDataKey,
  type WeeklyLineChartMetricSlug,
} from "@/app/constants/charts/weeklyLineChart";

type WeeklyDatum = {
  Date: string;
} & Record<WeeklyLineChartMetricDataKey, number>;

type ChartPoint = {
  timestamp: number;
  dateLabel: string;
} & Record<WeeklyLineChartMetricSlug, number>;

export default function WeeklyLineChart() {
  const [data, setData] = useState<WeeklyDatum[]>([]);
  const [hasError, setHasError] = useState(false);
  const [selectedMetrics, setSelectedMetrics] =
    useState<WeeklyLineChartMetricSlug[]>(() => [
      ...WEEKLY_LINE_CHART_DEFAULT_METRICS,
    ]);
  const [dateRange, setDateRange] = useState<WeeklyLineChartDateRangeValue>(
    WEEKLY_LINE_CHART_DEFAULT_RANGE
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/weeklyData.json");
        if (!response.ok) {
          throw new Error(`Failed to load weekly data. Status: ${response.status}`);
        }
        const json: WeeklyDatum[] = await response.json();
        setData(json);
      } catch (error) {
        console.error("Unable to fetch weekly predictor data", error);
        setHasError(true);
      }
    };

    loadData();
  }, []);

  const toggleMetric = (slug: WeeklyLineChartMetricSlug) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((item) => item !== slug);
      }
      return [...prev, slug];
    });
  };

  const detailedDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );

  const axisDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }),
    []
  );

  const cardDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    []
  );

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!data.length) return [];

    return [...data]
      .filter((item) => Boolean(item.Date))
      .sort((a, b) => {
        const aDate = new Date(a.Date.replace(" ", "T")).getTime();
        const bDate = new Date(b.Date.replace(" ", "T")).getTime();
        return aDate - bDate;
      })
      .map((item) => {
        const isoDate = item.Date.replace(" ", "T");
        const parsedDate = new Date(isoDate);
        const timestamp = parsedDate.getTime();

        if (Number.isNaN(timestamp)) {
          return null;
        }

        const point = {
          timestamp,
          dateLabel: cardDateFormatter.format(parsedDate),
        } as ChartPoint;

        WEEKLY_LINE_CHART_METRICS.forEach((metric) => {
          const rawValue =
            item[metric.dataKey as WeeklyLineChartMetricDataKey];
          point[metric.slug] = Number(rawValue ?? 0);
        });

        return point;
      })
      .filter((item): item is ChartPoint => Boolean(item));
  }, [cardDateFormatter, data]);

  const filteredChartData = useMemo<ChartPoint[]>(() => {
    if (!chartData.length) return [];
    if (dateRange === "all") return chartData;

    const monthsBack = (() => {
      switch (dateRange) {
        case "3m":
          return 3;
        case "6m":
          return 6;
        case "2y":
          return 24;
        case "1y":
        default:
          return 12;
      }
    })();

    const latestTimestamp = chartData[chartData.length - 1].timestamp;
    const startDate = new Date(latestTimestamp);
    startDate.setHours(0, 0, 0, 0);
    startDate.setMonth(startDate.getMonth() - monthsBack);
    const cutoff = startDate.getTime();

    return chartData.filter((point) => point.timestamp >= cutoff);
  }, [chartData, dateRange]);

  const activeMetrics = useMemo<WeeklyLineChartMetricConfig[]>(
    () =>
      WEEKLY_LINE_CHART_METRICS.filter((metric) =>
        selectedMetrics.includes(metric.slug)
      ),
    [selectedMetrics]
  );

  const formatAxisTick = (value: number) => {
    if (!Number.isFinite(value)) return "";
    return axisDateFormatter.format(new Date(value));
  };

  return (
    <div className="w-full h-[520px] rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200">
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Weekly Players – Game Comparisons
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Toggle games and adjust the timeframe to see F2P growth.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {WEEKLY_LINE_CHART_DATE_RANGES.map((option) => {
              const isActive = option.value === dateRange;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDateRange(option.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? "border-slate-400 bg-slate-100 text-slate-900"
                      : "border-transparent bg-white/60 text-slate-500 hover:border-slate-200 hover:text-slate-700"
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {WEEKLY_LINE_CHART_METRICS.map((metric) => {
            const isActive = selectedMetrics.includes(metric.slug);
            return (
              <button
                key={metric.slug}
                type="button"
                onClick={() => toggleMetric(metric.slug)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "border-slate-300 bg-slate-100 text-slate-900"
                    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  aria-hidden="true"
                  style={{ backgroundColor: metric.color }}
                />
                {metric.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex-1">
          {!data.length && !hasError ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading weekly results…
            </div>
          ) : hasError ? (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              Unable to load weekly data.
            </div>
          ) : !filteredChartData.length ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No data for the selected range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredChartData}
                margin={{ top: 24, right: 30, bottom: 8, left: 0 }}
              >
                <defs>
                  {WEEKLY_LINE_CHART_METRICS.map((metric) => (
                    <linearGradient
                      key={metric.slug}
                      id={`${metric.slug}Gradient`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={metric.color} stopOpacity={0.75} />
                      <stop offset="100%" stopColor={metric.color} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  tickFormatter={formatAxisTick}
                  domain={["dataMin", "dataMax"]}
                  minTickGap={32}
                  tick={{ fill: "#475569", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(value: number | string) =>
                    typeof value === "number"
                      ? value.toLocaleString("en-GB")
                      : value
                  }
                  width={72}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#cbd5f5",
                    boxShadow: "0 18px 32px -16px rgba(15, 23, 42, 0.35)",
                    backgroundColor: "rgba(255, 255, 255, 0.97)",
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "#1f2937",
                  }}
                  labelFormatter={(value: number | string) =>
                    detailedDateFormatter.format(new Date(Number(value)))
                  }
                  formatter={(value: number | string, name: string, props) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value);
                    const metric = WEEKLY_LINE_CHART_METRICS.find(
                      (item) =>
                        item.slug ===
                        (props?.dataKey as WeeklyLineChartMetricSlug)
                    );
                    return [
                      Number.isFinite(numericValue)
                        ? numericValue.toLocaleString("en-GB")
                        : "0",
                      metric?.label ?? name,
                    ];
                  }}
                />
                {activeMetrics.map((metric) => (
                  <Line
                    key={metric.slug}
                    type="monotone"
                    dataKey={metric.slug}
                    name={metric.label}
                    stroke={`url(#${metric.slug}Gradient)`}
                    strokeWidth={2.5}
                    dot={{
                      r: 3,
                      stroke: metric.color,
                      strokeWidth: 1,
                      fill: "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: metric.color }}
                    strokeLinecap="round"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
