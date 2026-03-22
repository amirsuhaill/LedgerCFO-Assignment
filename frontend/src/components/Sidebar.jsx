import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, ShieldCheck } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">ComplianceHub</p>
          <p className="text-slate-400 text-xs">Task Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700/50">
        <p className="text-slate-500 text-xs">© 2026 ComplianceHub</p>
      </div>
    </aside>
  );
}
