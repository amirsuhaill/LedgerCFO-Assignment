const STATUS_STYLES = {
  'Pending': 'bg-amber-100 text-amber-700 border border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  'Completed': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const PRIORITY_STYLES = {
  'High': 'bg-red-100 text-red-700 border border-red-200',
  'Medium': 'bg-orange-100 text-orange-700 border border-orange-200',
  'Low': 'bg-slate-100 text-slate-600 border border-slate-200',
};

const CATEGORY_STYLES = {
  'Tax': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Filing': 'bg-cyan-100 text-cyan-700 border border-cyan-200',
  'Audit': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  'Payroll': 'bg-teal-100 text-teal-700 border border-teal-200',
  'Legal': 'bg-rose-100 text-rose-700 border border-rose-200',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[category] || 'bg-gray-100 text-gray-600'}`}>
      {category}
    </span>
  );
}
