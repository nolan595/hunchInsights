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

type WeeklyDatum = {
  Date: string;
  "Serbia Predictor": number;
  "Belgium Predictor": number;
};

type ChartPoint = {
  timestamp: number;
  dateLabel: string;
  belgium: number;
  serbia: number;
};

export default function WeeklyLineChart() {
  const [data, setData] = useState<WeeklyDatum[]>([]);
  const [hasError, setHasError] = useState(false);

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
    return [...data]
      .sort(
        (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
      )
      .map((item) => {
        const date = new Date(item.Date);
        return {
          timestamp: date.getTime(),
          dateLabel: cardDateFormatter.format(date),
          belgium: item["Belgium Predictor"],
          serbia: item["Serbia Predictor"],
        };
      });
  }, [cardDateFormatter, data]);

  const formatAxisTick = (value: number) => {
    if (!Number.isFinite(value)) return "";
    return axisDateFormatter.format(new Date(value));
  };

  return (
    <div className="w-full h-[520px] rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200">
      <h2 className="text-xl font-semibold text-slate-800">User Growth – Belgium vs Serbia Predictor</h2>

      <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#22c55e]" aria-hidden="true" />
          <dt className="sr-only">Belgium Predictor</dt>
          <dd>Belgium Predictor</dd>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#6366f1]" aria-hidden="true" />
          <dt className="sr-only">Serbia Predictor</dt>
          <dd>Serbia Predictor</dd>
        </div>
      </dl>

      {!data.length && !hasError ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          Loading weekly results…
        </div>
      ) : hasError ? (
        <div className="flex h-full items-center justify-center text-sm text-red-500">
          Unable to load weekly data.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={chartData} margin={{ top: 24, right: 30, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="belgiumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="serbiaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
              </linearGradient>
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
              formatter={(value: number | string, name: string) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value);
                const label =
                  name === "belgium"
                    ? "Belgium Predictor"
                    : "Serbia Predictor";
                return [numericValue.toLocaleString("en-GB"), label];
              }}
            />
            <Line
              type="monotone"
              dataKey="belgium"
              name="Belgium Predictor"
              stroke="url(#belgiumGradient)"
              strokeWidth={2.5}
              dot={{ r: 3, stroke: "#22c55e", strokeWidth: 1, fill: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#22c55e" }}
              strokeLinecap="round"
            />
            <Line
              type="monotone"
              dataKey="serbia"
              name="Serbia Predictor"
              stroke="url(#serbiaGradient)"
              strokeWidth={2.5}
              dot={{ r: 3, stroke: "#6366f1", strokeWidth: 1, fill: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#6366f1" }}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
