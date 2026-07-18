import { useState, type FormEvent } from 'react';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  active: boolean;
}

export interface Session {
  accessToken: string;
  user: AuthUser;
}

interface LoginPageProps {
  onLogin: (session: Session) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('alex@cafeteria.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3000/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ?? 'No fue posible iniciar sesión.',
        );
      }

      onLogin(data as Session);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible conectar con el servidor.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">☕</div>

          <div>
            <h1>Cafetería Inteligente</h1>
            <p>Administración y control del negocio</p>
          </div>
        </div>

        <div className="login-heading">
          <p className="eyebrow">Acceso al sistema</p>
          <h2>Iniciar sesión</h2>
          <p>
            Ingresa tus credenciales para acceder al panel.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Correo electrónico

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-footer">
          Plataforma de gestión para cafeterías
        </p>
      </section>
    </main>
  );
}