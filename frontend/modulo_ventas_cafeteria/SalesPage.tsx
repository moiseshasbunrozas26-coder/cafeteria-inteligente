import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';
import './SalesPage.css';

interface Product {
  id: number;
  name: string;
  price: string;
  active: boolean;
}

interface SaleItem {
  id: number;
  quantity: number;
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

interface CartItem {
  product: Product;
  quantity: number;
}

interface SalesPageProps {
  accessToken: string;
  onSaleCreated?: () => void;
}

const statusLabels = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

function money(value: string | number) {
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

export function SalesPage({
  accessToken,
  onSaleCreated,
}: SalesPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [productData, saleData] = await Promise.all([
        apiRequest<Product[]>('/products', accessToken),
        apiRequest<Sale[]>('/sales', accessToken),
      ]);

      const activeProducts = productData.filter(
        (product) => product.active,
      );

      setProducts(activeProducts);
      setSales(saleData);

      setSelectedProductId((current) => {
        if (
          current &&
          activeProducts.some(
            (product) => product.id === Number(current),
          )
        ) {
          return current;
        }

        return activeProducts[0]?.id.toString() ?? '';
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar las ventas.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.product.price) * item.quantity,
        0,
      ),
    [cart],
  );

  const units = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  function addProduct() {
    const product = products.find(
      (item) => item.id === Number(selectedProductId),
    );

    if (!product) {
      setError('Debes seleccionar un producto.');
      return;
    }

    setError('');
    setSuccess('');

    setCart((current) => {
      const exists = current.some(
        (item) => item.product.id === product.id,
      );

      if (exists) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  }

  function changeQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      setCart((current) =>
        current.filter((item) => item.product.id !== productId),
      );
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  async function confirmSale() {
    if (cart.length === 0) {
      setError('Debes agregar al menos un producto.');
      return;
    }

    if (!window.confirm(`¿Registrar la venta por ${money(total)}?`)) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiRequest<Sale>(
        '/sales',
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          }),
        },
      );

      setLastSale(result);
      setCart([]);
      setSuccess(`Venta #${result.id} registrada correctamente.`);

      await loadData();
      onSaleCreated?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible registrar la venta.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Panel administrativo</p>
          <h2>🛒 Ventas</h2>
          <p>
            Registra pedidos y descuenta automáticamente los
            ingredientes definidos en cada receta.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => void loadData()}
          disabled={loading}
        >
          {loading ? 'Actualizando...' : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="sales-alert sales-error">
          <strong>No fue posible completar la operación</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="sales-alert sales-success">
          <strong>Venta completada</strong>
          <span>{success}</span>
        </div>
      )}

      <section className="sales-summary-grid">
        <article className="sales-summary-card">
          <span>Productos activos</span>
          <strong>{products.length}</strong>
          <small>Disponibles para vender</small>
        </article>

        <article className="sales-summary-card">
          <span>Unidades en pedido</span>
          <strong>{units}</strong>
          <small>Productos seleccionados</small>
        </article>

        <article className="sales-summary-card">
          <span>Total actual</span>
          <strong>{money(total)}</strong>
          <small>Antes de confirmar</small>
        </article>
      </section>

      <section className="sales-main-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h3>Nueva venta</h3>
              <p>Agrega productos y define sus cantidades.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              No hay productos activos para vender.
            </div>
          ) : (
            <>
              <div className="sales-picker">
                <label>
                  <span>Producto</span>
                  <select
                    value={selectedProductId}
                    onChange={(event) =>
                      setSelectedProductId(event.target.value)
                    }
                    disabled={saving}
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {money(product.price)}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="primary-button"
                  type="button"
                  onClick={addProduct}
                  disabled={saving || !selectedProductId}
                >
                  + Agregar
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="empty-state sales-empty-cart">
                  Todavía no agregas productos.
                </div>
              ) : (
                <div className="sales-cart">
                  {cart.map((item) => (
                    <div className="sales-cart-row" key={item.product.id}>
                      <div>
                        <strong>{item.product.name}</strong>
                        <small>{money(item.product.price)} por unidad</small>
                      </div>

                      <div className="sales-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.product.id,
                              item.quantity - 1,
                            )
                          }
                        >
                          −
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            changeQuantity(
                              item.product.id,
                              Math.max(
                                1,
                                Number(event.target.value) || 1,
                              ),
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.product.id,
                              item.quantity + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <strong>
                        {money(
                          Number(item.product.price) *
                            item.quantity,
                        )}
                      </strong>

                      <button
                        className="sales-remove"
                        type="button"
                        onClick={() => changeQuantity(item.product.id, 0)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="sales-checkout">
                <div>
                  <span>Total de la venta</span>
                  <strong>{money(total)}</strong>
                </div>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => void confirmSale()}
                  disabled={saving || cart.length === 0}
                >
                  {saving ? 'Registrando...' : 'Confirmar venta'}
                </button>
              </div>
            </>
          )}
        </article>

        <article className="panel sales-receipt-panel">
          <div className="panel-header">
            <div>
              <h3>Último comprobante</h3>
              <p>Resumen de la venta registrada.</p>
            </div>
          </div>

          {!lastSale ? (
            <div className="empty-state">
              El comprobante aparecerá después de una venta.
            </div>
          ) : (
            <div className="sales-receipt">
              <div>
                <span>Venta</span>
                <strong>#{lastSale.id}</strong>
              </div>

              {lastSale.items.map((item) => (
                <p key={item.id}>
                  <span>
                    {item.quantity} × {item.product.name}
                  </span>
                  <strong>{money(item.subtotal)}</strong>
                </p>
              ))}

              <div className="sales-receipt-total">
                <span>Total pagado</span>
                <strong>{money(lastSale.total)}</strong>
              </div>
            </div>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Historial de ventas</h3>
            <p>Operaciones registradas en la cafetería.</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Cargando historial...</div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            Todavía no hay ventas registradas.
          </div>
        ) : (
          <div className="sales-table-wrap">
            <table className="sales-page-table">
              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td><strong>#{sale.id}</strong></td>
                    <td>{dateTime(sale.createdAt)}</td>
                    <td>
                      {sale.items
                        .map(
                          (item) =>
                            `${item.quantity} × ${item.product.name}`,
                        )
                        .join(', ')}
                    </td>
                    <td>
                      <span
                        className={`sales-state ${sale.status.toLowerCase()}`}
                      >
                        {statusLabels[sale.status]}
                      </span>
                    </td>
                    <td><strong>{money(sale.total)}</strong></td>
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
