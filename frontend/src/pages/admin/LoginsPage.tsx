import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { deleteAdminUser, getAdminUsers, updateAdminUserRole } from '../../api/adminUsersApi';
import type { AdminUserListItem, AppUserRole } from '../../types/adminUser';

function primaryAppRole(roles: string[]): AppUserRole {
  if (roles.includes('Admin')) return 'Admin';
  return 'Donor';
}

export default function LoginsPage() {
  const { authSession } = useAuth();
  const currentUserId = authSession.userId ?? null;

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<Record<string, AppUserRole>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAdminUsers()
      .then((list) => {
        setUsers(list);
        const initial: Record<string, AppUserRole> = {};
        for (const u of list) {
          initial[u.id] = primaryAppRole(u.roles);
        }
        setPendingRole(initial);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unable to load users.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectCls = `px-3 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-700
    hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-haven-teal-500 focus:border-transparent`;

  function handleSaveRole(user: AdminUserListItem) {
    const role = pendingRole[user.id];
    if (!role || role === primaryAppRole(user.roles)) return;
    setSavingId(user.id);
    setError(null);
    updateAdminUserRole(user.id, role)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, roles: [role] } : u)),
        );
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unable to update role.');
      })
      .finally(() => setSavingId(null));
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    deleteAdminUser(deleteTarget.id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      })
      .catch((e: unknown) => {
        setDeleteError(e instanceof Error ? e.message : 'Unable to delete user.');
      });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
        Loading accounts…
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <p className="text-sm text-stone-600 mb-6 max-w-2xl">
        Staff and donor sign-ins created through registration or the staff portal. Use role updates
        carefully; at least one admin must remain.
      </p>

      {error && (
        <div
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Password login</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 w-40" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                    No user accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const effective = pendingRole[u.id] ?? primaryAppRole(u.roles);
                  const unchanged = effective === primaryAppRole(u.roles);
                  const isSelf = currentUserId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/80">
                      <td className="px-4 py-3 text-stone-900 font-medium">
                        {u.userName ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-stone-700">{u.email ?? '—'}</td>
                      <td className="px-4 py-3 text-stone-600">
                        {u.hasPassword ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className={selectCls}
                          value={effective}
                          onChange={(e) =>
                            setPendingRole((p) => ({
                              ...p,
                              [u.id]: e.target.value as AppUserRole,
                            }))
                          }
                          aria-label={`Role for ${u.userName ?? u.email ?? u.id}`}
                        >
                          <option value="Donor">Donor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={unchanged || savingId === u.id}
                          onClick={() => handleSaveRole(u)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-haven-teal-600 text-white hover:bg-haven-teal-700 disabled:opacity-40
                            disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-haven-teal-500 focus-visible:ring-offset-2"
                        >
                          {savingId === u.id ? 'Saving…' : 'Update role'}
                        </button>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget(u);
                          }}
                          title={isSelf ? 'You cannot delete your own account' : undefined}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
                            border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-40
                            disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-rose-400 focus-visible:ring-offset-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-stone-900/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
        >
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full border border-stone-200 p-6">
            <h2 id="delete-user-title" className="text-lg font-semibold text-stone-900 mb-2">
              Delete account
            </h2>
            <p className="text-sm text-stone-600 mb-4">
              Permanently delete{' '}
              <span className="font-medium text-stone-800">
                {deleteTarget.userName ?? deleteTarget.email ?? 'this user'}
              </span>
              ? This cannot be undone.
            </p>
            {deleteError && (
              <p className="text-sm text-rose-700 mb-3" role="alert">
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-teal-500
                  focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white
                  hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              >
                Delete user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
