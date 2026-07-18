import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { apiRequest } from './api';
import './IngredientsPage.css';

type IngredientUnit =
  | 'GRAM'
  | 'KILOGRAM'
  | 'MILLILITER'
  | 'LITER'
  | 'UNIT';

interface Ingredient {
  id: number;
  name: string;
  unit: IngredientUnit;
  currentStock: string;
  minimumStock: string;
  costPerUnit?: string | null;
  active: boolean;
}

interface IngredientForm {
  name: string;
  unit: IngredientUnit;
  currentStock: string;
  minimumStock: string;
  costPerUnit: string;
  active: boolean;
}

interface IngredientsPageProps {
  accessToken: string;
  onIngredientsChanged?: () => void;
}

const emptyIngredientForm: IngredientForm = {
  name: '',
  unit: 'GRAM',
  currentStock: '0',
  minimumStock: '0',
  costPerUnit: '',
  active: true,
};

const unitLabels: Record<IngredientUnit, string> = {
  GRAM: 'Gramos',
  KILOGRAM: 'Kilogramos',
  MILLILITER: 'Mililitros',
  LITER: 'Litros',
  UNIT: 'Unidades',
};

const unitAbbreviations: Record<
  IngredientUnit,
  string
> = {
  GRAM: 'g',
  KILOGRAM: 'kg',
  MILLILITER: 'ml',
  LITER: 'L',
  UNIT: 'un.',
};

function parseNumericValue(value: string) {
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
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function IngredientsPage({
  accessToken,
  onIngredientsChanged,
}: IngredientsPageProps) {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>([]);

  const [form, setForm] =
    useState<IngredientForm>(
      emptyIngredientForm,
    );

  const [
    editingIngredientId,
    setEditingIngredientId,
  ] = useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    processingIngredientId,
    setProcessingIngredientId,
  ] = useState<number | null>(null);

  const [error, setError] =
    useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const loadIngredients =
    useCallback(async () => {
      setLoading(true);
      setError('');

      try {
        const result =
          await apiRequest<Ingredient[]>(
            '/ingredients',
            accessToken,
          );

        setIngredients(result);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No fue posible cargar los ingredientes.',
        );
      } finally {
        setLoading(false);
      }
    }, [accessToken]);

  useEffect(() => {
    void loadIngredients();
  }, [loadIngredients]);

  function updateForm(
    field: keyof IngredientForm,
    value: string | boolean,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyIngredientForm);
    setEditingIngredientId(null);
  }

  function handleEdit(
    ingredient: Ingredient,
  ) {
    setEditingIngredientId(
      ingredient.id,
    );

    setForm({
      name: ingredient.name,
      unit: ingredient.unit,
      currentStock:
        ingredient.currentStock,
      minimumStock:
        ingredient.minimumStock,
      costPerUnit:
        ingredient.costPerUnit ?? '',
      active: ingredient.active,
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

    setError('');
    setSuccessMessage('');

    const normalizedName =
      form.name.trim();

    const currentStock =
      parseNumericValue(
        form.currentStock,
      );

    const minimumStock =
      parseNumericValue(
        form.minimumStock,
      );

    const costPerUnit =
      form.costPerUnit.trim() === ''
        ? undefined
        : parseNumericValue(
            form.costPerUnit,
          );

    if (!normalizedName) {
      setError(
        'Debes ingresar el nombre del ingrediente.',
      );

      return;
    }

    if (
      !Number.isFinite(currentStock) ||
      currentStock < 0
    ) {
      setError(
        'El stock actual debe ser un número igual o mayor que cero.',
      );

      return;
    }

    if (
      !Number.isFinite(minimumStock) ||
      minimumStock < 0
    ) {
      setError(
        'El stock mínimo debe ser un número igual o mayor que cero.',
      );

      return;
    }

    if (
      costPerUnit !== undefined &&
      (!Number.isFinite(costPerUnit) ||
        costPerUnit < 0)
    ) {
      setError(
        'El costo por unidad debe ser un número igual o mayor que cero.',
      );

      return;
    }

    const payload = {
      name: normalizedName,
      unit: form.unit,
      currentStock,
      minimumStock,
      active: form.active,
      ...(costPerUnit !== undefined
        ? { costPerUnit }
        : {}),
    };

    setSaving(true);

    try {
      if (
        editingIngredientId !== null
      ) {
        await apiRequest<Ingredient>(
          `/ingredients/${editingIngredientId}`,
          accessToken,
          {
            method: 'PATCH',
            body: JSON.stringify(payload),
          },
        );

        setSuccessMessage(
          'Ingrediente actualizado correctamente.',
        );
      } else {
        await apiRequest<Ingredient>(
          '/ingredients',
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify(payload),
          },
        );

        setSuccessMessage(
          'Ingrediente creado correctamente.',
        );
      }

      resetForm();
      await loadIngredients();
      onIngredientsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible guardar el ingrediente.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeStatus(
    ingredient: Ingredient,
  ) {
    const action = ingredient.active
      ? 'desactivar'
      : 'reactivar';

    const confirmed = window.confirm(
      `¿Deseas ${action} el ingrediente "${ingredient.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setProcessingIngredientId(
      ingredient.id,
    );

    setError('');
    setSuccessMessage('');

    try {
      if (ingredient.active) {
        await apiRequest<Ingredient>(
          `/ingredients/${ingredient.id}`,
          accessToken,
          {
            method: 'DELETE',
          },
        );

        setSuccessMessage(
          'Ingrediente desactivado correctamente.',
        );
      } else {
        await apiRequest<Ingredient>(
          `/ingredients/${ingredient.id}`,
          accessToken,
          {
            method: 'PATCH',
            body: JSON.stringify({
              active: true,
            }),
          },
        );

        setSuccessMessage(
          'Ingrediente reactivado correctamente.',
        );
      }

      await loadIngredients();
      onIngredientsChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `No fue posible ${action} el ingrediente.`,
      );
    } finally {
      setProcessingIngredientId(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>🥛 Ingredientes</h2>

          <p>
            Administra las materias
            primas, existencias y niveles
            mínimos de reposición.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            void loadIngredients()
          }
          disabled={loading}
        >
          {loading
            ? 'Actualizando...'
            : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="ingredient-message ingredient-error">
          <strong>
            Ocurrió un problema
          </strong>

          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="ingredient-message ingredient-success">
          <strong>
            Operación completada
          </strong>

          <span>{successMessage}</span>
        </div>
      )}

      <section className="ingredients-layout">
        <article className="panel ingredient-form-panel">
          <div className="panel-header">
            <div>
              <h3>
                {editingIngredientId !==
                null
                  ? 'Editar ingrediente'
                  : 'Nuevo ingrediente'}
              </h3>

              <p>
                Completa los datos de la
                materia prima.
              </p>
            </div>
          </div>

          <form
            className="ingredient-form"
            onSubmit={handleSubmit}
          >
            <label className="ingredient-field">
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
                placeholder="Ejemplo: Café en grano"
                maxLength={100}
                disabled={saving}
              />
            </label>

            <label className="ingredient-field">
              <span>
                Unidad de medida *
              </span>

              <select
                value={form.unit}
                onChange={(event) =>
                  updateForm(
                    'unit',
                    event.target
                      .value as IngredientUnit,
                  )
                }
                disabled={saving}
              >
                {Object.entries(
                  unitLabels,
                ).map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <div className="ingredient-stock-grid">
              <label className="ingredient-field">
                <span>
                  Stock actual *
                </span>

                <input
                  type="number"
                  value={
                    form.currentStock
                  }
                  onChange={(event) =>
                    updateForm(
                      'currentStock',
                      event.target.value,
                    )
                  }
                  min="0"
                  step="0.001"
                  disabled={saving}
                />
              </label>

              <label className="ingredient-field">
                <span>
                  Stock mínimo *
                </span>

                <input
                  type="number"
                  value={
                    form.minimumStock
                  }
                  onChange={(event) =>
                    updateForm(
                      'minimumStock',
                      event.target.value,
                    )
                  }
                  min="0"
                  step="0.001"
                  disabled={saving}
                />
              </label>
            </div>

            <label className="ingredient-field">
              <span>
                Costo por unidad
              </span>

              <input
                type="number"
                value={
                  form.costPerUnit
                }
                onChange={(event) =>
                  updateForm(
                    'costPerUnit',
                    event.target.value,
                  )
                }
                placeholder="Ejemplo: 12.50"
                min="0"
                step="0.01"
                disabled={saving}
              />
            </label>

            <label className="ingredient-checkbox">
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
                Ingrediente activo
              </span>
            </label>

            <div className="ingredient-form-actions">
              {editingIngredientId !==
                null && (
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
                  : editingIngredientId !==
                      null
                    ? 'Guardar cambios'
                    : '+ Crear ingrediente'}
              </button>
            </div>
          </form>
        </article>

        <article className="panel ingredients-list-panel">
          <div className="panel-header">
            <div>
              <h3>
                Ingredientes registrados
              </h3>

              <p>
                {ingredients.length}{' '}
                {ingredients.length === 1
                  ? 'ingrediente encontrado'
                  : 'ingredientes encontrados'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Cargando ingredientes...
            </div>
          ) : ingredients.length === 0 ? (
            <div className="empty-state">
              Todavía no hay ingredientes
              registrados.
            </div>
          ) : (
            <div className="ingredients-table-container">
              <table className="ingredients-table">
                <thead>
                  <tr>
                    <th>Ingrediente</th>
                    <th>Unidad</th>
                    <th>Stock</th>
                    <th>Mínimo</th>
                    <th>Costo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {ingredients.map(
                    (ingredient) => {
                      const isLowStock =
                        Number(
                          ingredient.currentStock,
                        ) <=
                        Number(
                          ingredient.minimumStock,
                        );

                      return (
                        <tr
                          key={
                            ingredient.id
                          }
                        >
                          <td>
                            <div className="ingredient-name-cell">
                              <strong>
                                {
                                  ingredient.name
                                }
                              </strong>

                              <small>
                                #
                                {
                                  ingredient.id
                                }
                              </small>
                            </div>
                          </td>

                          <td>
                            {
                              unitLabels[
                                ingredient
                                  .unit
                              ]
                            }
                          </td>

                          <td>
                            <strong>
                              {formatQuantity(
                                ingredient.currentStock,
                              )}{' '}
                              {
                                unitAbbreviations[
                                  ingredient
                                    .unit
                                ]
                              }
                            </strong>
                          </td>

                          <td>
                            {formatQuantity(
                              ingredient.minimumStock,
                            )}{' '}
                            {
                              unitAbbreviations[
                                ingredient
                                  .unit
                              ]
                            }
                          </td>

                          <td>
                            {ingredient.costPerUnit
                              ? formatCurrency(
                                  ingredient.costPerUnit,
                                )
                              : 'Sin costo'}
                          </td>

                          <td>
                            <span
                              className={
                                !ingredient.active
                                  ? 'ingredient-status inactive'
                                  : isLowStock
                                    ? 'ingredient-status low'
                                    : 'ingredient-status normal'
                              }
                            >
                              {!ingredient.active
                                ? 'Inactivo'
                                : isLowStock
                                  ? 'Stock bajo'
                                  : 'Normal'}
                            </span>
                          </td>

                          <td>
                            <div className="ingredient-row-actions">
                              <button
                                className="ingredient-edit-button"
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    ingredient,
                                  )
                                }
                                disabled={
                                  processingIngredientId ===
                                  ingredient.id
                                }
                              >
                                Editar
                              </button>

                              <button
                                className={
                                  ingredient.active
                                    ? 'ingredient-disable-button'
                                    : 'ingredient-enable-button'
                                }
                                type="button"
                                onClick={() =>
                                  void handleChangeStatus(
                                    ingredient,
                                  )
                                }
                                disabled={
                                  processingIngredientId ===
                                  ingredient.id
                                }
                              >
                                {processingIngredientId ===
                                ingredient.id
                                  ? 'Procesando...'
                                  : ingredient.active
                                    ? 'Desactivar'
                                    : 'Reactivar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </>
  );
}