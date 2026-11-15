import { NavLink, Outlet, useNavigate } from "react-router";
import api from "../config/axiosInstance";
import { useDispatch } from "react-redux";
import { removeUser } from "../features/auth/authSlice";

const MainLayout = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      let res = await api.post("/api/auth/logout");
      console.log("logout ->", res);
      dispatch(removeUser());
    } catch (error) {
      console.log("error in logout api", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500 grid place-items-center text-sm font-bold">
              K
            </div>
            <span className="font-semibold tracking-tight">Kodr</span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink
              to="/main"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 transition ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`
              }
            >
              Home
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-md border border-zinc-800 px-3 py-1.5 text-zinc-300 transition hover:bg-zinc-900 cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
