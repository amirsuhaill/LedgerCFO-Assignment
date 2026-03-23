import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ClipboardList, Clock, Loader, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { getStats, getTasks } from '../api';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/Badge';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value ?? '—'}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 hidden sm:block">{sub}</p>}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function isOverdue(due_date, status) {
  return status !== 'Completed' && new Date(due_date) < new Date(new Date().toDateString());
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getStats(), getTasks()])
      .then(([s, t]) => { setStats(s); setTasks(t); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const overdue = tasks.filter(t => isOverdue(t.due_date, t.status));
  const upcoming = tasks.filter(t => t.status !== 'Completed' && !isOverdue(t.due_date, t.status)).slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="animate-spin text-indigo-500" size={28} />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
      <p className="text-red-500 font-medium">Could not connect to backend</p>
      <p className="text-slate-400 text-sm">{error}</p>
      <p className="text-slate-400 text-xs">Make sure the backend is running on <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">http://localhost:3001</code></p>
    </div>
  );

  const completionRate = stats?.tasks?.total
    ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of your compliance workload</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Clients" value={stats?.total_clients} color="bg-indigo-500" />
        <StatCard icon={ClipboardList} label="Total Tasks" value={stats?.tasks?.total} color="bg-slate-600" />
        <StatCard icon={Clock} label="Pending" value={stats?.tasks?.pending} color="bg-amber-500" sub={`${stats?.tasks?.in_progress} in progress`} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats?.tasks?.completed} color="bg-emerald-500" sub={`${completionRate}% done`} />
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Overall Completion</span>
          </div>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Pending: {stats?.tasks?.pending}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />In Progress: {stats?.tasks?.in_progress}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Completed: {stats?.tasks?.completed}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Overdue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700/50">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Overdue Tasks</h2>
            {overdue.length > 0 && (
              <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">{overdue.length}</span>
            )}
          </div>
          {overdue.length === 0 ? (
            <div className="px-4 py-10 text-center text-slate-400 dark:text-slate-600 text-sm">No overdue tasks 🎉</div>
          ) : (
            <ul className="divide-y divide-slate-50 dark:divide-slate-800">
              {overdue.slice(0, 6).map(task => (
                <li key={task.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{task.title}</p>
                    <p className="text-xs text-red-500 shrink-0">Due {task.due_date}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <CategoryBadge category={task.category} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700/50">
            <Clock size={18} className="text-indigo-500 shrink-0" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Upcoming Tasks</h2>
            <Link to="/tasks" className="ml-auto text-xs text-indigo-500 hover:underline shrink-0">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-4 py-10 text-center text-slate-400 dark:text-slate-600 text-sm">No upcoming tasks</div>
          ) : (
            <ul className="divide-y divide-slate-50 dark:divide-slate-800">
              {upcoming.map(task => (
                <li key={task.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Due {task.due_date}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
