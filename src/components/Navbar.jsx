// src/components/Navbar.jsx
import { Menu, Moon, SunMedium } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ toggleSidebar }) {
  const [dark, setDark] = useState(true);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f172a]/70 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-4 md:px-8 py-3">
      <div className="flex items-center gap-3">
        {/* ✅ Menu button now visible on all screens */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg md:text-xl font-semibold">
          🧠 MCI Predictor
        </h1>
      </div>

      <nav className="flex items-center gap-3 md:gap-4">
        <Link
          to="/test"
          className="px-4 py-2 rounded-lg bg-indigo-500/80 hover:bg-indigo-500/95 text-white font-medium"
        >
          Take Test
        </Link>

        <Link
          to="/results"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
        >
          Results
        </Link>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          aria-label="Toggle Theme"
        >
          {dark ? <Moon size={18} /> : <SunMedium size={18} />}
        </button>
      </nav>
    </header>
  );
}
