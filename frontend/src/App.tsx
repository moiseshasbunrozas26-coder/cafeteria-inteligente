import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import { apiRequest } from './api';
import { ProductsPage } from './ProductsPage';
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

type SaleStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED';

interface Sale {
  id: number;
  status: SaleStatus;
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

interface ModulePageProps {
  title: string;
  description: string;
  icon: string;
  children?: ReactNode;
}

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '▦',
  },
  {
    label: 'Ventas',
    path: '/ventas',
    icon: '🛒',
  },
  {
    label: 'Productos',
    path: '/productos',
    icon: '☕',
  },
  {
    label: 'Ingredientes',
    path: '/ingredientes',
    icon: '🥛',
  },
  {
    label: 'Inventario',
    path: '/inventario',
    icon: '📦',
  },
  {
    label: 'Mesas',
    path: '/mesas',
    icon: '🪑',
  },
  {
    label: 'Reservas',
    path: '/reservas',
    icon: '📅',
  },
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: '👥',
  },
];

const initialDashboardData: DashboardData = {
  products: [],
  ingredients: [],
  tables: [],
  sales: [],
};

const tableStatusLabels: Record<
  TableStatus,
  string
> = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Ocupada',
  RESERVED: 'Reservada',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

const tableStatusClasses: Record<
  TableStatus,
  string
> = {
  AVAILABLE: 'disponible',
  OCCUPIED: 'ocupada',
  RESERVED: 'reservada',
  OUT_OF_SERVICE: 'fuera-de-servicio',
};

const saleStatusLabels: Record<
  SaleStatus,
  string
> = {
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
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

function ModulePage({
  title,
  description,
  icon,
  children,
}: ModulePageProps) {
  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>
            {icon} {title}
          </h2>

          <p>{description}</p>
        </div>
      </header>

      {children ?? (
        <section className="panel">
          <div className="empty-state">
            <strong>
              Módulo en construcción
            </strong>

            <p>
              La navegación ya está funcionando.
              Este módulo se conectará con la API
              en los próximos pasos.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] =
    useState<Session | null>(() => {
      const savedToken =
        localStorage.getItem('accessToken');

      const savedUser =
        localStorage.getItem('authUser');

      if (!savedToken || !savedUser) {
        return null;
      }

      try {
        return {
          accessToken: savedToken,
          user: JSON.parse(savedUser),
        };
      } catch {
        localStorage.removeItem(
          'accessToken',
        );

        localStorage.removeItem(
          'authUser',
        );

        return null;
      }
    });

  const [dashboardData, setDashboardData] =
    useState<DashboardData>(
      initialDashboardData,
    );

  const [loading, setLoading] =
    useState(false);

  const [
    dashboardError,
    setDashboardError,
  ] = useState('');

  function handleLogin(
    newSession: Session,
  ) {
    localStorage.setItem(
      'accessToken',
      newSession.accessToken,
    );

    localStorage.setItem(
      'authUser',
      JSON.stringify(newSession.user),
    );

    setSession(newSession);
    navigate('/dashboard', {
      replace: true,
    });
  }

  function handleLogout() {
    localStorage.removeItem(
      'accessToken',
    );

    localStorage.removeItem('authUser');

    setSession(null);

    setDashboardData(
      initialDashboardData,
    );

    setDashboardError('');

    navigate('/dashboard', {
      replace: true,
    });
  }

  const loadDashboardData =
    useCallback(async () => {
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
            : 'No fue posible cargar los datos.',
        );
      } finally {
        setLoading(false);
      }
    }, [session]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const dashboardSummary =
    useMemo(() => {
      const activeProducts =
        dashboardData.products.filter(
          (product) => product.active,
        );

      const activeIngredients =
        dashboardData.ingredients.filter(
          (ingredient) =>
            ingredient.active,
        );

      const activeTables =
        dashboardData.tables.filter(
          (table) => table.active,
        );

      const availableTables =
        activeTables.filter(
          (table) =>
            table.status === 'AVAILABLE',
        );

      const completedSales =
        dashboardData.sales.filter(
          (sale) =>
            sale.status === 'COMPLETED',
        );

      const totalSales =
        completedSales.reduce(
          (total, sale) =>
            total + Number(sale.total),
          0,
        );

      const lowStockIngredients =
        activeIngredients.filter(
          (ingredient) =>
            Number(
              ingredient.currentStock,
            ) <=
            Number(
              ingredient.minimumStock,
            ),
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
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
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
      (ingredient) =>
        ingredient.active,
    );

  const ingredientCurrentStock =
    Number(
      principalIngredient?.currentStock ??
        0,
    );

  const ingredientMinimumStock =
    Number(
      principalIngredient?.minimumStock ??
        0,
    );

  const ingredientIsLow =
    principalIngredient !== undefined &&
    ingredientCurrentStock <=
      ingredientMinimumStock;

  const inventoryProgress =
    ingredientMinimumStock > 0
      ? Math.min(
          (ingredientCurrentStock /
            ingredientMinimumStock) *
            100,
          100,
        )
      : 100;

  const recentSales =
    dashboardData.sales.slice(0, 5);

  const dashboardPage = (
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
            onClick={() =>
              void loadDashboardData()
            }
            disabled={loading}
          >
            {loading
              ? 'Actualizando...'
              : '↻ Actualizar'}
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              navigate('/ventas')
            }
          >
            + Nueva venta
          </button>
        </div>
      </header>

      {dashboardError && (
        <div className="dashboard-message error-message">
          <strong>
            No se pudieron cargar los
            datos.
          </strong>

          <span>{dashboardError}</span>
        </div>
      )}

      <section className="summary-grid">
        <article className="summary-card">
          <span className="card-icon">
            💰
          </span>

          <div>
            <p>Ventas registradas</p>

            <strong>
              {formatCurrency(
                dashboardSummary.totalSales,
              )}
            </strong>

            <small>
              {
                dashboardSummary
                  .completedSales.length
              }{' '}
              {dashboardSummary
                .completedSales.length ===
              1
                ? 'venta completada'
                : 'ventas completadas'}
            </small>
          </div>
        </article>

        <article className="summary-card">
          <span className="card-icon">
            ☕
          </span>

          <div>
            <p>Productos activos</p>

            <strong>
              {
                dashboardSummary
                  .activeProducts.length
              }
            </strong>

            <small>
              {dashboardSummary
                .activeProducts[0]?.name ??
                'Sin productos activos'}
            </small>
          </div>
        </article>

        <article className="summary-card">
          <span className="card-icon">
            📦
          </span>

          <div>
            <p>Ingredientes</p>

            <strong>
              {
                dashboardSummary
                  .activeIngredients
                  .length
              }
            </strong>

            <small>
              {dashboardSummary
                .lowStockIngredients
                .length > 0
                ? `${dashboardSummary.lowStockIngredients.length} con stock bajo`
                : 'Stock en nivel normal'}
            </small>
          </div>
        </article>

        <article className="summary-card">
          <span className="card-icon">
            🪑
          </span>

          <div>
            <p>Mesas disponibles</p>

            <strong>
              {
                dashboardSummary
                  .availableTables.length
              }
            </strong>

            <small>
              De{' '}
              {
                dashboardSummary
                  .activeTables.length
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
                Disponibilidad actual del
                local
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() =>
                navigate('/mesas')
              }
            >
              Ver todas
            </button>
          </div>

          {dashboardData.tables.length ===
          0 ? (
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
                        {table.capacity}{' '}
                        personas
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

              <p>
                Resumen de ingredientes
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() =>
                navigate('/inventario')
              }
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
                      {
                        principalIngredient.name
                      }
                    </strong>

                    <p>
                      {
                        ingredientCurrentStock
                      }{' '}
                      {
                        principalIngredient.unit
                      }{' '}
                      · mínimo{' '}
                      {
                        ingredientMinimumStock
                      }
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
                  {ingredientIsLow
                    ? '!'
                    : '✓'}
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
              No hay ingredientes
              registrados.
            </div>
          )}
        </article>
      </section>

      <section className="panel sales-panel">
        <div className="panel-header">
          <div>
            <h3>Ventas recientes</h3>

            <p>
              Últimas operaciones
              registradas
            </p>
          </div>

          <button
            className="text-button"
            type="button"
            onClick={() =>
              navigate('/ventas')
            }
          >
            Ver historial
          </button>
        </div>

        {recentSales.length === 0 ? (
          <div className="empty-state">
            Todavía no hay ventas
            registradas.
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
                      sale.status ===
                      'COMPLETED'
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
    </>
  );

  const salesPage = (
    <ModulePage
      title="Ventas"
      description="Historial de ventas y pedidos registrados."
      icon="🛒"
    >
      <section className="panel sales-panel">
        <div className="panel-header">
          <div>
            <h3>Historial de ventas</h3>

            <p>
              Operaciones registradas en
              la cafetería
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
          >
            + Nueva venta
          </button>
        </div>

        {dashboardData.sales.length ===
        0 ? (
          <div className="empty-state">
            No hay ventas registradas.
          </div>
        ) : (
          <div className="sales-table">
            <div className="sales-row sales-head">
              <span>Venta</span>
              <span>Productos</span>
              <span>Estado</span>
              <span>Total</span>
            </div>

            {dashboardData.sales.map(
              (sale) => (
                <div
                  className="sales-row"
                  key={sale.id}
                >
                  <span>
                    #{sale.id}
                    <small>
                      {' '}
                      {formatDate(
                        sale.createdAt,
                      )}
                    </small>
                  </span>

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
                        sale.status ===
                        'COMPLETED'
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
              ),
            )}
          </div>
        )}
      </section>
    </ModulePage>
  );

 const productsPage = (
    <ProductsPage
      accessToken={session.accessToken}
      onProductsChanged={() => {
        void loadDashboardData();
      }}
    />
  );

  const ingredientsPage = (
    <ModulePage
      title="Ingredientes"
      description="Gestión de materias primas y unidades de medida."
      icon="🥛"
    >
      <section className="panel sales-panel">
        <div className="panel-header">
          <div>
            <h3>
              Ingredientes registrados
            </h3>

            <p>
              Materias primas utilizadas
              en la cafetería
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
          >
            + Nuevo ingrediente
          </button>
        </div>

        {dashboardData.ingredients
          .length === 0 ? (
          <div className="empty-state">
            No hay ingredientes
            registrados.
          </div>
        ) : (
          <div className="sales-table">
            <div className="sales-row sales-head">
              <span>ID</span>
              <span>Ingrediente</span>
              <span>Unidad</span>
              <span>Stock</span>
            </div>

            {dashboardData.ingredients.map(
              (ingredient) => (
                <div
                  className="sales-row"
                  key={ingredient.id}
                >
                  <span>
                    #{ingredient.id}
                  </span>

                  <strong>
                    {ingredient.name}
                  </strong>

                  <span>
                    {ingredient.unit}
                  </span>

                  <strong>
                    {
                      ingredient.currentStock
                    }{' '}
                    {ingredient.unit}
                  </strong>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </ModulePage>
  );

  const inventoryPage = (
    <ModulePage
      title="Inventario"
      description="Control de existencias, stock mínimo y reposición."
      icon="📦"
    >
      <section className="panel sales-panel">
        <div className="panel-header">
          <div>
            <h3>Control de inventario</h3>

            <p>
              Estado actual de las
              existencias
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
          >
            + Registrar movimiento
          </button>
        </div>

        {dashboardData.ingredients
          .length === 0 ? (
          <div className="empty-state">
            No hay inventario registrado.
          </div>
        ) : (
          <div className="sales-table">
            <div className="sales-row sales-head">
              <span>Ingrediente</span>
              <span>Stock actual</span>
              <span>Stock mínimo</span>
              <span>Estado</span>
            </div>

            {dashboardData.ingredients.map(
              (ingredient) => {
                const currentStock =
                  Number(
                    ingredient.currentStock,
                  );

                const minimumStock =
                  Number(
                    ingredient.minimumStock,
                  );

                const isLow =
                  currentStock <=
                  minimumStock;

                return (
                  <div
                    className="sales-row"
                    key={ingredient.id}
                  >
                    <strong>
                      {ingredient.name}
                    </strong>

                    <span>
                      {currentStock}{' '}
                      {ingredient.unit}
                    </span>

                    <span>
                      {minimumStock}{' '}
                      {ingredient.unit}
                    </span>

                    <span>
                      <small
                        className={
                          isLow
                            ? 'sale-status'
                            : 'completed'
                        }
                      >
                        {isLow
                          ? 'Stock bajo'
                          : 'Normal'}
                      </small>
                    </span>
                  </div>
                );
              },
            )}
          </div>
        )}
      </section>
    </ModulePage>
  );

  const tablesPage = (
    <ModulePage
      title="Mesas"
      description="Disponibilidad, capacidad y estado de las mesas."
      icon="🪑"
    >
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Mesas del local</h3>

            <p>
              Disponibilidad actual del
              salón
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
          >
            + Nueva mesa
          </button>
        </div>

        {dashboardData.tables.length ===
        0 ? (
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
                      {table.capacity}{' '}
                      personas
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
      </section>
    </ModulePage>
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            ☕
          </div>

          <div>
            <h1>Cafetería</h1>
            <span>Inteligente</span>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <button
              className={
                location.pathname ===
                item.path
                  ? 'menu-item active'
                  : 'menu-item'
              }
              key={item.path}
              type="button"
              onClick={() =>
                navigate(item.path)
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            {initials}
          </div>

          <div className="sidebar-user-data">
            <strong>
              {session.user.name}
            </strong>

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
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={dashboardPage}
          />

          <Route
            path="/ventas"
            element={salesPage}
          />

          <Route
            path="/productos"
            element={productsPage}
          />

          <Route
            path="/ingredientes"
            element={ingredientsPage}
          />

          <Route
            path="/inventario"
            element={inventoryPage}
          />

          <Route
            path="/mesas"
            element={tablesPage}
          />

          <Route
            path="/reservas"
            element={
              <ModulePage
                title="Reservas"
                description="Calendario y administración de reservas."
                icon="📅"
              />
            }
          />

          <Route
            path="/usuarios"
            element={
              <ModulePage
                title="Usuarios"
                description="Administración de cuentas, roles y permisos."
                icon="👥"
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;