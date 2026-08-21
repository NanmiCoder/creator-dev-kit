export function PageSkeleton() {
  return (
    <main className="min-h-[100dvh] bg-canvas px-4 py-5 text-ink md:px-8 lg:px-12" aria-busy="true" aria-label="Loading benchmark results">
      <div className="mx-auto max-w-[1400px] animate-pulse">
        <div className="flex items-center justify-between"><div className="h-9 w-52 rounded-full bg-line/70" /><div className="h-3 w-32 rounded-full bg-line/70" /></div>
        <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="h-3 w-44 rounded-full bg-line/70" />
            <div className="mt-8 h-14 max-w-2xl rounded-2xl bg-line/70" />
            <div className="mt-3 h-14 max-w-xl rounded-2xl bg-line/70" />
            <div className="mt-8 h-4 max-w-lg rounded-full bg-line/60" />
            <div className="mt-3 h-4 max-w-md rounded-full bg-line/60" />
          </div>
          <div className="border-l border-line pl-8">
            <div className="h-32 w-72 max-w-full rounded-[2rem] bg-line/70" />
            <div className="mt-8 grid grid-cols-2 gap-6">{[0, 1, 2, 3].map((item) => <div key={item} className="h-12 rounded-xl bg-line/60" />)}</div>
          </div>
        </div>
        <div className="mt-24 h-72 rounded-[2rem] border border-line bg-paper/60" />
      </div>
    </main>
  )
}
