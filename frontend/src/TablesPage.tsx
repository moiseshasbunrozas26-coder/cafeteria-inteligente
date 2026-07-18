import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from './api';
import './TablesPage.css';

type TableStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'OUT_OF_SERVICE';

interface CafeTable {
  id: number;
  number: number;
  capacity: number;
  status: TableStatus;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TablesPageProps {
  accessToken: string;
  canCreateDelete: boolean;
  canUpdate: boolean;
  onTablesChanged?: () => void;
}

interface TableForm {
  number: string;
  capacity: string;
  status: TableStatus;
}

const initialForm: TableForm = {
  number: '',
  capacity: '4',
  status: 'AVAILABLE',
};

const statusLabels: Record<TableStatus, string> = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Ocupada',
  RESERVED: 'Reservada',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

const statusDescriptions: Record<TableStatus, string> = {
  AVAILABLE: 'Lista para recibir clientes',
  OCCUPIED: 'Actualmente en uso',
  RESERVED: 'Apartada para una reserva',
  OUT_OF_SERVICE: 'No disponible temporalmente',
};

export function TablesPage({
  accessToken,
  canCreateDelete,
  canUpdate,
  onTablesChanged,
}: TablesPageProps) {
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [form, setForm] = useState<TableForm>(initialForm);
  const [filter, setFilter] = useState<'ALL' | TableStatus>('ALL');
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNumber, setEditingNumber] = useState('');
  const [editingCapacity, setEditingCapacity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTables = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await apiRequest<CafeTable[]>(
        '/tables',
        accessToken,
      );

      setTables(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar las mesas.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadTables();
  }, [loadTables]);

  const activeTables = useMemo(
    () => tables.filter((table) => table.active),
    [tables],
  );

  const counts = useMemo(
    () => ({
      total: activeTables.length,
      available: activeTables.filter(
        (table) => table.status === 'AVAILABLE',
      ).length,
      occupied: activeTables.filter(
        (table) => table.status === 'OCCUPIED',
      ).length,
      reserved: activeTables.filter(
        (table) => table.status === 'RESERVED',
      ).length,
    }),
    [activeTables],
  );

  const visibleTables = useMemo(
    () =>
      tables.filter((table) => {
        if (!showInactive && !table.active) {
          return false;
        }

        if (filter !== 'ALL' && table.status !== filter) {
          return false;
        }

        return true;
      }),
    [filter, showInactive, tables],
  );

  function updateForm(
    field: keyof TableForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createTable(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const number = Number(form.number);
    const capacity = Number(form.capacity);

    setError('');
    setSuccess('');

    if (!Number.isInteger(number) || number < 1) {
      setError('El número de mesa debe ser un entero mayor que 0.');
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError('La capacidad debe ser un entero mayor que 0.');
      return;
    }

    setSaving(true);

    try {
      await apiRequest<CafeTable>(
        '/tables',
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            number,
            capacity,
            status: form.status,
            active: true,
          }),
        },
      );

      setSuccess(`Mesa ${number} creada correctamente.`);
      setForm(initialForm);

      await loadTables();
      onTablesChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible crear la mesa.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    table: CafeTable,
    status: TableStatus,
  ) {
    setProcessingId(table.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<CafeTable>(
        `/tables/${table.id}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );

      setSuccess(
        `Mesa ${table.number} actualizada a “${statusLabels[status]}”.`,
      );

      await loadTables();
      onTablesChanged?.();
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

  function beginEdit(table: CafeTable) {
    setEditingId(table.id);
    setEditingNumber(table.number.toString());
    setEditingCapacity(table.capacity.toString());
    setError('');
    setSuccess('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingNumber('');
    setEditingCapacity('');
  }

  async function saveEdit(table: CafeTable) {
    const number = Number(editingNumber);
    const capacity = Number(editingCapacity);

    if (!Number.isInteger(number) || number < 1) {
      setError('El número de mesa debe ser un entero mayor que 0.');
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError('La capacidad debe ser un entero mayor que 0.');
      return;
    }

    setProcessingId(table.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<CafeTable>(
        `/tables/${table.id}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({
            number,
            capacity,
          }),
        },
      );

      setSuccess(`Mesa ${number} actualizada correctamente.`);
      cancelEdit();

      await loadTables();
      onTablesChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible editar la mesa.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function deactivateTable(table: CafeTable) {
    const confirmed = window.confirm(
      `¿Deseas desactivar la mesa ${table.number}? Quedará fuera de servicio.`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(table.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<CafeTable>(
        `/tables/${table.id}`,
        accessToken,
        {
          method: 'DELETE',
        },
      );

      setSuccess(`Mesa ${table.number} desactivada correctamente.`);

      await loadTables();
      onTablesChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible desactivar la mesa.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function reactivateTable(table: CafeTable) {
    setProcessingId(table.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<CafeTable>(
        `/tables/${table.id}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({
            active: true,
            status: 'AVAILABLE',
          }),
        },
      );

      setSuccess(`Mesa ${table.number} reactivada correctamente.`);

      await loadTables();
      onTablesChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible reactivar la mesa.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Panel administrativo</p>
          <h2>🪑 Mesas</h2>
          <p>
            Controla la capacidad, disponibilidad y estado de las
            mesas de la cafetería.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => void loadTables()}
          disabled={loading}
        >
          {loading ? 'Actualizando...' : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="tables-message tables-error">
          <strong>No fue posible completar la operación</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="tables-message tables-success">
          <strong>Operación completada</strong>
          <span>{success}</span>
        </div>
      )}

      <section className="tables-summary-grid">
        <article className="tables-summary-card">
          <span>Mesas activas</span>
          <strong>{counts.total}</strong>
          <small>Registradas en la cafetería</small>
        </article>

        <article className="tables-summary-card">
          <span>Disponibles</span>
          <strong>{counts.available}</strong>
          <small>Listas para recibir clientes</small>
        </article>

        <article className="tables-summary-card">
          <span>Ocupadas</span>
          <strong>{counts.occupied}</strong>
          <small>Actualmente en uso</small>
        </article>

        <article className="tables-summary-card">
          <span>Reservadas</span>
          <strong>{counts.reserved}</strong>
          <small>Separadas para reservas</small>
        </article>
      </section>

      <section className="tables-layout">
        {canCreateDelete && (
          <article className="panel tables-create-panel">
            <div className="panel-header">
              <div>
                <h3>Nueva mesa</h3>
                <p>Registra su número, capacidad y estado inicial.</p>
              </div>
            </div>

            <form className="tables-form" onSubmit={createTable}>
              <label>
                <span>Número de mesa *</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.number}
                  onChange={(event) =>
                    updateForm('number', event.target.value)
                  }
                  placeholder="Ejemplo: 5"
                  disabled={saving}
                />
              </label>

              <label>
                <span>Capacidad *</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.capacity}
                  onChange={(event) =>
                    updateForm('capacity', event.target.value)
                  }
                  disabled={saving}
                />
              </label>

              <label>
                <span>Estado inicial</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm('status', event.target.value)
                  }
                  disabled={saving}
                >
                  {Object.entries(statusLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Creando...' : '+ Crear mesa'}
              </button>
            </form>
          </article>
        )}

        <article className="panel tables-list-panel">
          <div className="tables-list-heading">
            <div>
              <h3>Estado de las mesas</h3>
              <p>Actualiza rápidamente la operación del salón.</p>
            </div>

            <div className="tables-filters">
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as 'ALL' | TableStatus,
                  )
                }
              >
                <option value="ALL">Todos los estados</option>
                {Object.entries(statusLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>

              {canCreateDelete && (
                <label className="tables-inactive-toggle">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(event) =>
                      setShowInactive(event.target.checked)
                    }
                  />
                  Mostrar inactivas
                </label>
              )}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Cargando mesas...</div>
          ) : visibleTables.length === 0 ? (
            <div className="empty-state">
              No hay mesas que coincidan con este filtro.
            </div>
          ) : (
            <div className="tables-card-grid">
              {visibleTables.map((table) => {
                const isEditing = editingId === table.id;
                const isProcessing = processingId === table.id;

                return (
                  <article
                    className={`cafetable-card cafetable-${table.status.toLowerCase()} ${
                      table.active ? '' : 'cafetable-inactive'
                    }`}
                    key={table.id}
                  >
                    <div className="cafecafetable-card-top">
                      <div className="cafetable-number">
                        <span>Mesa</span>
                        <strong>{table.number}</strong>
                      </div>

                      <span
                        className={`cafetable-status cafetable-status-${table.status.toLowerCase()}`}
                      >
                        {statusLabels[table.status]}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="cafetable-edit-grid">
                        <label>
                          <span>Número</span>
                          <input
                            type="number"
                            min="1"
                            value={editingNumber}
                            onChange={(event) =>
                              setEditingNumber(event.target.value)
                            }
                          />
                        </label>

                        <label>
                          <span>Capacidad</span>
                          <input
                            type="number"
                            min="1"
                            value={editingCapacity}
                            onChange={(event) =>
                              setEditingCapacity(event.target.value)
                            }
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="cafetable-capacity">
                        <span>👥</span>
                        <div>
                          <strong>{table.capacity} personas</strong>
                          <small>{statusDescriptions[table.status]}</small>
                        </div>
                      </div>
                    )}

                    {table.active && canUpdate && (
                      <label className="cafecafetable-status-selector">
                        <span>Cambiar estado</span>
                        <select
                          value={table.status}
                          onChange={(event) =>
                            void updateStatus(
                              table,
                              event.target.value as TableStatus,
                            )
                          }
                          disabled={isProcessing || isEditing}
                        >
                          {Object.entries(statusLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </label>
                    )}

                    <div className="cafecafetable-card-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="cafetable-save-button"
                            type="button"
                            onClick={() => void saveEdit(table)}
                            disabled={isProcessing}
                          >
                            Guardar
                          </button>

                          <button
                            className="cafetable-cancel-button"
                            type="button"
                            onClick={cancelEdit}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          {canUpdate && table.active && (
                            <button
                              className="cafetable-edit-button"
                              type="button"
                              onClick={() => beginEdit(table)}
                              disabled={isProcessing}
                            >
                              Editar
                            </button>
                          )}

                          {canCreateDelete && table.active && (
                            <button
                              className="cafetable-deactivate-button"
                              type="button"
                              onClick={() => void deactivateTable(table)}
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? 'Procesando...'
                                : 'Desactivar'}
                            </button>
                          )}

                          {canCreateDelete && !table.active && (
                            <button
                              className="cafetable-reactivate-button"
                              type="button"
                              onClick={() => void reactivateTable(table)}
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? 'Procesando...'
                                : 'Reactivar'}
                            </button>
                          )}
                        </>
                      )}
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
