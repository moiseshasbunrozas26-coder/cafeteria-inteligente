import {
  type ReactNode,
  useCallback,
  useEffect,
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
import { IngredientsPage } from './IngredientsPage';
import { InventoryPage } from './InventoryPage';
import { RecipesPage } from './RecipesPage';
import { SalesPage } from './SalesPage';
import { TablesPage } from './TablesPage';
import { ReservationsPage } from './ReservationsPage';
import { UsersPage } from './UsersPage';
import { DashboardPage } from './DashboardPage';
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
    label: 'Recetas',
    path: '/recetas',
    icon: '📋',
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

export const tableStatusLabels: Record<
  TableStatus,
  string
> = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Ocupada',
  RESERVED: 'Reservada',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

export const tableStatusClasses: Record<
  TableStatus,
  string
> = {
  AVAILABLE: 'disponible',
  OCCUPIED: 'ocupada',
  RESERVED: 'reservada',
  OUT_OF_SERVICE: 'fuera-de-servicio',
};

export const saleStatusLabels: Record<
  SaleStatus,
  string
> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}


export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Buenos días';
  }

  if (hour < 20) {
    return 'Buenas tardes';
  }

  return 'Buenas noches';
}

export function ModulePage({
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

  const dashboardPage = (
    <DashboardPage
      accessToken={session.accessToken}
      firstName={firstName}
      products={dashboardData.products}
      ingredients={dashboardData.ingredients}
      tables={dashboardData.tables}
      sales={dashboardData.sales}
      loading={loading}
      error={dashboardError}
      onRefresh={() => {
        void loadDashboardData();
      }}
      onNewSale={() => {
        navigate('/ventas');
      }}
      onGoToSales={() => {
        navigate('/ventas');
      }}
      onGoToInventory={() => {
        navigate('/inventario');
      }}
      onGoToTables={() => {
        navigate('/mesas');
      }}
      onGoToReservations={() => {
        navigate('/reservas');
      }}
    />
  );
  const salesPage = (
    <SalesPage
      accessToken={session.accessToken}
      onSaleCreated={() => {
        void loadDashboardData();
      }}
    />
  );

  const productsPage = (
    <ProductsPage
      accessToken={session.accessToken}
      onProductsChanged={() => {
        void loadDashboardData();
      }}
    />
  );

  const recipesPage = (
    <RecipesPage
      accessToken={session.accessToken}
      canManage={session.user.role === 'ADMIN'}
    />
  );

  const ingredientsPage = (
    <IngredientsPage
      accessToken={session.accessToken}
      onIngredientsChanged={() => {
        void loadDashboardData();
      }}
    />
  );

  const inventoryPage = (
    <InventoryPage
      accessToken={session.accessToken}
      canManage={session.user.role === 'ADMIN'}
      onInventoryChanged={() => {
        void loadDashboardData();
      }}
    />
  );
  const tablesPage = (
    <TablesPage
      accessToken={session.accessToken}
      canCreateDelete={session.user.role === 'ADMIN'}
      canUpdate={
        session.user.role === 'ADMIN' ||
        session.user.role === 'STAFF'
      }
      onTablesChanged={() => {
        void loadDashboardData();
      }}
    />
  );
  const reservationsPage = (
    <ReservationsPage
      accessToken={session.accessToken}
      canManage={
        session.user.role === 'ADMIN' ||
        session.user.role === 'STAFF'
      }
      onReservationsChanged={() => {
        void loadDashboardData();
      }}
    />
  );
  const usersPage = (
    <UsersPage
      accessToken={session.accessToken}
      currentUserId={session.user.id}
      canManage={session.user.role === 'ADMIN'}
    />
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
            path="/recetas"
            element={recipesPage}
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
            element={reservationsPage}
          />
          <Route
            path="/usuarios"
            element={usersPage}
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