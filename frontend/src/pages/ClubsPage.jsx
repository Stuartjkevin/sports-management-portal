import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import ClubForm from '../components/ClubForm';
import SportBadge from '../components/SportBadge';
import StatusBadge from '../components/StatusBadge';
import AlertMessage from '../components/AlertMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import ErrorState from '../components/ErrorState';
import useApi from '../hooks/useApi';
import { clubService } from '../services/resourceServices';

export default function ClubsPage() {
  const { data: clubs, loading, error, reload } = useApi(() => clubService.list(), []);
  // formMode: null (hidden) | 'add' | a club object (editing)
  const [formMode, setFormMode] = useState(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);

  const editing = formMode && formMode !== 'add' ? formMode : null;

  // Errors thrown here are shown inside the form by useForm.
  const handleSave = async (data) => {
    if (editing) await clubService.update(editing.id, data);
    else await clubService.create(data);
    setNotice({ type: 'success', text: `"${data.name}" was ${editing ? 'updated' : 'added'}.` });
    setFormMode(null);
    reload();
  };

  const handleDelete = async (club) => {
    if (!window.confirm(`Delete ${club.name}?`)) return;
    try {
      await clubService.remove(club.id);
      setNotice({ type: 'success', text: `"${club.name}" was deleted.` });
      reload();
    } catch (err) {
      setNotice({ type: 'danger', text: err.message });
    }
  };

  const filtered = (clubs ?? []).filter((c) => `${c.name} ${c.city}`.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'name', label: 'Club', render: (c) => <span className="fw-semibold">{c.name}</span> },
    { key: 'city', label: 'City' },
    { key: 'founded', label: 'Founded' },
    { key: 'sports', label: 'Sports', render: (c) => <div className="d-flex flex-wrap gap-1">{c.sports.map((s) => <SportBadge key={s} sport={s} />)}</div> },
    { key: 'contactEmail', label: 'Contact' },
    { key: 'status', label: 'Status', render: (c) => <StatusBadge status={c.status} /> },
    {
      key: 'actions', label: '', className: 'text-end', render: (c) => (
        <div className="btn-group btn-group-sm">
          <button type="button" className="btn btn-outline-primary" onClick={() => setFormMode(c)} aria-label={`Edit ${c.name}`}><i className="bi bi-pencil" /></button>
          <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(c)} aria-label={`Delete ${c.name}`}><i className="bi bi-trash" /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Club Management"
        subtitle="Add, edit and remove clubs registered on the portal."
        actions={<button type="button" className="btn btn-navy" onClick={() => setFormMode('add')}><i className="bi bi-plus-lg me-1" />Add club</button>}
      />

      <AlertMessage message={notice?.text} type={notice?.type} onClose={() => setNotice(null)} />

      {formMode && (
        <div className="card mb-4">
          <div className="card-header">{editing ? `Edit ${editing.name}` : 'Add a new club'}</div>
          <div className="card-body">
            {/* key forces a fresh form when switching between add / different clubs */}
            <ClubForm key={editing?.id ?? 'new'} initialValues={editing} onSubmit={handleSave} onCancel={() => setFormMode(null)} />
          </div>
        </div>
      )}

      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : loading && !clubs ? (
        <LoadingPlaceholder variant="table" />
      ) : (
        <div className="card">
          <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span>All clubs ({filtered.length})</span>
            <input type="search" className="form-control form-control-sm" style={{ maxWidth: 240 }} placeholder="Search name or city" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <DataTable columns={columns} rows={filtered} emptyTitle="No clubs found" emptyMessage="Try a different search or add a new club." />
        </div>
      )}
    </>
  );
}
