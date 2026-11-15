const stats = [
  { label: "Projects", value: "12" },
  { label: "Tasks done", value: "248" },
  { label: "Team members", value: "8" },
];

const activity = [
  { title: "Created project “Auth service”", time: "2 hours ago" },
  { title: "Updated profile details", time: "Yesterday" },
  { title: "Joined the Kodr workspace", time: "3 days ago" },
];

const Home = () => {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome 👋</h1>
        <p className="mt-2 text-zinc-400">Here&apos;s what&apos;s happening with your account today.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-400">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-medium">Recent activity</h2>
        </div>
        <ul className="divide-y divide-zinc-800">
          {activity.map((a) => (
            <li key={a.title} className="flex items-center justify-between px-5 py-4 text-sm">
              <span className="text-zinc-200">{a.title}</span>
              <span className="text-zinc-500">{a.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
