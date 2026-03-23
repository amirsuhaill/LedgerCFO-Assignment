import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
];

export default function Sidebar() {
  const { dark, toggle } = useTheme();
  const { open, close } = useSidebar();

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto lg:shrink-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 dark:text-white font-semibold text-sm leading-tight">ComplianceHub</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Task Manager</p>
          </div>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => { if (window.innerWidth < 1024) close(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700/50">
          <p className="text-slate-400 dark:text-slate-600 text-xs">© 2026 ComplianceHub</p>
        </div>
      </aside>
    </>
  );
}
