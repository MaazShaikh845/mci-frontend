// src/App.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#071026] text-slate-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
