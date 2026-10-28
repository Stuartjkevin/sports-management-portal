import EmptyState from './EmptyState';

// Reusable table.
// columns: [{ key, label, render?(row, index), className? }]
// rows:    array of objects with a unique id (or the key given in rowKey)
export default function DataTable({ columns, rows, rowKey = 'id', emptyTitle = 'No records found', emptyMessage, onRowClick, activeKey }) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`${onRowClick ? 'cursor-pointer' : ''} ${activeKey === row[rowKey] ? 'table-active' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.className}>{col.render ? col.render(row, index) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
