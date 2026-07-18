import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { apiRequest } from './api';
import './InventoryPage.css';

type IngredientUnit =
  | 'GRAM'
  | 'KILOGRAM'
  | 'MILLILITER'
  | 'LITER'
  | 'UNIT';

type MovementType =
  | 'IN'
  | 'OUT'
  | 'ADJUSTMENT';

interface Ingredient {
  id: number;
  name: string;
  unit: IngredientUnit;
  currentStock: string;
  minimumStock: string;
  active: boolean;
}

interface InventoryMovement {
  id: number;
  ingredientId: number;
  type: MovementType;
  quantity: string;
  reason?: string | null;
  createdAt: string;
  ingredient: Ingredient;
}

interface InventoryMovementResult {
  movement: InventoryMovement;
  previousStock: number;
  newStock: number;
  ingredient: Ingredient;
}

interface InventoryPageProps {
  accessToken: string;
  canManage?: boolean;
  onInventoryChanged?: () => void;
}

interface MovementForm {
  ingredientId: string;
  type: MovementType;
  quantity: string;
  reason: string;
}

const emptyForm: MovementForm = {
  ingredientId: '',
  type: 'IN',
  quantity: '',
  reason: '',
};

const unitLabels: Record<IngredientUnit, string> = {
  GRAM: 'g',
  KILOGRAM: 'kg',
  MILLILITER: 'ml',
  LITER: 'L',
  UNIT: 'un.',
};

const movementLabels: Record<MovementType, string> = {
  IN: 'Entrada',
  OUT: 'Salida',
  ADJUSTMENT: 'Ajuste',
};

function parseNumericValue(value: string) {
  return Number(value.replace(',', '.'));
}

function formatQuantity(value: string | number) {
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 3,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function InventoryPage({
  accessToken,
  canManage = true,
  onInventoryChanged,
}: InventoryPageProps) {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>([]);

  const [movements, setMovements] =
    useState<InventoryMovement[]>([]);

  const [form, setForm] =
    useState<MovementForm>(emptyForm);

  const [filterIngredientId, setFilterIngredientId] =
    useState('ALL');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [
        ingredientsResult,
        movementsResult,
      ] = await Promise.all([
        apiRequest<Ingredient[]>(
          '/ingredients',
          accessToken,
        ),
        apiRequest<InventoryMovement[]>(
          '/inventory-movements',
          accessToken,
        ),
      ]);

      setIngredients(ingredientsResult);
      setMovements(movementsResult);

      const firstActiveIngredient =
        ingredientsResult.find(
          (ingredient) => ingredient.active,
        );

      setForm((currentForm) => {
        if (currentForm.ingredientId) {
          return currentForm;
        }

        return {
          ...currentForm,
          ingredientId:
            firstActiveIngredient?.id.toString() ??
            '',
        };
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible cargar el inventario.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const activeIngredients =
    useMemo(
      () =>
        ingredients.filter(
          (ingredient) => ingredient.active,
        ),
      [ingredients],
    );

  const lowStockIngredients =
    useMemo(
      () =>
        activeIngredients.filter(
          (ingredient) =>
            Number(ingredient.currentStock) <=
            Number(ingredient.minimumStock),
        ),
      [activeIngredients],
    );

  const selectedIngredient =
    useMemo(
      () =>
        ingredients.find(
          (ingredient) =>
            ingredient.id ===
            Number(form.ingredientId),
        ),
      [form.ingredientId, ingredients],
    );

  const filteredMovements =
    useMemo(() => {
      if (filterIngredientId === 'ALL') {
        return movements;
      }

      return movements.filter(
        (movement) =>
          movement.ingredientId ===
          Number(filterIngredientId),
      );
    }, [filterIngredientId, movements]);

  const projectedStock =
    useMemo(() => {
      if (!selectedIngredient) {
        return null;
      }

      const quantity =
        parseNumericValue(form.quantity);

      if (!Number.isFinite(quantity)) {
        return null;
      }

      const currentStock =
        Number(selectedIngredient.currentStock);

      if (form.type === 'IN') {
        return currentStock + quantity;
      }

      if (form.type === 'OUT') {
        return currentStock - quantity;
      }

      return quantity;
    }, [
      form.quantity,
      form.type,
      selectedIngredient,
    ]);

  function updateForm(
    field: keyof MovementForm,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSuccessMessage('');

    const ingredientId =
      Number(form.ingredientId);

    const quantity =
      parseNumericValue(form.quantity);

    const reason = form.reason.trim();

    if (
      !Number.isInteger(ingredientId) ||
      ingredientId < 1
    ) {
      setError(
        'Debes seleccionar un ingrediente.',
      );

      return;
    }

    if (
      !selectedIngredient ||
      !selectedIngredient.active
    ) {
      setError(
        'El ingrediente seleccionado no está activo.',
      );

      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      setError(
        'La cantidad debe ser un número igual o mayor que cero.',
      );

      return;
    }

    if (
      form.type !== 'ADJUSTMENT' &&
      quantity <= 0
    ) {
      setError(
        'Las entradas y salidas deben ser mayores que cero.',
      );

      return;
    }

    if (
      form.type === 'OUT' &&
      quantity >
        Number(selectedIngredient.currentStock)
    ) {
      setError(
        `Stock insuficiente. Hay ${formatQuantity(
          selectedIngredient.currentStock,
        )} ${
          unitLabels[selectedIngredient.unit]
        } disponibles.`,
      );

      return;
    }

    if (reason.length > 250) {
      setError(
        'El motivo no puede superar los 250 caracteres.',
      );

      return;
    }

    setSaving(true);

    try {
      const result =
        await apiRequest<InventoryMovementResult>(
          '/inventory-movements',
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify({
              ingredientId,
              type: form.type,
              quantity,
              ...(reason
                ? { reason }
                : {}),
            }),
          },
        );

      setSuccessMessage(
        `${movementLabels[form.type]} registrada. Stock anterior: ${formatQuantity(
          result.previousStock,
        )}; stock nuevo: ${formatQuantity(
          result.newStock,
        )} ${
          unitLabels[
            result.ingredient.unit
          ]
        }.`,
      );

      setForm((currentForm) => ({
        ...currentForm,
        quantity: '',
        reason: '',
      }));

      await loadInventory();
      onInventoryChanged?.();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible registrar el movimiento.',
      );
    } finally {
      setSaving(false);
    }
  }

  const quantityLabel =
    form.type === 'ADJUSTMENT'
      ? 'Nuevo stock total *'
      : form.type === 'IN'
        ? 'Cantidad que ingresa *'
        : 'Cantidad que sale *';

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">
            Panel administrativo
          </p>

          <h2>📦 Inventario</h2>

          <p>
            Registra entradas, salidas y
            ajustes, manteniendo un historial
            de cada cambio de stock.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            void loadInventory()
          }
          disabled={loading}
        >
          {loading
            ? 'Actualizando...'
            : '↻ Actualizar'}
        </button>
      </header>

      {error && (
        <div className="inventory-page-message inventory-page-error">
          <strong>
            Ocurrió un problema
          </strong>

          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="inventory-page-message inventory-page-success">
          <strong>
            Movimiento registrado
          </strong>

          <span>
            {successMessage}
          </span>
        </div>
      )}

      <section className="inventory-summary-grid">
        <article className="inventory-summary-card">
          <span>Ingredientes activos</span>
          <strong>
            {activeIngredients.length}
          </strong>
          <small>
            Disponibles para movimientos
          </small>
        </article>

        <article className="inventory-summary-card">
          <span>Stock bajo</span>
          <strong>
            {lowStockIngredients.length}
          </strong>
          <small>
            Requieren reposición
          </small>
        </article>

        <article className="inventory-summary-card">
          <span>Movimientos</span>
          <strong>
            {movements.length}
          </strong>
          <small>
            Registros históricos
          </small>
        </article>
      </section>

      <section className="inventory-page-layout">
        <article className="panel inventory-form-panel">
          <div className="panel-header">
            <div>
              <h3>
                Registrar movimiento
              </h3>

              <p>
                Las salidas nunca pueden
                superar el stock disponible.
              </p>
            </div>
          </div>

          {!canManage ? (
            <div className="inventory-readonly">
              Tu cuenta puede revisar el
              inventario, pero solo un
              administrador puede registrar
              movimientos.
            </div>
          ) : activeIngredients.length ===
            0 ? (
            <div className="empty-state">
              No hay ingredientes activos.
              Activa o crea un ingrediente
              antes de registrar movimientos.
            </div>
          ) : (
            <form
              className="inventory-movement-form"
              onSubmit={handleSubmit}
            >
              <label className="inventory-page-field">
                <span>
                  Ingrediente *
                </span>

                <select
                  value={
                    form.ingredientId
                  }
                  onChange={(event) =>
                    updateForm(
                      'ingredientId',
                      event.target.value,
                    )
                  }
                  disabled={saving}
                >
                  <option value="">
                    Selecciona un ingrediente
                  </option>

                  {activeIngredients.map(
                    (ingredient) => (
                      <option
                        key={ingredient.id}
                        value={ingredient.id}
                      >
                        {ingredient.name}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="inventory-page-field">
                <span>
                  Tipo de movimiento *
                </span>

                <select
                  value={form.type}
                  onChange={(event) =>
                    updateForm(
                      'type',
                      event.target
                        .value as MovementType,
                    )
                  }
                  disabled={saving}
                >
                  <option value="IN">
                    Entrada de stock
                  </option>

                  <option value="OUT">
                    Salida de stock
                  </option>

                  <option value="ADJUSTMENT">
                    Ajuste al stock real
                  </option>
                </select>
              </label>

              <label className="inventory-page-field">
                <span>
                  {quantityLabel}
                </span>

                <input
                  type="number"
                  value={form.quantity}
                  onChange={(event) =>
                    updateForm(
                      'quantity',
                      event.target.value,
                    )
                  }
                  min="0"
                  step="0.001"
                  placeholder={
                    form.type ===
                    'ADJUSTMENT'
                      ? 'Ejemplo: 12.5'
                      : 'Ejemplo: 2'
                  }
                  disabled={saving}
                />
              </label>

              <label className="inventory-page-field">
                <span>
                  Motivo
                </span>

                <textarea
                  value={form.reason}
                  onChange={(event) =>
                    updateForm(
                      'reason',
                      event.target.value,
                    )
                  }
                  rows={3}
                  maxLength={250}
                  placeholder="Ejemplo: Compra semanal de insumos"
                  disabled={saving}
                />

                <small>
                  {form.reason.length}/250
                </small>
              </label>

              {selectedIngredient && (
                <div className="inventory-preview">
                  <div>
                    <span>
                      Stock actual
                    </span>

                    <strong>
                      {formatQuantity(
                        selectedIngredient.currentStock,
                      )}{' '}
                      {
                        unitLabels[
                          selectedIngredient
                            .unit
                        ]
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Stock mínimo
                    </span>

                    <strong>
                      {formatQuantity(
                        selectedIngredient.minimumStock,
                      )}{' '}
                      {
                        unitLabels[
                          selectedIngredient
                            .unit
                        ]
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Stock proyectado
                    </span>

                    <strong
                      className={
                        projectedStock !==
                          null &&
                        projectedStock <
                          0
                          ? 'inventory-negative'
                          : ''
                      }
                    >
                      {projectedStock ===
                      null
                        ? '—'
                        : formatQuantity(
                            projectedStock,
                          )}{' '}
                      {
                        unitLabels[
                          selectedIngredient
                            .unit
                        ]
                      }
                    </strong>
                  </div>
                </div>
              )}

              <button
                className="primary-button inventory-submit-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Registrando...'
                  : '+ Registrar movimiento'}
              </button>
            </form>
          )}
        </article>

        <article className="panel inventory-stock-panel">
          <div className="panel-header">
            <div>
              <h3>
                Existencias actuales
              </h3>

              <p>
                Estado de todos los
                ingredientes registrados
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Cargando existencias...
            </div>
          ) : ingredients.length === 0 ? (
            <div className="empty-state">
              No hay ingredientes
              registrados.
            </div>
          ) : (
            <div className="inventory-table-container">
              <table className="inventory-page-table">
                <thead>
                  <tr>
                    <th>Ingrediente</th>
                    <th>Stock actual</th>
                    <th>Mínimo</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {ingredients.map(
                    (ingredient) => {
                      const isLow =
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
                            <div className="inventory-ingredient-name">
                              <strong>
                                {
                                  ingredient.name
                                }
                              </strong>

                              <small>
                                #
                                {
                                  ingredient.id
                                }{' '}
                                ·{' '}
                                {
                                  unitLabels[
                                    ingredient
                                      .unit
                                  ]
                                }
                              </small>
                            </div>
                          </td>

                          <td>
                            <strong>
                              {formatQuantity(
                                ingredient.currentStock,
                              )}{' '}
                              {
                                unitLabels[
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
                              unitLabels[
                                ingredient
                                  .unit
                              ]
                            }
                          </td>

                          <td>
                            <span
                              className={
                                !ingredient.active
                                  ? 'inventory-page-status inactive'
                                  : isLow
                                    ? 'inventory-page-status low'
                                    : 'inventory-page-status normal'
                              }
                            >
                              {!ingredient.active
                                ? 'Inactivo'
                                : isLow
                                  ? 'Stock bajo'
                                  : 'Normal'}
                            </span>
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

      <section className="panel inventory-history-panel">
        <div className="panel-header">
          <div>
            <h3>
              Historial de movimientos
            </h3>

            <p>
              Entradas, salidas y ajustes
              registrados
            </p>
          </div>

          <label className="inventory-history-filter">
            <span>
              Filtrar
            </span>

            <select
              value={
                filterIngredientId
              }
              onChange={(event) =>
                setFilterIngredientId(
                  event.target.value,
                )
              }
            >
              <option value="ALL">
                Todos los ingredientes
              </option>

              {ingredients.map(
                (ingredient) => (
                  <option
                    key={ingredient.id}
                    value={ingredient.id}
                  >
                    {ingredient.name}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="empty-state">
            Cargando movimientos...
          </div>
        ) : filteredMovements.length ===
          0 ? (
          <div className="empty-state">
            Todavía no hay movimientos
            para mostrar.
          </div>
        ) : (
          <div className="inventory-table-container">
            <table className="inventory-page-table inventory-history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Ingrediente</th>
                  <th>Movimiento</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                </tr>
              </thead>

              <tbody>
                {filteredMovements.map(
                  (movement) => (
                    <tr
                      key={movement.id}
                    >
                      <td>
                        {formatDate(
                          movement.createdAt,
                        )}
                      </td>

                      <td>
                        <strong>
                          {
                            movement
                              .ingredient.name
                          }
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`inventory-movement-type ${movement.type.toLowerCase()}`}
                        >
                          {
                            movementLabels[
                              movement.type
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <strong>
                          {movement.type ===
                          'OUT'
                            ? '−'
                            : movement.type ===
                                'IN'
                              ? '+'
                              : ''}
                          {formatQuantity(
                            movement.quantity,
                          )}{' '}
                          {
                            unitLabels[
                              movement
                                .ingredient
                                .unit
                            ]
                          }
                        </strong>
                      </td>

                      <td>
                        {movement.reason ||
                          'Sin motivo'}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
