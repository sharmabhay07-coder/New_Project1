export default function AdminTable({
  columns = [],
  data = [],
  emptyMessage = 'No records found',
  actions = [],
}) {
  const visibleActionCount = actions.length
  const columnCount = columns.length + (visibleActionCount ? 1 : 0)

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
            {visibleActionCount ? (
              <th
                style={{ textAlign: 'left' }}
                className="dash-p-3 dash-text-xs dash-font-semibold dash-text-muted-foreground dash-uppercase dash-tracking-wider"
              >
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
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
                {visibleActionCount ? (
                  <td className="dash-p-3 dash-text-sm dash-text-foreground">
                    <div className="dash-flex dash-flex-wrap dash-gap-2">
                      {actions
                        .filter((action) =>
                          action.isVisible ? action.isVisible(row) : true
                        )
                        .map((action) => (
                          <button
                            key={action.key}
                            type="button"
                            disabled={
                              action.isDisabled
                                ? action.isDisabled(row)
                                : false
                            }
                            onClick={() => action.onClick(row)}
                            className={action.className}
                          >
                            {action.label}
                          </button>
                        ))}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
