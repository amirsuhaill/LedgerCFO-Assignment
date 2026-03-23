import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader, Building2 } from 'lucide-react';
import { getClient, getClientTasks } from '../api';
import TaskTable from '../components/TaskTable';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    Promise.all([getClient(id), getClientTasks(id)])
      .then(([c, t]) => { setClient(c); setTasks(t); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="animate-spin text-indigo-500" size={28} />
    </div>
  );

  if (!client) return <p className="text-slate-500">Client not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/clients" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors">
          <ArrowLeft size={15} /> Back to Clients
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Building2 size={22} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{client.company_name}</h1>
            <p className="text-slate-500 text-sm">{client.country} &middot; {client.entity_type}</p>
          </div>
        </div>
      </div>

      <TaskTable tasks={tasks} onRefresh={load} defaultClientId={client.id} clients={[client]} />
    </div>
  );
}
