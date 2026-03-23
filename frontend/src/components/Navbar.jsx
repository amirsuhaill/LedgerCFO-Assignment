import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const TITLES = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/tasks': 'All Tasks',
};

export default function Navbar() {
  const { toggle } = useSidebar();
  const { pathname } = useLocation();

  const title = TITLES[pathname] ?? (pathname.startsWith('/clients/') ? 'Client Detail' : 'ComplianceHub');

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
      <button
        onClick={toggle}
        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>
      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{title}</span>
    </header>
  );
}
