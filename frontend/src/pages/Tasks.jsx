import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { getTasks } from '../api';
import TaskTable from '../components/TaskTable';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getTasks().then(setTasks).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="animate-spin text-indigo-500" size={28} />
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
