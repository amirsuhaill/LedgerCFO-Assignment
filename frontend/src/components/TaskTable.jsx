import { useState } from 'react';
import { Plus, Pencil, Trash2, ClipboardList, ChevronDown } from 'lucide-react';
import { createTask, updateTask, deleteTask, getClients } from '../api';
import { StatusBadge, PriorityBadge, CategoryBadge } from './Badge';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { useEffect } from 'react';

const CATEGORIES = ['Tax', 'Filing', 'Audit', 'Payroll', 'Legal'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const EMPTY_FORM = {
  client_id: '', title: '', description: '', category: 'Tax',
  due_date: '', status: 'Pending', priority: 'Medium',
};

function TaskForm({ initial, onSubmit, loading, submitLabel, clients, fixedClientId }) {
  const [form, setForm] = useState(initial || { ...EMPTY_FORM, client_id: fixedClientId || '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      {!fixedClientId && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Client</label>
          <select required value={form.client_id} onChange={set('client_id')}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            <option value="">Select a client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
        <input required value={form.title} onChange={set('title')}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Task title" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea value={form.description} onChange={set('description')} rows={2}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          placeholder="Optional description" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select value={form.category} onChange={set('category')}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
          <input required type="date" value={form.due_date} onChange={set('due_date')}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select value={form.status} onChange={set('status')}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
          <select value={form.priority} onChange={set('priority')}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

function isOverdue(due_date, status) {
  return status !== 'Completed' && new Date(due_date) < new Date(new Date().toDateString());
}

export default function TaskTable({ tasks, onRefresh, defaultClientId, clients: propClients, showClientCol = false }) {
  const [clients, setClients] = useState(propClients || []);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!propClients) getClients().then(setClients);
  }, [propClients]);

  const filtered = tasks.filter(t =>
    (!filterStatus || t.status === filterStatus) &&
    (!filterCategory || t.category === filterCategory)
  );

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await createTask({ ...form, client_id: Number(form.client_id) });
      setShowCreate(false);
      onRefresh();
    } finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await updateTask(editing.id, form);
      setEditing(null);
      onRefresh();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteTask(deleting.id);
      setDeleting(null);
      onRefresh();
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ClipboardList size={16} className="text-indigo-500" />
          Tasks
          <span className="text-slate-400 font-normal">({filtered.length})</span>
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Task
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <ClipboardList size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tasks found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                {showClientCol && <th className="text-left px-5 py-3 font-medium">Client</th>}
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Due Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(task => {
                const overdue = isOverdue(task.due_date, task.status);
                const clientName = clients.find(c => c.id === task.client_id)?.company_name;
                return (
                  <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-700 leading-tight">{task.title}</p>
                      {task.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{task.description}</p>}
                    </td>
                    {showClientCol && (
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{clientName || '—'}</td>
                    )}
                    <td className="px-5 py-3.5"><CategoryBadge category={task.category} /></td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-slate-500'}`}>
                        {overdue && '⚠ '}{task.due_date}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={task.status} /></td>
                    <td className="px-5 py-3.5"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setEditing(task)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleting(task)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <Modal title="Add New Task" onClose={() => setShowCreate(false)}>
          <TaskForm
            onSubmit={handleCreate}
            loading={saving}
            submitLabel="Create Task"
            clients={clients}
            fixedClientId={defaultClientId}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Task" onClose={() => setEditing(null)}>
          <TaskForm
            initial={editing}
            onSubmit={handleUpdate}
            loading={saving}
            submitLabel="Save Changes"
            clients={clients}
            fixedClientId={defaultClientId}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete Task"
          message={`Delete "${deleting.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={saving}
        />
      )}
    </div>
  );
}
