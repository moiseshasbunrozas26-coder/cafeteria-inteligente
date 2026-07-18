import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { apiRequest } from './api';
import './ProductsPage.css';

interface ProductCategory {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  active: boolean;
  categoryId?: number | null;
  category?: ProductCategory | null;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  active: boolean;
}

interface ProductsPageProps {
  accessToken: string;
  onProductsChanged?: () => void;
}

const emptyProductForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  active: true,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductsPage({
  accessToken,
  onProductsChanged,
}: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] =
    useState<ProductForm>(emptyProductForm);

  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [processingProductId, setProcessingProductId] =
    useState<number | null>(null);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] =
    useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await apiRequest<Product[]>(
        '/products',
        accessToken,
      );

      setProducts(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar los productos.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function updateForm(
    field: keyof ProductForm,
    value: string | boolean,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyProductForm);
    setEditingProductId(null);
  }

  function handleEdit(product: Product) {
    setEditingProductId(product.id);

    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      active: product.active,
    });

    setError('');
    setSuccessMessage('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedName = form.name.trim();
    const numericPrice = Number(
      form.price.replace(',', '.'),
    );

    setError('');
    setSuccessMessage('');

    if (!normalizedName) {
      setError(
        'Debes ingresar el nombre del producto.',
      );

      return;
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setError(
        'El precio debe ser un número igual o mayor que cero.',
      );

      return;
    }

    const payload = {
      name: normalizedName,
      description: form.description.trim(),
      price: numericPrice,
      active: form.active,
    };

    setSaving(true);

    try {
      if (editingProductId !== null) {
        await apiRequest<Product>(
          `/products/${editingProductId}`,
          accessToken,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          },
        );

        setSuccessMessage(
          'Producto actualizado correctamente.',
        );
      } else {
        await apiRequest<Product>(
          '/products',
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify(payload),
          },
        );

        setSuccessMessage(
          'Producto creado correctamente.',
        );
      }

      resetForm();
      await loadProducts();
      onProductsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible guardar el producto.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeStatus(
    product: Product,
  ) {
    const action = product.active
      ? 'desactivar'
      : 'reactivar';

    const confirmed = window.confirm(
      `¿Deseas ${action} el producto "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingProductId(product.id);
    setError('');
    setSuccessMessage('');

    try {
      if (product.active) {
        await apiRequest<Product>(
          `/products/${product.id}`,
          accessToken,
          {
            method: 'DELETE',
          },
        );

        setSuccessMessage(
          'Producto desactivado correctamente.',
        );
      } else {
        await apiRequest<Product>(
          `/products/${product.id}`,
          accessToken,
          {
            method: 'PATCH',
            body: JSON.stringify({
              active: true,
            }),
          },
        );

        setSuccessMessage(
          'Producto reactivado correctamente.',
        );
      }

      await loadProducts();
      onProductsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `No fue posible ${action} el producto.`,
      );
    } finally {
      setProcessingProductId(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>☕ Productos</h2>

          <p>
            Crea, modifica y administra los productos
            disponibles en la cafetería.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => void loadProducts()}
          disabled={loading}
        >
          {loading
            ? 'Actualizando...'
            : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="product-message product-error">
          <strong>Ocurrió un problema</strong>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="product-message product-success">
          <strong>Operación completada</strong>
          <span>{successMessage}</span>
        </div>
      )}

      <section className="products-layout">
        <article className="panel product-form-panel">
          <div className="panel-header">
            <div>
              <h3>
                {editingProductId !== null
                  ? 'Editar producto'
                  : 'Nuevo producto'}
              </h3>

              <p>
                Completa la información del producto.
              </p>
            </div>
          </div>

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >
            <label className="product-field">
              <span>Nombre *</span>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateForm(
                    'name',
                    event.target.value,
                  )
                }
                placeholder="Ejemplo: Café americano"
                maxLength={100}
                disabled={saving}
              />
            </label>

            <label className="product-field">
              <span>Descripción</span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm(
                    'description',
                    event.target.value,
                  )
                }
                placeholder="Descripción breve del producto"
                rows={4}
                maxLength={500}
                disabled={saving}
              />
            </label>

            <label className="product-field">
              <span>Precio *</span>

              <input
                type="number"
                value={form.price}
                onChange={(event) =>
                  updateForm(
                    'price',
                    event.target.value,
                  )
                }
                placeholder="Ejemplo: 2500"
                min="0"
                step="1"
                disabled={saving}
              />
            </label>

            <label className="product-checkbox">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  updateForm(
                    'active',
                    event.target.checked,
                  )
                }
                disabled={saving}
              />

              <span>
                Producto disponible para la venta
              </span>
            </label>

            <div className="product-form-actions">
              {editingProductId !== null && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Guardando...'
                  : editingProductId !== null
                    ? 'Guardar cambios'
                    : '+ Crear producto'}
              </button>
            </div>
          </form>
        </article>

        <article className="panel products-list-panel">
          <div className="panel-header">
            <div>
              <h3>Productos registrados</h3>

              <p>
                {products.length}{' '}
                {products.length === 1
                  ? 'producto encontrado'
                  : 'productos encontrados'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              Todavía no hay productos registrados.
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>#{product.id}</td>

                      <td>
                        <div className="product-name-cell">
                          <strong>{product.name}</strong>

                          <small>
                            {product.description ||
                              'Sin descripción'}
                          </small>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            Number(product.price),
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={
                            product.active
                              ? 'product-status active'
                              : 'product-status inactive'
                          }
                        >
                          {product.active
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>

                      <td>
                        <div className="product-row-actions">
                          <button
                            className="product-edit-button"
                            type="button"
                            onClick={() =>
                              handleEdit(product)
                            }
                            disabled={
                              processingProductId ===
                              product.id
                            }
                          >
                            Editar
                          </button>

                          <button
                            className={
                              product.active
                                ? 'product-disable-button'
                                : 'product-enable-button'
                            }
                            type="button"
                            onClick={() =>
                              void handleChangeStatus(
                                product,
                              )
                            }
                            disabled={
                              processingProductId ===
                              product.id
                            }
                          >
                            {processingProductId ===
                            product.id
                              ? 'Procesando...'
                              : product.active
                                ? 'Desactivar'
                                : 'Reactivar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </>
  );
}