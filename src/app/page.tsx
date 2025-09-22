import WeeklyLineChart from "@/app/components/WeeklyLineChart";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="rounded-3xl border border-white/60 bg-white/70 p-10 shadow-xl shadow-slate-200/60 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
            Hunch Insights Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Hunch F2P new players
          </h1>


        </header>

        <WeeklyLineChart />
      </div>
    </main>
  );
}
