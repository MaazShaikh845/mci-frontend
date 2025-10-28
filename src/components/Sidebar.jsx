// src/components/Sidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, User, Settings, Home, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 w-64 bg-[#0b1220]/95 backdrop-blur-lg border-r border-white/10 z-50 flex flex-col p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-white">Menu</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 text-slate-200">
            <Link
              to="/"
              onClick={toggleSidebar}
              className="flex gap-3 items-center px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <Home size={18} /> <span>Dashboard</span>
            </Link>
            <Link
              to="/test"
              onClick={toggleSidebar}
              className="flex gap-3 items-center px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <BarChart3 size={18} /> <span>Take Test</span>
            </Link>
            <Link
              to="/results"
              onClick={toggleSidebar}
              className="flex gap-3 items-center px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <User size={18} /> <span>Results</span>
            </Link>
            <Link
              to="#"
              className="flex gap-3 items-center px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <Settings size={18} /> <span>Settings</span>
            </Link>
          </nav>

          <div className="mt-auto text-xs text-slate-500 pt-6 border-t border-white/10">
            <div>© 2025 Cognitive Labs</div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
