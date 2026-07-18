import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from './api';
import './RecipesPage.css';

type IngredientUnit =
  | 'GRAM'
  | 'KILOGRAM'
  | 'MILLILITER'
  | 'LITER'
  | 'UNIT';

interface Product {
  id: number;
  name: string;
  price: string;
  active: boolean;
}

interface Ingredient {
  id: number;
  name: string;
  unit: IngredientUnit;
  currentStock: string;
  costPerUnit?: string | null;
  active: boolean;
}

interface RecipeIngredient {
  productId: number;
  ingredientId: number;
  quantity: string;
  ingredient: Ingredient;
}

interface Recipe {
  id: number;
  name: string;
  price: string;
  active: boolean;
  ingredients: RecipeIngredient[];
}

interface RecipesPageProps {
  accessToken: string;
  canManage?: boolean;
}

const unitLabels: Record<IngredientUnit, string> = {
  GRAM: 'g',
  KILOGRAM: 'kg',
  MILLILITER: 'ml',
  LITER: 'L',
  UNIT: 'un.',
};

function parseNumber(value: string) {
  return Number(value.replace(',', '.'));
}

function formatQuantity(value: string | number) {
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 3,
  }).format(Number(value));
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function RecipesPage({
  accessToken,
  canManage = true,
}: RecipesPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [productsResult, ingredientsResult] = await Promise.all([
        apiRequest<Product[]>('/products', accessToken),
        apiRequest<Ingredient[]>('/ingredients', accessToken),
      ]);

      setProducts(productsResult);
      setIngredients(ingredientsResult);
      setSelectedProductId((current) => {
        if (current && productsResult.some((item) => item.id === Number(current))) {
          return current;
        }

        const first = productsResult.find((item) => item.active) ?? productsResult[0];
        return first?.id.toString() ?? '';
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar productos e ingredientes.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const loadRecipe = useCallback(
    async (productId: number) => {
      setLoading(true);
      setError('');

      try {
        const result = await apiRequest<Recipe>(
          `/recipes/${productId}`,
          accessToken,
        );
        setRecipe(result);
      } catch (requestError) {
        setRecipe(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No fue posible cargar la receta.',
        );
      } finally {
        setLoading(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (!selectedProductId) {
      setRecipe(null);
      return;
    }

    setIngredientId('');
    setQuantity('');
    setEditingId(null);
    setSuccess('');
    void loadRecipe(Number(selectedProductId));
  }, [loadRecipe, selectedProductId]);

  const availableIngredients = useMemo(() => {
    const usedIds = new Set(
      recipe?.ingredients.map((item) => item.ingredientId) ?? [],
    );

    return ingredients.filter(
      (item) => item.active && !usedIds.has(item.id),
    );
  }, [ingredients, recipe]);

  const estimatedCost = useMemo(
    () =>
      recipe?.ingredients.reduce(
        (total, item) =>
          total +
          Number(item.quantity) *
            Number(item.ingredient.costPerUnit ?? 0),
        0,
      ) ?? 0,
    [recipe],
  );

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const productId = Number(selectedProductId);
    const parsedIngredientId = Number(ingredientId);
    const parsedQuantity = parseNumber(quantity);

    if (!productId || !parsedIngredientId) {
      setError('Selecciona un producto y un ingrediente.');
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0.001) {
      setError('La cantidad debe ser igual o mayor que 0,001.');
      return;
    }

    setSaving(true);

    try {
      await apiRequest(
        `/recipes/${productId}/ingredients`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({
            ingredientId: parsedIngredientId,
            quantity: parsedQuantity,
          }),
        },
      );

      setIngredientId('');
      setQuantity('');
      setSuccess('Ingrediente agregado correctamente.');
      await loadRecipe(productId);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible agregar el ingrediente.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(item: RecipeIngredient) {
    const parsedQuantity = parseNumber(editingQuantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0.001) {
      setError('La cantidad debe ser igual o mayor que 0,001.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await apiRequest(
        `/recipes/${selectedProductId}/ingredients/${item.ingredientId}`,
        accessToken,
        {
          method: 'PATCH',
          body: JSON.stringify({ quantity: parsedQuantity }),
        },
      );

      setEditingId(null);
      setEditingQuantity('');
      setSuccess('Cantidad actualizada correctamente.');
      await loadRecipe(Number(selectedProductId));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible actualizar la cantidad.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(item: RecipeIngredient) {
    const confirmed = window.confirm(
      `¿Quitar "${item.ingredient.name}" de la receta?`,
    );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await apiRequest(
        `/recipes/${selectedProductId}/ingredients/${item.ingredientId}`,
        accessToken,
        { method: 'DELETE' },
      );

      setSuccess('Ingrediente eliminado correctamente.');
      await loadRecipe(Number(selectedProductId));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible eliminar el ingrediente.',
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
          <h2>📋 Recetas</h2>
          <p>Define los ingredientes utilizados por cada producto.</p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => void loadCatalog()}
          disabled={loading}
        >
          {loading ? 'Actualizando...' : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="recipe-message recipe-error">
          <strong>Ocurrió un problema</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="recipe-message recipe-success">
          <strong>Operación completada</strong>
          <span>{success}</span>
        </div>
      )}

      <section className="panel recipe-selector">
        <div>
          <h3>Producto</h3>
          <p>Selecciona el producto cuya receta quieres configurar.</p>
        </div>

        <select
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
          disabled={products.length === 0}
        >
          {products.length === 0 ? (
            <option value="">No hay productos</option>
          ) : (
            products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}{product.active ? '' : ' (inactivo)'}
              </option>
            ))
          )}
        </select>
      </section>

      {recipe && (
        <section className="recipe-summary-grid">
          <article className="recipe-summary-card">
            <span>Producto</span>
            <strong>{recipe.name}</strong>
            <small>{recipe.active ? 'Activo' : 'Inactivo'}</small>
          </article>

          <article className="recipe-summary-card">
            <span>Precio de venta</span>
            <strong>{formatCurrency(recipe.price)}</strong>
            <small>Valor del producto</small>
          </article>

          <article className="recipe-summary-card">
            <span>Ingredientes</span>
            <strong>{recipe.ingredients.length}</strong>
            <small>Elementos configurados</small>
          </article>

          <article className="recipe-summary-card">
            <span>Costo estimado</span>
            <strong>{formatCurrency(estimatedCost)}</strong>
            <small>Según costos registrados</small>
          </article>
        </section>
      )}

      <section className="recipes-layout">
        <article className="panel recipe-form-panel">
          <div className="panel-header">
            <div>
              <h3>Agregar ingrediente</h3>
              <p>Cantidad utilizada para preparar una unidad.</p>
            </div>
          </div>

          {!canManage ? (
            <div className="recipe-readonly">
              Solo un administrador puede modificar recetas.
            </div>
          ) : availableIngredients.length === 0 ? (
            <div className="empty-state">
              No quedan ingredientes activos por agregar.
            </div>
          ) : (
            <form className="recipe-form" onSubmit={handleAdd}>
              <label className="recipe-field">
                <span>Ingrediente *</span>
                <select
                  value={ingredientId}
                  onChange={(event) => setIngredientId(event.target.value)}
                  disabled={saving}
                >
                  <option value="">Selecciona un ingrediente</option>
                  {availableIngredients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · {unitLabels[item.unit]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="recipe-field">
                <span>Cantidad por producto *</span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  min="0.001"
                  step="0.001"
                  placeholder="Ejemplo: 18"
                  disabled={saving}
                />
              </label>

              <button
                className="primary-button recipe-submit-button"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Guardando...' : '+ Agregar a la receta'}
              </button>
            </form>
          )}
        </article>

        <article className="panel recipe-list-panel">
          <div className="panel-header">
            <div>
              <h3>Composición de la receta</h3>
              <p>Ingredientes necesarios para una unidad del producto.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Cargando receta...</div>
          ) : !recipe || recipe.ingredients.length === 0 ? (
            <div className="empty-state">
              Este producto todavía no tiene una receta configurada.
            </div>
          ) : (
            <div className="recipe-table-container">
              <table className="recipe-table">
                <thead>
                  <tr>
                    <th>Ingrediente</th>
                    <th>Cantidad</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {recipe.ingredients.map((item) => (
                    <tr key={item.ingredientId}>
                      <td>
                        <strong>{item.ingredient.name}</strong>
                      </td>

                      <td>
                        {editingId === item.ingredientId ? (
                          <input
                            className="recipe-inline-input"
                            type="number"
                            value={editingQuantity}
                            onChange={(event) => setEditingQuantity(event.target.value)}
                            min="0.001"
                            step="0.001"
                          />
                        ) : (
                          <strong>
                            {formatQuantity(item.quantity)} {unitLabels[item.ingredient.unit]}
                          </strong>
                        )}
                      </td>

                      <td>
                        {formatQuantity(item.ingredient.currentStock)}{' '}
                        {unitLabels[item.ingredient.unit]}
                      </td>

                      <td>
                        <div className="recipe-actions">
                          {editingId === item.ingredientId ? (
                            <>
                              <button
                                className="recipe-save-button"
                                type="button"
                                onClick={() => void handleUpdate(item)}
                                disabled={saving}
                              >
                                Guardar
                              </button>

                              <button
                                className="recipe-cancel-button"
                                type="button"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingQuantity('');
                                }}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="recipe-edit-button"
                                type="button"
                                onClick={() => {
                                  setEditingId(item.ingredientId);
                                  setEditingQuantity(item.quantity);
                                }}
                                disabled={!canManage || saving}
                              >
                                Editar
                              </button>

                              <button
                                className="recipe-remove-button"
                                type="button"
                                onClick={() => void handleRemove(item)}
                                disabled={!canManage || saving}
                              >
                                Quitar
                              </button>
                            </>
                          )}
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
