import WeeklyLineChart from "@/app/components/WeeklyLineChart";
import { INSIGHTS_SUMMARY } from "@/app/constants/insights";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-white via-slate-100 to-slate-200 pb-20 pt-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-10">
        <header className="rounded-3xl border border-white/70 bg-white/80 p-10 shadow-xl shadow-slate-200/60 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-slate-500">
            Key insights & stats
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            New F2P players week on week
          </h1>
    
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {INSIGHTS_SUMMARY.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-emerald-600">{item.change}</p>
              </div>
            ))}
          </div>
        </header>

        <WeeklyLineChart />
      </div>
    </main>
  );
}
