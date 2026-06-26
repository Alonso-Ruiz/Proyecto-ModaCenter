import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/common/AdminLayout';
import UserForm from '../../components/users/UserForm';
import UserTable from '../../components/users/UserTable';
import { createUser, deleteUser, getUsers, updateUser } from '../../services/userService';
import {
  emptyUserForm,
  mapUserToForm,
  normalizeUserPayload,
  userRoleOptions,
  validateUser,
} from '../../validations/userValidation';

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [view, setView] = useState('list');
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyUserForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setServiceError('');
      setUsers(await getUsers());
    } catch (error) {
      setUsers([]);
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text = `${user.name} ${user.email} ${user.phone} ${user.role}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase().trim());
      const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  function openCreateForm() {
    setEditingUser(null);
    setForm(emptyUserForm);
    setErrors({});
    setNotice('');
    setView('form');
  }

  function openEditForm(user) {
    setEditingUser(user);
    setForm(mapUserToForm(user));
    setErrors({});
    setNotice('');
    setView('form');
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateUser(form, users, editingUser?.id);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    try {
      const payload = normalizeUserPayload(form);
      const savedUser = editingUser ? await updateUser(editingUser.id, payload) : await createUser(payload);

      setUsers((current) =>
        editingUser ? current.map((user) => (user.id === editingUser.id ? savedUser : user)) : [savedUser, ...current],
      );
      setNotice(editingUser ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.');
      setServiceError('');
      setView('list');
    } catch (error) {
      setServiceError(error.message);
    }
  }

  async function handleDelete(user) {
    const shouldDelete = window.confirm(`Eliminar "${user.name}"?`);
    if (!shouldDelete) return;

    try {
      await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setNotice('Usuario eliminado correctamente.');
      setServiceError('');
    } catch (error) {
      setServiceError(error.message);
    }
  }

  return (
    <AdminLayout active="users">
      <div className="mx-auto flex min-h-full max-w-[1220px] flex-col gap-4">
        {view === 'list' ? (
          <>
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-950">Usuarios</h1>
                {notice ? <p className="mt-1 text-sm text-emerald-700">{notice}</p> : null}
                {serviceError ? <p className="mt-1 text-sm text-rose-600">{serviceError}</p> : null}
              </div>
              <button type="button" onClick={openCreateForm} className="btn-primary h-11">
                + Nuevo Usuario
              </button>
            </header>

            <section className="flex flex-col gap-3 lg:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500"
                placeholder="Buscar usuario..."
              />
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="filter-input">
                <option>Todos</option>
                {userRoleOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </section>

            {loading ? <p className="text-sm text-slate-500">Cargando usuarios...</p> : <UserTable users={filteredUsers} onEdit={openEditForm} onDelete={handleDelete} />}
          </>
        ) : (
          <UserForm
            title={editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
            form={form}
            errors={errors}
            isEditing={Boolean(editingUser)}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onCancel={() => setView('list')}
          />
        )}
      </div>
    </AdminLayout>
  );
}
