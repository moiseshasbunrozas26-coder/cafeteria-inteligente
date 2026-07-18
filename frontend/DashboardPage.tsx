import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from './api';
import './DashboardPage.css';

type TableStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'OUT_OF_SERVICE';

type SaleStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED';

type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface Product {
  id: number;
  name: string;
  price: string;
  active: boolean;
}

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  currentStock: string;
  minimumStock: string;
  active: boolean;
}

interface CafeTable {
  id: number;
  number: number;
  capacity: number;
  status: TableStatus;
  active: boolean;
}

interface SaleItem {
  id?: number;
  quantity: number;
  subtotal: string;
  product: {
    id: number;
    name: string;
  };
}

interface Sale {
  id: number;
  status: SaleStatus;
  total: string;
  createdAt: string;
  items: SaleItem[];
}

interface Reservation {
  id: number;
  customerName: string;
  people: number;
  reservationAt: string;
  status: ReservationStatus;
  table: {
    id: number;
    number: number;
  };
}

interface DashboardPageProps {
  accessToken: string;
  firstName: string;
  products: Product[];
  ingredients: Ingredient[];
  tables: CafeTable[];
  sales: Sale[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onNewSale: () => void;
  onGoToSales: () => void;
  onGoToInventory: () => void;
  onGoToTables: () => void;
  onGoToReservations: () => void;
}

const tableStatusLabels: Record<
  TableStatus,
  string
> = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Ocupada',
  RESERVED: 'Reservada',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

const reservationStatusLabels: Record<
  ReservationStatus,
  string
> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

function money(value: number | string) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Buenos días';
  }

  if (hour < 19) {
    return 'Buenas tardes';
  }

  return 'Buenas noches';
}

function localDayKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat('es-CL', {
    weekday: 'short',
  })
    .format(date)
    .replace('.', '');
}

export function DashboardPage({
  accessToken,
  firstName,
  products,
  ingredients,
  tables,
  sales,
  loading,
  error,
  onRefresh,
  onNewSale,
  onGoToSales,
  onGoToInventory,
  onGoToTables,
  onGoToReservations,
}: DashboardPageProps) {
  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [reservationsError, setReservationsError] =
    useState('');

  const loadReservations =
    useCallback(async () => {
      setReservationsError('');

      try {
        const result =
          await apiRequest<Reservation[]>(
            '/reservations',
            accessToken,
          );

        setReservations(result);
      } catch (requestError) {
        setReservationsError(
          requestError instanceof Error
            ? requestError.message
            : 'No fue posible cargar las reservas.',
        );
      }
    }, [accessToken]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const analytics = useMemo(() => {
    const now = new Date();
    const todayKey = localDayKey(now);

    const activeProducts =
      products.filter(
        (product) => product.active,
      );

    const activeIngredients =
      ingredients.filter(
        (ingredient) => ingredient.active,
      );

    const activeTables =
      tables.filter(
        (table) => table.active,
      );

    const completedSales =
      sales.filter(
        (sale) =>
          sale.status === 'COMPLETED',
      );

    const todaySales =
      completedSales.filter(
        (sale) =>
          localDayKey(
            new Date(sale.createdAt),
          ) === todayKey,
      );

    const totalRevenue =
      completedSales.reduce(
        (total, sale) =>
          total + Number(sale.total),
        0,
      );

    const todayRevenue =
      todaySales.reduce(
        (total, sale) =>
          total + Number(sale.total),
        0,
      );

    const averageTicket =
      completedSales.length > 0
        ? totalRevenue /
          completedSales.length
        : 0;

    const lowStockIngredients =
      activeIngredients
        .filter(
          (ingredient) =>
            Number(
              ingredient.currentStock,
            ) <=
            Number(
              ingredient.minimumStock,
            ),
        )
        .sort(
          (first, second) =>
            Number(first.currentStock) -
            Number(second.currentStock),
        );

    const upcomingReservations =
      reservations
        .filter(
          (reservation) =>
            new Date(
              reservation.reservationAt,
            ).getTime() >=
              now.getTime() &&
            (
              reservation.status ===
                'PENDING' ||
              reservation.status ===
                'CONFIRMED'
            ),
        )
        .sort(
          (first, second) =>
            new Date(
              first.reservationAt,
            ).getTime() -
            new Date(
              second.reservationAt,
            ).getTime(),
        );

    const productTotals =
      new Map<
        number,
        {
          name: string;
          quantity: number;
          revenue: number;
        }
      >();

    for (const sale of completedSales) {
      for (const item of sale.items) {
        const existing =
          productTotals.get(
            item.product.id,
          );

        productTotals.set(
          item.product.id,
          {
            name: item.product.name,
            quantity:
              (existing?.quantity ?? 0) +
              item.quantity,
            revenue:
              (existing?.revenue ?? 0) +
              Number(item.subtotal),
          },
        );
      }
    }

    const topProducts =
      [...productTotals.values()]
        .sort(
          (first, second) =>
            second.quantity -
            first.quantity,
        )
        .slice(0, 5);

    const sevenDays =
      Array.from(
        {
          length: 7,
        },
        (_, index) => {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(
            date.getDate() -
              (6 - index),
          );

          return {
            date,
            key: localDayKey(date),
            label: dayLabel(date),
            total: 0,
            salesCount: 0,
          };
        },
      );

    const salesByDay =
      new Map(
        sevenDays.map((day) => [
          day.key,
          day,
        ]),
      );

    for (const sale of completedSales) {
      const key = localDayKey(
        new Date(sale.createdAt),
      );

      const day =
        salesByDay.get(key);

      if (day) {
        day.total += Number(sale.total);
        day.salesCount += 1;
      }
    }

    const maxDailyRevenue =
      Math.max(
        1,
        ...sevenDays.map(
          (day) => day.total,
        ),
      );

    const tableCounts =
      (
        [
          'AVAILABLE',
          'OCCUPIED',
          'RESERVED',
          'OUT_OF_SERVICE',
        ] as TableStatus[]
      ).map((status) => ({
        status,
        count: activeTables.filter(
          (table) =>
            table.status === status,
        ).length,
      }));

    return {
      activeProducts,
      activeIngredients,
      activeTables,
      completedSales,
      todaySales,
      totalRevenue,
      todayRevenue,
      averageTicket,
      lowStockIngredients,
      upcomingReservations,
      topProducts,
      sevenDays,
      maxDailyRevenue,
      tableCounts,
    };
  }, [
    products,
    ingredients,
    tables,
    sales,
    reservations,
  ]);

  const maxTopProductQuantity =
    Math.max(
      1,
      ...analytics.topProducts.map(
        (product) => product.quantity,
      ),
    );

  function refreshAll() {
    onRefresh();
    void loadReservations();
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>
            {getGreeting()}, {firstName}
          </h2>

          <p>
            Este es el resumen actual de
            tu cafetería.
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={refreshAll}
            disabled={loading}
          >
            {loading
              ? 'Actualizando...'
              : '↻ Actualizar'}
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={onNewSale}
          >
            + Nueva venta
          </button>
        </div>
      </header>

      {error && (
        <div className="smart-dashboard-message smart-dashboard-error">
          <strong>
            No se pudieron cargar todos
            los datos.
          </strong>

          <span>{error}</span>
        </div>
      )}

      {reservationsError && (
        <div className="smart-dashboard-message smart-dashboard-warning">
          <strong>
            Reservas no disponibles
          </strong>

          <span>
            {reservationsError}
          </span>
        </div>
      )}

      <section className="smart-dashboard-summary">
        <article className="smart-summary-card">
          <span className="smart-summary-icon">
            💰
          </span>

          <div>
            <p>Ventas de hoy</p>
            <strong>
              {money(
                analytics.todayRevenue,
              )}
            </strong>
            <small>
              {analytics.todaySales.length}{' '}
              {analytics.todaySales.length ===
              1
                ? 'venta completada'
                : 'ventas completadas'}
            </small>
          </div>
        </article>

        <article className="smart-summary-card">
          <span className="smart-summary-icon">
            🧾
          </span>

          <div>
            <p>Ticket promedio</p>
            <strong>
              {money(
                analytics.averageTicket,
              )}
            </strong>
            <small>
              {
                analytics.completedSales
                  .length
              }{' '}
              ventas históricas
            </small>
          </div>
        </article>

        <article className="smart-summary-card">
          <span className="smart-summary-icon">
            📦
          </span>

          <div>
            <p>Stock crítico</p>
            <strong>
              {
                analytics
                  .lowStockIngredients
                  .length
              }
            </strong>
            <small>
              {analytics
                .lowStockIngredients
                .length > 0
                ? 'Requieren reposición'
                : 'Inventario saludable'}
            </small>
          </div>
        </article>

        <article className="smart-summary-card">
          <span className="smart-summary-icon">
            📅
          </span>

          <div>
            <p>Próximas reservas</p>
            <strong>
              {
                analytics
                  .upcomingReservations
                  .length
              }
            </strong>
            <small>
              Pendientes o confirmadas
            </small>
          </div>
        </article>
      </section>

      <section className="smart-dashboard-main-grid">
        <article className="panel smart-sales-chart-panel">
          <div className="panel-header">
            <div>
              <h3>
                Ventas de los últimos 7 días
              </h3>

              <p>
                Ingresos diarios de ventas
                completadas
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={onGoToSales}
            >
              Ver ventas
            </button>
          </div>

          <div className="smart-sales-total">
            <span>
              Total histórico
            </span>

            <strong>
              {money(
                analytics.totalRevenue,
              )}
            </strong>
          </div>

          <div
            className="smart-bar-chart"
            aria-label="Ventas de los últimos siete días"
          >
            {analytics.sevenDays.map(
              (day) => {
                const height =
                  day.total > 0
                    ? Math.max(
                        8,
                        (
                          day.total /
                          analytics.maxDailyRevenue
                        ) *
                          100,
                      )
                    : 3;

                return (
                  <div
                    className="smart-bar-column"
                    key={day.key}
                    title={`${day.salesCount} ventas · ${money(
                      day.total,
                    )}`}
                  >
                    <span className="smart-bar-value">
                      {day.total > 0
                        ? money(day.total)
                        : '$0'}
                    </span>

                    <div className="smart-bar-track">
                      <div
                        className="smart-bar-value-fill"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {day.label}
                    </strong>
                  </div>
                );
              },
            )}
          </div>
        </article>

        <article className="panel smart-top-products-panel">
          <div className="panel-header">
            <div>
              <h3>
                Productos más vendidos
              </h3>

              <p>
                Ranking por unidades
              </p>
            </div>
          </div>

          {analytics.topProducts.length ===
          0 ? (
            <div className="empty-state">
              Todavía no hay suficientes
              ventas para crear el ranking.
            </div>
          ) : (
            <div className="smart-ranking-list">
              {analytics.topProducts.map(
                (product, index) => (
                  <article
                    className="smart-ranking-item"
                    key={product.name}
                  >
                    <span className="smart-ranking-position">
                      {index + 1}
                    </span>

                    <div className="smart-ranking-content">
                      <div className="smart-ranking-heading">
                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          {product.quantity}{' '}
                          unidades
                        </span>
                      </div>

                      <div className="smart-ranking-track">
                        <div
                          className="smart-ranking-fill"
                          style={{
                            width: `${
                              (
                                product.quantity /
                                maxTopProductQuantity
                              ) * 100
                            }%`,
                          }}
                        />
                      </div>

                      <small>
                        {money(
                          product.revenue,
                        )}{' '}
                        vendidos
                      </small>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </article>
      </section>

      <section className="smart-dashboard-secondary-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h3>
                Estado de mesas
              </h3>

              <p>
                Disponibilidad actual
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={onGoToTables}
            >
              Gestionar
            </button>
          </div>

          <div className="smart-table-status-grid">
            {analytics.tableCounts.map(
              (item) => (
                <article
                  className={`smart-table-status-card smart-table-${item.status.toLowerCase()}`}
                  key={item.status}
                >
                  <strong>
                    {item.count}
                  </strong>

                  <span>
                    {
                      tableStatusLabels[
                        item.status
                      ]
                    }
                  </span>
                </article>
              ),
            )}
          </div>

          <small className="smart-panel-caption">
            {
              analytics.activeTables
                .length
            }{' '}
            mesas activas en total
          </small>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h3>
                Stock bajo
              </h3>

              <p>
                Ingredientes que requieren
                atención
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={onGoToInventory}
            >
              Ver inventario
            </button>
          </div>

          {analytics
            .lowStockIngredients.length ===
          0 ? (
            <div className="smart-healthy-state">
              <span>✓</span>

              <div>
                <strong>
                  Inventario saludable
                </strong>

                <p>
                  No hay ingredientes bajo
                  el stock mínimo.
                </p>
              </div>
            </div>
          ) : (
            <div className="smart-low-stock-list">
              {analytics.lowStockIngredients
                .slice(0, 5)
                .map((ingredient) => (
                  <article
                    className="smart-low-stock-item"
                    key={ingredient.id}
                  >
                    <div>
                      <strong>
                        {ingredient.name}
                      </strong>

                      <small>
                        Mínimo:{' '}
                        {
                          ingredient.minimumStock
                        }{' '}
                        {ingredient.unit}
                      </small>
                    </div>

                    <span>
                      {
                        ingredient.currentStock
                      }{' '}
                      {ingredient.unit}
                    </span>
                  </article>
                ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h3>
                Próximas reservas
              </h3>

              <p>
                Agenda más cercana
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={
                onGoToReservations
              }
            >
              Ver agenda
            </button>
          </div>

          {analytics
            .upcomingReservations.length ===
          0 ? (
            <div className="empty-state">
              No hay próximas reservas.
            </div>
          ) : (
            <div className="smart-reservations-list">
              {analytics
                .upcomingReservations
                .slice(0, 4)
                .map((reservation) => (
                  <article
                    className="smart-reservation-item"
                    key={reservation.id}
                  >
                    <div>
                      <strong>
                        {
                          reservation.customerName
                        }
                      </strong>

                      <small>
                        Mesa{' '}
                        {
                          reservation.table
                            .number
                        }{' '}
                        · {reservation.people}{' '}
                        personas
                      </small>
                    </div>

                    <div className="smart-reservation-time">
                      <strong>
                        {dateTime(
                          reservation.reservationAt,
                        )}
                      </strong>

                      <span
                        className={`smart-reservation-status smart-reservation-${reservation.status.toLowerCase()}`}
                      >
                        {
                          reservationStatusLabels[
                            reservation.status
                          ]
                        }
                      </span>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </article>
      </section>

      <section className="panel smart-recent-sales-panel">
        <div className="panel-header">
          <div>
            <h3>
              Ventas recientes
            </h3>

            <p>
              Últimas operaciones
              registradas
            </p>
          </div>

          <button
            className="text-button"
            type="button"
            onClick={onGoToSales}
          >
            Ver historial
          </button>
        </div>

        {sales.length === 0 ? (
          <div className="empty-state">
            Todavía no hay ventas
            registradas.
          </div>
        ) : (
          <div className="smart-sales-table-wrap">
            <table className="smart-sales-table">
              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {sales
                  .slice(0, 6)
                  .map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <strong>
                          #{sale.id}
                        </strong>
                      </td>

                      <td>
                        {dateTime(
                          sale.createdAt,
                        )}
                      </td>

                      <td>
                        {sale.items
                          .map(
                            (item) =>
                              `${item.quantity} × ${item.product.name}`,
                          )
                          .join(', ')}
                      </td>

                      <td>
                        <strong>
                          {money(
                            sale.total,
                          )}
                        </strong>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
