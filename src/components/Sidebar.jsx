'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Stethoscope } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login';
    }
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-xl transition-all duration-300 print:hidden">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-emerald-500 text-white p-2 rounded-lg shadow-lg shadow-emerald-500/30">
          <Stethoscope size={24} />
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-wide">Pet EMR</span>
          <p className="text-xs text-slate-500">G.A.Cアニマルクリニック</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group"
        >
          <LayoutDashboard size={20} className="group-hover:text-emerald-400 transition-colors" />
          <span className="font-medium">ダッシュボード</span>
        </Link>
        <Link
          href="/patients"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group"
        >
          <Users size={20} className="group-hover:text-emerald-400 transition-colors" />
          <span className="font-medium">患者一覧</span>
        </Link>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-900/40 hover:text-red-400 transition-colors group text-left"
        >
          <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
          <span className="font-medium">ログアウト</span>
        </button>
      </div>
    </aside>
  );
}
