import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-500 grid place-items-center font-bold">K</div>
          <span className="text-lg font-semibold tracking-tight">Kodr</span>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
