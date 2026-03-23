import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ChevronRight, Loader, Building2, Search } from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient } from '../api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const EMPTY_FORM = { company_name: '', country: '', entity_type: '' };

const inputCls = "w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent";
const labelCls = "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1";

function ClientForm({ initial = EMPTY_FORM, onSubmit, loading, submitLabel }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className={labelCls}>Company Name</label>
        <input required value={form.company_name} onChange={set('company_name')} className={inputCls} placeholder="e.g. Apex Ventures Ltd" />
      </div>
      <div>
        <label className={labelCls}>Country</label>
        <input required value={form.country} onChange={set('country')} className={inputCls} placeholder="e.g. United Kingdom" />
      </div>
      <div>
        <label className={labelCls}>Entity Type</label>
        <input required value={form.entity_type} onChange={set('entity_type')} className={inputCls} placeholder="e.g. Pvt Ltd, LLC, Partnership" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => getClients().then(setClients).catch(e => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = clients.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (form) => {
    setSaving(true);
    try { await createClient(form); setShowCreate(false); load(); } finally { setSaving(false); }
  };
  const handleUpdate = async (form) => {
    setSaving(true);
    try { await updateClient(editing.id, form); setEditing(null); load(); } finally { setSaving(false); }
  };
  const handleDelete = async () => {
    setSaving(true);
    try { await deleteClient(deleting.id); setDeleting(null); load(); } finally { setSaving(false); }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Clients</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{clients.length} client{clients.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <Plus size={16} /> Add Client
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-600">
          <Building2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No clients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
            <div key={client.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-indigo-500" />
                </div>
                <div className="flex gap-1 ml-auto">
                  <button onClick={() => setEditing(client)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleting(client)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">{client.company_name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{client.country}</p>
                <span className="inline-block mt-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">{client.entity_type}</span>
              </div>
              <Link to={`/clients/${client.id}`}
                className="mt-4 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                View tasks <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Add New Client" onClose={() => setShowCreate(false)}>
          <ClientForm onSubmit={handleCreate} loading={saving} submitLabel="Create Client" />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Client" onClose={() => setEditing(null)}>
          <ClientForm initial={editing} onSubmit={handleUpdate} loading={saving} submitLabel="Save Changes" />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete Client"
          message={`Are you sure you want to delete "${deleting.company_name}"? All associated tasks will also be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={saving}
        />
      )}
    </div>
  );
}
