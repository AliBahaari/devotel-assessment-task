import { Outlet } from "react-router";
import { useDarkModeStore } from "../stores/useStore";

function Layout() {
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);

  return (
    <div
      className={`${darkMode ? "bg-slate-600 text-white" : "bg-white text-black"} min-h-screen`}
    >
      <div>
        <span>Dark Mode?</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => toggleDarkMode()}
        />
      </div>

      <h1>Welcome</h1>

      <Outlet />
    </div>
  );
}

export default Layout;
