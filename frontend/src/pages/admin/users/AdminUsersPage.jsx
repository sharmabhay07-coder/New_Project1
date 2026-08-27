import { useCallback, useEffect, useMemo, useState } from 'react'

import useAuth from '@/hooks/useAuth'
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from '@/lib/api/userApi'

import AdminTable from '../components/AdminTable'
import AdminUserEditModal from '../components/AdminUserEditModal'
import AdminDeleteConfirmModal from '../components/AdminDeleteConfirmModal'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

const actionButtonClass =
  'dash-rounded-lg dash-px-3 dash-py-1.5 dash-text-xs dash-font-bold dash-text-white dash-disabled:opacity-60 dash-transition-transform dash-hover:scale-105 dash-active:scale-95'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { token, user: currentUser } = useAuth()

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setUsers([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await getAdminUsers(token)
      setUsers(res.data?.users || [])
    } catch (err) {
      console.error('Failed to fetch admin users:', err)
      setUsers([])
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [token])

  const currentUserId = currentUser?._id || currentUser?.id

  const handleEdit = async (updates) => {
    if (!token || !editUser?._id) return

    setActionId(`edit:${editUser._id}`)
    setError('')

    try {
      await updateAdminUser(token, editUser._id, updates)
      setEditUser(null)
      await fetchUsers()
    } catch (err) {
      console.error('Failed to update admin user:', err)
      setError(err.message || 'Failed to update user')
    } finally {
      setActionId('')
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget?._id) return

    setActionId(`delete:${deleteTarget._id}`)
    setError('')

    try {
      await deleteAdminUser(token, deleteTarget._id)
      setDeleteTarget(null)
      await fetchUsers()
    } catch (err) {
      console.error('Failed to delete admin user:', err)
      setError(err.message || 'Failed to delete user')
    } finally {
      setActionId('')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [fetchUsers])

  const rows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return users
      .filter((user) => {
        if (!query) return true

        return [user.name, user.email]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      })
      .map((user) => ({
        id: user._id,
        name: user.name || 'Unnamed user',
        email: user.email || 'No email',
        role: user.role || 'user',
      }))
  }, [searchQuery, users])

  return (
    <div className="dash-page dash-space-y-6">
      <div>
        <h1 className="dash-text-2xl dash-p-3 dash-font-bold dash-text-foreground">
          Users
        </h1>
      </div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="dash-w-full dash-rounded-xl dash-border dash-border-border dash-bg-background dash-px-4 dash-py-2.5 dash-text-sm dash-text-foreground dash-focus:border-primary/50 dash-outline-none dash-focus:ring-2 dash-focus:ring-primary/20"
      />

      {error ? (
        <div className="dash-rounded-2xl dash-border dash-border-destructive dash-bg-background dash-p-4 dash-text-sm dash-text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="dash-card dash-p-6 dash-space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="dash-flex dash-items-center dash-gap-3 dash-animate-pulse"
            >
              <div className="dash-flex-1 dash-space-y-2">
                <div className="dash-h-4 dash-w-64 dash-rounded-lg dash-bg-muted" />
                <div className="dash-h-3 dash-w-40 dash-rounded-lg dash-bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={rows}
          emptyMessage="No users found"
          actions={[
            {
              key: 'edit',
              label: 'Edit',
              className: `${actionButtonClass} dash-bg-primary`,
              isDisabled: (row) => Boolean(actionId),
              onClick: (row) => {
                setEditUser(users.find((user) => user._id === row.id))
              },
            },
            {
              key: 'delete',
              label: 'Delete',
              className: `${actionButtonClass} dash-bg-destructive`,
              isDisabled: (row) => row.id === currentUserId || Boolean(actionId),
              onClick: (row) => {
                setDeleteTarget(users.find((user) => user._id === row.id))
              },
            },
          ]}
        />
      )}

      <AdminUserEditModal
        user={editUser}
        isOpen={Boolean(editUser)}
        disableRole={editUser?._id === currentUserId}
        onSave={handleEdit}
        onCancel={() => setEditUser(null)}
      />

      <AdminDeleteConfirmModal
        title="Delete user"
        message={
          <>
            Are you sure you want to delete <strong className="dash-text-foreground">{deleteTarget?.name || 'this user'}</strong>
            {deleteTarget?.email ? ` (${deleteTarget.email})` : ''}? This action cannot be undone.
          </>
        }
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}