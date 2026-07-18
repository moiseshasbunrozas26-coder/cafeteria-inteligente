import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from './api';
import './ReservationsPage.css';

type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

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
}

interface Reservation {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  people: number;
  reservationAt: string;
  durationMinutes: number;
  status: ReservationStatus;
  notes?: string | null;
  tableId: number;
  table: CafeTable;
  createdAt: string;
  updatedAt: string;
}

interface ReservationsPageProps {
  accessToken: string;
  canManage: boolean;
  onReservationsChanged?: () => void;
}

interface ReservationForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  people: string;
  date: string;
  time: string;
  durationMinutes: string;
  status: ReservationStatus;
  notes: string;
  tableId: string;
}

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

const initialForm: ReservationForm = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  people: '2',
  date: tomorrowDate(),
  time: '12:00',
  durationMinutes: '90',
  status: 'PENDING',
  notes: '',
  tableId: '',
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

function isUpcoming(reservation: Reservation) {
  return (
    new Date(reservation.reservationAt).getTime() >=
      Date.now() &&
    reservation.status !== 'CANCELLED' &&
    reservation.status !== 'COMPLETED'
  );
}

export function ReservationsPage({
  accessToken,
  canManage,
  onReservationsChanged,
}: ReservationsPageProps) {
  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [tables, setTables] =
    useState<CafeTable[]>([]);

  const [form, setForm] =
    useState<ReservationForm>(initialForm);

  const [filter, setFilter] =
    useState<'ALL' | 'UPCOMING' | ReservationStatus>(
      'UPCOMING',
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [processingId, setProcessingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [
        reservationData,
        tableData,
      ] = await Promise.all([
        apiRequest<Reservation[]>(
          '/reservations',
          accessToken,
        ),
        apiRequest<CafeTable[]>(
          '/tables',
          accessToken,
        ),
      ]);

      setReservations(reservationData);
      setTables(tableData);

      setForm((current) => {
        const eligibleTables =
          tableData.filter(
            (table) =>
              table.active &&
              table.status !==
                'OUT_OF_SERVICE',
          );

        const currentIsValid =
          eligibleTables.some(
            (table) =>
              table.id ===
              Number(current.tableId),
          );

        return {
          ...current,
          tableId: currentIsValid
            ? current.tableId
            : eligibleTables[0]?.id.toString() ??
              '',
        };
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar las reservas.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const eligibleTables = useMemo(
    () =>
      tables.filter(
        (table) =>
          table.active &&
          table.status !==
            'OUT_OF_SERVICE',
      ),
    [tables],
  );

  const selectedTable = useMemo(
    () =>
      eligibleTables.find(
        (table) =>
          table.id ===
          Number(form.tableId),
      ),
    [eligibleTables, form.tableId],
  );

  const visibleReservations =
    useMemo(() => {
      const filtered =
        reservations.filter(
          (reservation) => {
            if (filter === 'ALL') {
              return true;
            }

            if (filter === 'UPCOMING') {
              return isUpcoming(
                reservation,
              );
            }

            return (
              reservation.status === filter
            );
          },
        );

      return [...filtered].sort(
        (first, second) =>
          new Date(
            first.reservationAt,
          ).getTime() -
          new Date(
            second.reservationAt,
          ).getTime(),
      );
    }, [filter, reservations]);

  const summary = useMemo(
    () => ({
      upcoming:
        reservations.filter(
          isUpcoming,
        ).length,
      pending:
        reservations.filter(
          (reservation) =>
            reservation.status ===
            'PENDING',
        ).length,
      confirmed:
        reservations.filter(
          (reservation) =>
            reservation.status ===
            'CONFIRMED',
        ).length,
      today:
        reservations.filter(
          (reservation) => {
            const reservationDate =
              new Date(
                reservation.reservationAt,
              );

            const now = new Date();

            return (
              reservationDate.getFullYear() ===
                now.getFullYear() &&
              reservationDate.getMonth() ===
                now.getMonth() &&
              reservationDate.getDate() ===
                now.getDate() &&
              reservation.status !==
                'CANCELLED'
            );
          },
        ).length,
    }),
    [reservations],
  );

  function updateForm(
    field: keyof ReservationForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm({
      ...initialForm,
      date: tomorrowDate(),
      tableId:
        eligibleTables[0]?.id.toString() ??
        '',
    });
  }

  async function createReservation(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const people =
      Number(form.people);

    const durationMinutes =
      Number(form.durationMinutes);

    const tableId =
      Number(form.tableId);

    if (!form.customerName.trim()) {
      setError(
        'Debes ingresar el nombre del cliente.',
      );
      return;
    }

    if (!form.customerPhone.trim()) {
      setError(
        'Debes ingresar un teléfono de contacto.',
      );
      return;
    }

    if (
      !Number.isInteger(people) ||
      people < 1
    ) {
      setError(
        'La cantidad de personas debe ser mayor que 0.',
      );
      return;
    }

    if (
      !selectedTable ||
      !Number.isInteger(tableId)
    ) {
      setError(
        'Debes seleccionar una mesa disponible.',
      );
      return;
    }

    if (people > selectedTable.capacity) {
      setError(
        `La mesa ${selectedTable.number} admite hasta ${selectedTable.capacity} personas.`,
      );
      return;
    }

    if (
      !form.date ||
      !form.time
    ) {
      setError(
        'Debes seleccionar fecha y hora.',
      );
      return;
    }

    const localDate =
      new Date(
        `${form.date}T${form.time}:00`,
      );

    if (
      Number.isNaN(localDate.getTime())
    ) {
      setError(
        'La fecha u hora ingresada no es válida.',
      );
      return;
    }

    setSaving(true);

    try {
      await apiRequest<Reservation>(
        '/reservations',
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            customerName:
              form.customerName.trim(),
            customerPhone:
              form.customerPhone.trim(),
            customerEmail:
              form.customerEmail.trim() ||
              undefined,
            people,
            reservationAt:
              localDate.toISOString(),
            durationMinutes,
            status: form.status,
            notes:
              form.notes.trim() ||
              undefined,
            tableId,
          }),
        },
      );

      setSuccess(
        'Reserva creada correctamente.',
      );

      resetForm();

      await loadData();
      onReservationsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible crear la reserva.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    reservation: Reservation,
    status: ReservationStatus,
  ) {
    setProcessingId(reservation.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<Reservation>(
        `/reservations/${reservation.id}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({
            status,
          }),
        },
      );

      setSuccess(
        `Reserva #${reservation.id} actualizada a “${statusLabels[status]}”.`,
      );

      await loadData();
      onReservationsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible actualizar la reserva.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function cancelReservation(
    reservation: Reservation,
  ) {
    const confirmed =
      window.confirm(
        `¿Cancelar la reserva de ${reservation.customerName}?`,
      );

    if (!confirmed) {
      return;
    }

    setProcessingId(reservation.id);
    setError('');
    setSuccess('');

    try {
      await apiRequest<Reservation>(
        `/reservations/${reservation.id}`,
        accessToken,
        {
          method: 'DELETE',
        },
      );

      setSuccess(
        `Reserva #${reservation.id} cancelada correctamente.`,
      );

      await loadData();
      onReservationsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cancelar la reserva.',
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>📅 Reservas</h2>

          <p>
            Organiza horarios, clientes,
            cantidad de personas y mesas
            asignadas.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            void loadData()
          }
          disabled={loading}
        >
          {loading
            ? 'Actualizando...'
            : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="reservations-message reservations-error">
          <strong>
            No fue posible completar la operación
          </strong>

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="reservations-message reservations-success">
          <strong>
            Operación completada
          </strong>

          <span>{success}</span>
        </div>
      )}

      <section className="reservations-summary-grid">
        <article className="reservations-summary-card">
          <span>Próximas</span>
          <strong>
            {summary.upcoming}
          </strong>
          <small>
            Reservas pendientes o confirmadas
          </small>
        </article>

        <article className="reservations-summary-card">
          <span>Para hoy</span>
          <strong>
            {summary.today}
          </strong>
          <small>
            Atención programada hoy
          </small>
        </article>

        <article className="reservations-summary-card">
          <span>Pendientes</span>
          <strong>
            {summary.pending}
          </strong>
          <small>
            Esperando confirmación
          </small>
        </article>

        <article className="reservations-summary-card">
          <span>Confirmadas</span>
          <strong>
            {summary.confirmed}
          </strong>
          <small>
            Confirmadas con el cliente
          </small>
        </article>
      </section>

      <section className="reservations-layout">
        {canManage && (
          <article className="panel reservations-form-panel">
            <div className="panel-header">
              <div>
                <h3>
                  Nueva reserva
                </h3>

                <p>
                  Completa los datos del
                  cliente y selecciona una
                  mesa.
                </p>
              </div>
            </div>

            {eligibleTables.length === 0 ? (
              <div className="empty-state">
                No existen mesas activas
                disponibles para recibir
                reservas.
              </div>
            ) : (
              <form
                className="reservations-form"
                onSubmit={
                  createReservation
                }
              >
                <label>
                  <span>
                    Nombre del cliente *
                  </span>

                  <input
                    type="text"
                    value={
                      form.customerName
                    }
                    onChange={(event) =>
                      updateForm(
                        'customerName',
                        event.target.value,
                      )
                    }
                    maxLength={100}
                    disabled={saving}
                  />
                </label>

                <div className="reservations-two-columns">
                  <label>
                    <span>
                      Teléfono *
                    </span>

                    <input
                      type="tel"
                      value={
                        form.customerPhone
                      }
                      onChange={(event) =>
                        updateForm(
                          'customerPhone',
                          event.target.value,
                        )
                      }
                      maxLength={30}
                      disabled={saving}
                    />
                  </label>

                  <label>
                    <span>
                      Correo
                    </span>

                    <input
                      type="email"
                      value={
                        form.customerEmail
                      }
                      onChange={(event) =>
                        updateForm(
                          'customerEmail',
                          event.target.value,
                        )
                      }
                      disabled={saving}
                    />
                  </label>
                </div>

                <div className="reservations-two-columns">
                  <label>
                    <span>
                      Fecha *
                    </span>

                    <input
                      type="date"
                      value={form.date}
                      onChange={(event) =>
                        updateForm(
                          'date',
                          event.target.value,
                        )
                      }
                      min={tomorrowDate()}
                      disabled={saving}
                    />
                  </label>

                  <label>
                    <span>
                      Hora *
                    </span>

                    <input
                      type="time"
                      value={form.time}
                      onChange={(event) =>
                        updateForm(
                          'time',
                          event.target.value,
                        )
                      }
                      disabled={saving}
                    />
                  </label>
                </div>

                <div className="reservations-two-columns">
                  <label>
                    <span>
                      Personas *
                    </span>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.people}
                      onChange={(event) =>
                        updateForm(
                          'people',
                          event.target.value,
                        )
                      }
                      disabled={saving}
                    />
                  </label>

                  <label>
                    <span>
                      Duración
                    </span>

                    <select
                      value={
                        form.durationMinutes
                      }
                      onChange={(event) =>
                        updateForm(
                          'durationMinutes',
                          event.target.value,
                        )
                      }
                      disabled={saving}
                    >
                      <option value="60">
                        60 minutos
                      </option>
                      <option value="90">
                        90 minutos
                      </option>
                      <option value="120">
                        120 minutos
                      </option>
                      <option value="180">
                        180 minutos
                      </option>
                    </select>
                  </label>
                </div>

                <label>
                  <span>
                    Mesa *
                  </span>

                  <select
                    value={form.tableId}
                    onChange={(event) =>
                      updateForm(
                        'tableId',
                        event.target.value,
                      )
                    }
                    disabled={saving}
                  >
                    {eligibleTables.map(
                      (table) => (
                        <option
                          key={table.id}
                          value={table.id}
                        >
                          Mesa {table.number} ·{' '}
                          {table.capacity}{' '}
                          personas
                        </option>
                      ),
                    )}
                  </select>

                  {selectedTable && (
                    <small>
                      Capacidad máxima:{' '}
                      {
                        selectedTable.capacity
                      }{' '}
                      personas.
                    </small>
                  )}
                </label>

                <label>
                  <span>
                    Estado inicial
                  </span>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        'status',
                        event.target
                          .value as ReservationStatus,
                      )
                    }
                    disabled={saving}
                  >
                    <option value="PENDING">
                      Pendiente
                    </option>
                    <option value="CONFIRMED">
                      Confirmada
                    </option>
                  </select>
                </label>

                <label>
                  <span>
                    Notas
                  </span>

                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      updateForm(
                        'notes',
                        event.target.value,
                      )
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="Alergias, celebración, ubicación preferida..."
                    disabled={saving}
                  />
                </label>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Guardando...'
                    : '+ Crear reserva'}
                </button>
              </form>
            )}
          </article>
        )}

        <article className="panel reservations-list-panel">
          <div className="reservations-list-header">
            <div>
              <h3>
                Agenda de reservas
              </h3>

              <p>
                Consulta y actualiza el
                estado de cada atención.
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value as
                    | 'ALL'
                    | 'UPCOMING'
                    | ReservationStatus,
                )
              }
            >
              <option value="UPCOMING">
                Próximas
              </option>
              <option value="ALL">
                Todas
              </option>
              <option value="PENDING">
                Pendientes
              </option>
              <option value="CONFIRMED">
                Confirmadas
              </option>
              <option value="COMPLETED">
                Completadas
              </option>
              <option value="CANCELLED">
                Canceladas
              </option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state">
              Cargando reservas...
            </div>
          ) : visibleReservations.length ===
            0 ? (
            <div className="empty-state">
              No hay reservas que
              coincidan con este filtro.
            </div>
          ) : (
            <div className="reservations-card-list">
              {visibleReservations.map(
                (reservation) => {
                  const isProcessing =
                    processingId ===
                    reservation.id;

                  return (
                    <article
                      className="reservation-card"
                      key={reservation.id}
                    >
                      <div className="reservation-card-date">
                        <span>
                          {formatShortDate(
                            reservation.reservationAt,
                          )}
                        </span>

                        <strong>
                          {new Intl.DateTimeFormat(
                            'es-CL',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          ).format(
                            new Date(
                              reservation.reservationAt,
                            ),
                          )}
                        </strong>
                      </div>

                      <div className="reservation-card-main">
                        <div className="reservation-card-title">
                          <div>
                            <strong>
                              {
                                reservation.customerName
                              }
                            </strong>

                            <span>
                              Mesa{' '}
                              {
                                reservation.table
                                  .number
                              }{' '}
                              ·{' '}
                              {
                                reservation.people
                              }{' '}
                              personas
                            </span>
                          </div>

                          <span
                            className={`reservation-status reservation-status-${reservation.status.toLowerCase()}`}
                          >
                            {
                              statusLabels[
                                reservation.status
                              ]
                            }
                          </span>
                        </div>

                        <div className="reservation-details">
                          <span>
                            📞{' '}
                            {
                              reservation.customerPhone
                            }
                          </span>

                          <span>
                            ⏱️{' '}
                            {
                              reservation.durationMinutes
                            }{' '}
                            min
                          </span>

                          <span>
                            📅{' '}
                            {formatDateTime(
                              reservation.reservationAt,
                            )}
                          </span>
                        </div>

                        {reservation.notes && (
                          <p className="reservation-notes">
                            {
                              reservation.notes
                            }
                          </p>
                        )}

                        {canManage &&
                          reservation.status !==
                            'CANCELLED' && (
                            <div className="reservation-actions">
                              <select
                                value={
                                  reservation.status
                                }
                                onChange={(event) =>
                                  void changeStatus(
                                    reservation,
                                    event.target
                                      .value as ReservationStatus,
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                              >
                                <option value="PENDING">
                                  Pendiente
                                </option>
                                <option value="CONFIRMED">
                                  Confirmada
                                </option>
                                <option value="COMPLETED">
                                  Completada
                                </option>
                              </select>

                              <button
                                type="button"
                                onClick={() =>
                                  void cancelReservation(
                                    reservation,
                                  )
                                }
                                disabled={
                                  isProcessing
                                }
                              >
                                {isProcessing
                                  ? 'Procesando...'
                                  : 'Cancelar'}
                              </button>
                            </div>
                          )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}
        </article>
      </section>
    </>
  );
}
