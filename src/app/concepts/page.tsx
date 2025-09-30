export default function ConceptsPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-white via-slate-100 to-slate-200 pb-20 pt-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-10">
        <header className="rounded-3xl border border-white/70 bg-white/80 p-10 shadow-xl shadow-slate-200/60 backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-slate-500">
            Future concepts
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
            Share playable prototypes that bring the roadmap to life.
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-600 sm:text-base">
            We’ll showcase future-facing builds here soon. For now, this space acts as a placeholder while concepts are curated.
          </p>
        </header>

        <section className="rounded-3xl border border-dashed border-slate-300 bg-white/75 p-10 text-center text-sm text-slate-500 shadow-sm">
          Future concept prototypes will be embedded here soon.
        </section>
      </div>
    </main>
  );
}
