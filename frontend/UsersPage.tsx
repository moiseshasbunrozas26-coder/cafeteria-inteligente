import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from './api';
import './UsersPage.css';

type UserRole = 'ADMIN' | 'STAFF';

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersPageProps {
  accessToken: string;
  currentUserId: number;
  canManage: boolean;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const initialForm: UserForm = {
  name: '',
  email: '',
  password: '',
  role: 'STAFF',
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  STAFF: 'Trabajador',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function UsersPage({
  accessToken,
  currentUserId,
  canManage,
}: UsersPageProps) {
  const [users, setUsers] =
    useState<UserAccount[]>([]);

  const [form, setForm] =
    useState<UserForm>(initialForm);

  const [filter, setFilter] =
    useState<'ALL' | 'ACTIVE' | 'INACTIVE' | UserRole>('ALL');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const loadUsers = useCallback(async () => {
    if (!canManage) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await apiRequest<UserAccount[]>(
        '/users',
        accessToken,
      );

      setUsers(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar los usuarios.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, canManage]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const summary = useMemo(
    () => ({
      total: users.length,
      active: users.filter(
        (user) => user.active,
      ).length,
      admins: users.filter(
        (user) =>
          user.role === 'ADMIN' &&
          user.active,
      ).length,
      staff: users.filter(
        (user) =>
          user.role === 'STAFF' &&
          user.active,
      ).length,
    }),
    [users],
  );

  const visibleUsers = useMemo(
    () =>
      users.filter((user) => {
        if (filter === 'ALL') {
          return true;
        }

        if (filter === 'ACTIVE') {
          return user.active;
        }

        if (filter === 'INACTIVE') {
          return !user.active;
        }

        return user.role === filter;
      }),
    [filter, users],
  );

  function updateForm(
    field: keyof UserForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createUser(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (form.name.trim().length < 2) {
      setError(
        'El nombre debe tener al menos 2 caracteres.',
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        'Debes ingresar un correo electrónico.',
      );
      return;
    }

    if (form.password.length < 8) {
      setError(
        'La contraseña debe tener al menos 8 caracteres.',
      );
      return;
    }

    setSaving(true);

    try {
      const created =
        await apiRequest<UserAccount>(
          '/users',
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify({
              name: form.name.trim(),
              email:
                form.email.trim().toLowerCase(),
              password: form.password,
              role: form.role,
            }),
          },
        );

      setSuccess(
        `Usuario “${created.name}” creado correctamente.`,
      );

      setForm(initialForm);
      setShowPassword(false);

      await loadUsers();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible crear el usuario.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(
    user: UserAccount,
    role: UserRole,
  ) {
    if (user.id === currentUserId) {
      setError(
        'No puedes cambiar el rol de tu propia cuenta.',
      );
      return;
    }

    setProcessingId(user.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<UserAccount>(
        `/users/${user.id}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({
            role,
          }),
        },
      );

      setSuccess(
        `El rol de ${user.name} fue actualizado a ${roleLabels[role]}.`,
      );

      await loadUsers();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cambiar el rol.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function toggleActive(
    user: UserAccount,
  ) {
    if (user.id === currentUserId) {
      setError(
        'No puedes desactivar tu propia cuenta.',
      );
      return;
    }

    const action =
      user.active ? 'desactivar' : 'reactivar';

    const confirmed = window.confirm(
      `¿Deseas ${action} la cuenta de ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(user.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<UserAccount>(
        `/users/${user.id}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({
            active: !user.active,
          }),
        },
      );

      setSuccess(
        user.active
          ? `La cuenta de ${user.name} fue desactivada.`
          : `La cuenta de ${user.name} fue reactivada.`,
      );

      await loadUsers();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible actualizar el estado.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (!canManage) {
    return (
      <>
        <header className="topbar">
          <div>
            <p className="eyebrow">
              Panel administrativo
            </p>

            <h2>👥 Usuarios</h2>

            <p>
              Administración de cuentas y
              permisos del sistema.
            </p>
          </div>
        </header>

        <section className="panel users-page-denied">
          <strong>
            Acceso restringido
          </strong>

          <p>
            Solo los administradores pueden
            consultar y modificar usuarios.
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>👥 Usuarios</h2>

          <p>
            Crea cuentas, asigna roles y
            controla el acceso del personal.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading}
        >
          {loading
            ? 'Actualizando...'
            : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="users-page-message users-page-error">
          <strong>
            No fue posible completar la operación
          </strong>

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="users-page-message users-page-success">
          <strong>
            Operación completada
          </strong>

          <span>{success}</span>
        </div>
      )}

      <section className="users-page-summary-grid">
        <article className="users-page-summary-card">
          <span>Cuentas registradas</span>
          <strong>{summary.total}</strong>
          <small>Total de usuarios</small>
        </article>

        <article className="users-page-summary-card">
          <span>Cuentas activas</span>
          <strong>{summary.active}</strong>
          <small>Con acceso al sistema</small>
        </article>

        <article className="users-page-summary-card">
          <span>Administradores</span>
          <strong>{summary.admins}</strong>
          <small>Administradores activos</small>
        </article>

        <article className="users-page-summary-card">
          <span>Trabajadores</span>
          <strong>{summary.staff}</strong>
          <small>Personal activo</small>
        </article>
      </section>

      <section className="users-page-layout">
        <article className="panel users-page-form-panel">
          <div className="panel-header">
            <div>
              <h3>Nueva cuenta</h3>

              <p>
                Crea el acceso para un
                trabajador o administrador.
              </p>
            </div>
          </div>

          <form
            className="users-page-form"
            onSubmit={createUser}
          >
            <label>
              <span>Nombre completo *</span>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateForm(
                    'name',
                    event.target.value,
                  )
                }
                maxLength={80}
                autoComplete="off"
                disabled={saving}
              />
            </label>

            <label>
              <span>Correo electrónico *</span>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateForm(
                    'email',
                    event.target.value,
                  )
                }
                maxLength={120}
                autoComplete="off"
                disabled={saving}
              />
            </label>

            <label>
              <span>Contraseña temporal *</span>

              <div className="users-page-password-field">
                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={form.password}
                  onChange={(event) =>
                    updateForm(
                      'password',
                      event.target.value,
                    )
                  }
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  disabled={saving}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                >
                  {showPassword
                    ? 'Ocultar'
                    : 'Mostrar'}
                </button>
              </div>

              <small>
                Mínimo 8 caracteres.
              </small>
            </label>

            <label>
              <span>Rol inicial</span>

              <select
                value={form.role}
                onChange={(event) =>
                  updateForm(
                    'role',
                    event.target.value as UserRole,
                  )
                }
                disabled={saving}
              >
                <option value="STAFF">
                  Trabajador
                </option>

                <option value="ADMIN">
                  Administrador
                </option>
              </select>
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Creando...'
                : '+ Crear usuario'}
            </button>
          </form>
        </article>

        <article className="panel users-page-list-panel">
          <div className="users-page-list-header">
            <div>
              <h3>Personal registrado</h3>

              <p>
                Revisa roles y estados de
                acceso.
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value as
                    | 'ALL'
                    | 'ACTIVE'
                    | 'INACTIVE'
                    | UserRole,
                )
              }
            >
              <option value="ALL">
                Todas las cuentas
              </option>

              <option value="ACTIVE">
                Activas
              </option>

              <option value="INACTIVE">
                Inactivas
              </option>

              <option value="ADMIN">
                Administradores
              </option>

              <option value="STAFF">
                Trabajadores
              </option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state">
              Cargando usuarios...
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="empty-state">
              No hay cuentas que coincidan
              con este filtro.
            </div>
          ) : (
            <div className="users-page-card-list">
              {visibleUsers.map((user) => {
                const isCurrentUser =
                  user.id === currentUserId;

                const isProcessing =
                  processingId === user.id;

                return (
                  <article
                    className={`users-page-user-card ${
                      user.active
                        ? ''
                        : 'users-page-user-inactive'
                    }`}
                    key={user.id}
                  >
                    <div className="users-page-avatar">
                      {initials(user.name)}
                    </div>

                    <div className="users-page-user-main">
                      <div className="users-page-user-heading">
                        <div>
                          <strong>
                            {user.name}
                          </strong>

                          {isCurrentUser && (
                            <span className="users-page-current-badge">
                              Tu cuenta
                            </span>
                          )}

                          <small>
                            {user.email}
                          </small>
                        </div>

                        <span
                          className={`users-page-state ${
                            user.active
                              ? 'active'
                              : 'inactive'
                          }`}
                        >
                          {user.active
                            ? 'Activa'
                            : 'Inactiva'}
                        </span>
                      </div>

                      <div className="users-page-user-meta">
                        <span>
                          Creada el{' '}
                          {formatDate(
                            user.createdAt,
                          )}
                        </span>
                      </div>

                      <div className="users-page-user-actions">
                        <label>
                          <span>Rol</span>

                          <select
                            value={user.role}
                            onChange={(event) =>
                              void updateRole(
                                user,
                                event.target
                                  .value as UserRole,
                              )
                            }
                            disabled={
                              isCurrentUser ||
                              isProcessing
                            }
                          >
                            <option value="STAFF">
                              Trabajador
                            </option>

                            <option value="ADMIN">
                              Administrador
                            </option>
                          </select>
                        </label>

                        <button
                          className={
                            user.active
                              ? 'users-page-deactivate-button'
                              : 'users-page-reactivate-button'
                          }
                          type="button"
                          onClick={() =>
                            void toggleActive(user)
                          }
                          disabled={
                            isCurrentUser ||
                            isProcessing
                          }
                        >
                          {isProcessing
                            ? 'Procesando...'
                            : user.active
                              ? 'Desactivar'
                              : 'Reactivar'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </article>
      </section>
    </>
  );
}
