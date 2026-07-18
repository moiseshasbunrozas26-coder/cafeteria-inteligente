import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

function Dashboard() {
  return <h2>Dashboard funcionando</h2>;
}

function Productos() {
  return <h2>Página de productos funcionando</h2>;
}

function Inventario() {
  return <h2>Página de inventario funcionando</h2>;
}

function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/inventario">Inventario</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </div>
  );
}

export default App;