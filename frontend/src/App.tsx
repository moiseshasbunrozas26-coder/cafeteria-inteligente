import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import './App.css';
import { apiRequest } from './api';
import {
  LoginPage,
  type Session,
} from './LoginPage';

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

interface SaleItem {
  id: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product: Product;
}

interface Sale {
  id: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  total: string;
  createdAt: string;
  items: SaleItem[];
}

interface DashboardData {
  products: Product[];
  ingredients: Ingredient[];
  tables: CafeTable[];
  sales: Sale[];
}

const menuItems = [
  'Dashboard',
  'Ventas',
  'Productos',
  'Ingredientes',
  'Inventario',
  'Mesas',
  'Reservas',
  'Usuarios',
];

const initialDashboardData: DashboardData = {
  products: [],
  ingredients: [],
  tables: [],
  sales: [],
};

const tableStatusLabels: Record<TableStatus, string> = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Ocupada',
  RESERVED: 'Reservada',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

const tableStatusClasses: Record<TableStatus, string> = {
  AVAILABLE: 'disponible',
  OCCUPIED: 'ocupada',
  RESERVED: 'reservada',
  OUT_OF_SERVICE: 'fuera-de-servicio',
};

const saleStatusLabels = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Buenos días';
  }

  if (hour < 20) {
    return 'Buenas tardes';
  }

  return 'Buenas noches';
}

function App() {
  const [session, setSession] = useState<Session | null>(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('authUser');

    if (!savedToken || !savedUser) {
      return null;
    }

    try {
      return {
        accessToken: savedToken,
        user: JSON.parse(savedUser),
      };
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');

      return null;
    }
  });

  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);

  const [loading, setLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');

  function handleLogin(newSession: Session) {
    localStorage.setItem(
      'accessToken',
      newSession.accessToken,
    );

    localStorage.setItem(
      'authUser',
      JSON.stringify(newSession.user),
    );

    setSession(newSession);
  }

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');

    setSession(null);
    setDashboardData(initialDashboardData);
  }

  async function loadDashboardData() {
    if (!session) {
      return;
    }

    setLoading(true);
    setDashboardError('');

    try {
      const [
        products,
        ingredients,
        tables,
        sales,
      ] = await Promise.all([
        apiRequest<Product[]>(
          '/products',
          session.accessToken,
        ),
        apiRequest<Ingredient[]>(
          '/ingredients',
          session.accessToken,
        ),
        apiRequest<CafeTable[]>(
          '/tables',
          session.accessToken,
        ),
        apiRequest<Sale[]>(
          '/sales',
          session.accessToken,
        ),
      ]);

      setDashboardData({
        products,
        ingredients,
        tables,
        sales,
      });
    } catch (error) {
      setDashboardError(
        error instanceof Error
          ? error.message
          : 'No fue posible cargar el dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboardData();
  }, [session]);

  const dashboardSummary = useMemo(() => {
    const activeProducts =
      dashboardData.products.filter(
        (product) => product.active,
      );

    const activeIngredients =
      dashboardData.ingredients.filter(
        (ingredient) => ingredient.active,
      );

    const activeTables =
      dashboardData.tables.filter(
        (table) => table.active,
      );

    const availableTables = activeTables.filter(
      (table) => table.status === 'AVAILABLE',
    );

    const completedSales =
      dashboardData.sales.filter(
        (sale) => sale.status === 'COMPLETED',
      );

    const totalSales = completedSales.reduce(
      (total, sale) => total + Number(sale.total),
      0,
    );

    const lowStockIngredients =
      activeIngredients.filter(
        (ingredient) =>
          Number(ingredient.currentStock) <=
          Number(ingredient.minimumStock),
      );

    return {
      activeProducts,
      activeIngredients,
      activeTables,
      availableTables,
      completedSales,
      totalSales,
      lowStockIngredients,
    };
  }, [dashboardData]);

  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const firstName =
    session.user.name.split(' ')[0] ||
    session.user.name;

  const initials = session.user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const roleName =
    session.user.role === 'ADMIN'
      ? 'Administrador'
      : 'Trabajador';

  const principalIngredient =
    dashboardData.ingredients.find(
      (ingredient) => ingredient.active,
    );

  const ingredientCurrentStock =
    Number(principalIngredient?.currentStock ?? 0);

  const ingredientMinimumStock =
    Number(principalIngredient?.minimumStock ?? 0);

  const ingredientIsLow =
    principalIngredient !== undefined &&
    ingredientCurrentStock <= ingredientMinimumStock;

  const inventoryProgress =
    ingredientMinimumStock > 0
      ? Math.min(
          (ingredientCurrentStock /
            ingredientMinimumStock) *
            100,
          100,
        )
      : 100;

  const recentSales = dashboardData.sales.slice(0, 5);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">☕</div>

          <div>
            <h1>Cafetería</h1>
            <span>Inteligente</span>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map((item, index) => (
            <button
              className={
                index === 0
                  ? 'menu-item active'
                  : 'menu-item'
              }
              key={item}
              type="button"
            >
              <span>{index === 0 ? '▦' : '○'}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            {initials}
          </div>

          <div className="sidebar-user-data">
            <strong>{session.user.name}</strong>
            <span>{roleName}</span>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            ↪
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              Panel administrativo
            </p>

            <h2>
              {getGreeting()}, {firstName}
            </h2>

            <p>
              Este es el resumen actual de tu cafetería.
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => void loadDashboardData()}
              disabled={loading}
            >
              {loading ? 'Actualizando...' : '↻ Actualizar'}
            </button>

            <button
              className="primary-button"
              type="button"
            >
              + Nueva venta
            </button>
          </div>
        </header>

        {dashboardError && (
          <div className="dashboard-message error-message">
            <strong>No se pudieron cargar los datos.</strong>
            <span>{dashboardError}</span>
          </div>
        )}

        <section className="summary-grid">
          <article className="summary-card">
            <span className="card-icon">💰</span>

            <div>
              <p>Ventas registradas</p>

              <strong>
                {formatCurrency(
                  dashboardSummary.totalSales,
                )}
              </strong>

              <small>
                {
                  dashboardSummary.completedSales
                    .length
                }{' '}
                {dashboardSummary.completedSales
                  .length === 1
                  ? 'venta completada'
                  : 'ventas completadas'}
              </small>
            </div>
          </article>

          <article className="summary-card">
            <span className="card-icon">☕</span>

            <div>
              <p>Productos activos</p>

              <strong>
                {
                  dashboardSummary.activeProducts
                    .length
                }
              </strong>

              <small>
                {dashboardSummary.activeProducts[0]
                  ?.name ??
                  'Sin productos activos'}
              </small>
            </div>
          </article>

          <article className="summary-card">
            <span className="card-icon">📦</span>

            <div>
              <p>Ingredientes</p>

              <strong>
                {
                  dashboardSummary.activeIngredients
                    .length
                }
              </strong>

              <small>
                {dashboardSummary
                  .lowStockIngredients.length > 0
                  ? `${dashboardSummary.lowStockIngredients.length} con stock bajo`
                  : 'Stock en nivel normal'}
              </small>
            </div>
          </article>

          <article className="summary-card">
            <span className="card-icon">🪑</span>

            <div>
              <p>Mesas disponibles</p>

              <strong>
                {
                  dashboardSummary.availableTables
                    .length
                }
              </strong>

              <small>
                De{' '}
                {
                  dashboardSummary.activeTables
                    .length
                }{' '}
                mesas activas
              </small>
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <h3>Estado de mesas</h3>
                <p>
                  Disponibilidad actual del local
                </p>
              </div>

              <button
                className="text-button"
                type="button"
              >
                Ver todas
              </button>
            </div>

            {dashboardData.tables.length === 0 ? (
              <div className="empty-state">
                No hay mesas registradas.
              </div>
            ) : (
              <div className="table-grid">
                {dashboardData.tables.map(
                  (table) => (
                    <div
                      className="table-card"
                      key={table.id}
                    >
                      <div className="table-number">
                        {table.number}
                      </div>

                      <div>
                        <strong>
                          Mesa {table.number}
                        </strong>

                        <p>
                          {table.capacity} personas
                        </p>
                      </div>

                      <span
                        className={`status ${
                          tableStatusClasses[
                            table.status
                          ]
                        }`}
                      >
                        {
                          tableStatusLabels[
                            table.status
                          ]
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h3>Inventario</h3>
                <p>Resumen de ingredientes</p>
              </div>

              <button
                className="text-button"
                type="button"
              >
                Ver inventario
              </button>
            </div>

            {principalIngredient ? (
              <>
                <div className="inventory-item">
                  <div className="inventory-title">
                    <div>
                      <strong>
                        {principalIngredient.name}
                      </strong>

                      <p>
                        {ingredientCurrentStock}{' '}
                        {principalIngredient.unit} ·
                        mínimo{' '}
                        {ingredientMinimumStock}
                      </p>
                    </div>

                    <span>
                      {ingredientIsLow
                        ? 'Stock bajo'
                        : 'Normal'}
                    </span>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{
                        width: `${inventoryProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className={
                    ingredientIsLow
                      ? 'inventory-message inventory-warning'
                      : 'inventory-message'
                  }
                >
                  <span>
                    {ingredientIsLow ? '!' : '✓'}
                  </span>

                  <div>
                    <strong>
                      {ingredientIsLow
                        ? 'Se necesita reposición'
                        : 'Inventario saludable'}
                    </strong>

                    <p>
                      {ingredientIsLow
                        ? `${principalIngredient.name} llegó al stock mínimo.`
                        : 'No hay ingredientes bajo el stock mínimo.'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                No hay ingredientes registrados.
              </div>
            )}
          </article>
        </section>

        <section className="panel sales-panel">
          <div className="panel-header">
            <div>
              <h3>Ventas recientes</h3>

              <p>
                Últimas operaciones registradas
              </p>
            </div>

            <button
              className="text-button"
              type="button"
            >
              Ver historial
            </button>
          </div>

          {recentSales.length === 0 ? (
            <div className="empty-state">
              Todavía no hay ventas registradas.
            </div>
          ) : (
            <div className="sales-table">
              <div className="sales-row sales-head">
                <span>Venta</span>
                <span>Productos</span>
                <span>Estado</span>
                <span>Total</span>
              </div>

              {recentSales.map((sale) => (
                <div
                  className="sales-row"
                  key={sale.id}
                >
                  <span>#{sale.id}</span>

                  <span>
                    {sale.items
                      .map(
                        (item) =>
                          `${item.quantity} × ${item.product.name}`,
                      )
                      .join(', ')}
                  </span>

                  <span>
                    <small
                      className={
                        sale.status === 'COMPLETED'
                          ? 'completed'
                          : 'sale-status'
                      }
                    >
                      {
                        saleStatusLabels[
                          sale.status
                        ]
                      }
                    </small>
                  </span>

                  <strong>
                    {formatCurrency(
                      Number(sale.total),
                    )}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;