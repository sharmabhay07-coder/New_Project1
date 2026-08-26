export default function AdminTable({
  columns = [],
  data = [],
  emptyMessage = 'No records found',
}) {
  return (
    <div className="dash-card">
      <table className="dash-w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ textAlign: 'left' }}
                className="dash-p-3 dash-text-xs dash-font-semibold dash-text-muted-foreground dash-uppercase dash-tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: 'center' }}
                className="dash-p-6 dash-text-sm dash-text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index} className="dash-border-t dash-border-border">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="dash-p-3 dash-text-sm dash-text-foreground"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}