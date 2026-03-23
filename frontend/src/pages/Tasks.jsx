import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { getTasks } from '../api';
import TaskTable from '../components/TaskTable';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => getTasks().then(setTasks).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="animate-spin text-indigo-500" size={28} />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
      <p className="text-red-500 font-medium">Could not connect to backend</p>
      <p className="text-slate-400 text-sm">{error}</p>
      <p className="text-slate-400 text-xs">Make sure the backend is running on <code className="bg-slate-100 px-1 rounded">http://localhost:3001</code></p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">All Tasks</h1>
        <p className="text-slate-500 text-sm mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''} across all clients</p>
      </div>
      <TaskTable tasks={tasks} onRefresh={load} showClientCol={true} />
    </div>
  );
}
