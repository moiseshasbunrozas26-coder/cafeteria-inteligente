import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    Category: 'Category',
    Product: 'Product',
    Ingredient: 'Ingredient',
    ProductIngredient: 'ProductIngredient',
    InventoryMovement: 'InventoryMovement'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    active: 'active',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const IngredientScalarFieldEnum = {
    id: 'id',
    name: 'name',
    unit: 'unit',
    currentStock: 'currentStock',
    minimumStock: 'minimumStock',
    costPerUnit: 'costPerUnit',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ProductIngredientScalarFieldEnum = {
    productId: 'productId',
    ingredientId: 'ingredientId',
    quantity: 'quantity'
};
export const InventoryMovementScalarFieldEnum = {
    id: 'id',
    ingredientId: 'ingredientId',
    type: 'type',
    quantity: 'quantity',
    reason: 'reason',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map