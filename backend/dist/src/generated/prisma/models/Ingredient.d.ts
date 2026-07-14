import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type IngredientModel = runtime.Types.Result.DefaultSelection<Prisma.$IngredientPayload>;
export type AggregateIngredient = {
    _count: IngredientCountAggregateOutputType | null;
    _avg: IngredientAvgAggregateOutputType | null;
    _sum: IngredientSumAggregateOutputType | null;
    _min: IngredientMinAggregateOutputType | null;
    _max: IngredientMaxAggregateOutputType | null;
};
export type IngredientAvgAggregateOutputType = {
    id: number | null;
    currentStock: runtime.Decimal | null;
    minimumStock: runtime.Decimal | null;
    costPerUnit: runtime.Decimal | null;
};
export type IngredientSumAggregateOutputType = {
    id: number | null;
    currentStock: runtime.Decimal | null;
    minimumStock: runtime.Decimal | null;
    costPerUnit: runtime.Decimal | null;
};
export type IngredientMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    unit: $Enums.Unit | null;
    currentStock: runtime.Decimal | null;
    minimumStock: runtime.Decimal | null;
    costPerUnit: runtime.Decimal | null;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IngredientMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    unit: $Enums.Unit | null;
    currentStock: runtime.Decimal | null;
    minimumStock: runtime.Decimal | null;
    costPerUnit: runtime.Decimal | null;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IngredientCountAggregateOutputType = {
    id: number;
    name: number;
    unit: number;
    currentStock: number;
    minimumStock: number;
    costPerUnit: number;
    active: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type IngredientAvgAggregateInputType = {
    id?: true;
    currentStock?: true;
    minimumStock?: true;
    costPerUnit?: true;
};
export type IngredientSumAggregateInputType = {
    id?: true;
    currentStock?: true;
    minimumStock?: true;
    costPerUnit?: true;
};
export type IngredientMinAggregateInputType = {
    id?: true;
    name?: true;
    unit?: true;
    currentStock?: true;
    minimumStock?: true;
    costPerUnit?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IngredientMaxAggregateInputType = {
    id?: true;
    name?: true;
    unit?: true;
    currentStock?: true;
    minimumStock?: true;
    costPerUnit?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IngredientCountAggregateInputType = {
    id?: true;
    name?: true;
    unit?: true;
    currentStock?: true;
    minimumStock?: true;
    costPerUnit?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type IngredientAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IngredientCountAggregateInputType;
    _avg?: IngredientAvgAggregateInputType;
    _sum?: IngredientSumAggregateInputType;
    _min?: IngredientMinAggregateInputType;
    _max?: IngredientMaxAggregateInputType;
};
export type GetIngredientAggregateType<T extends IngredientAggregateArgs> = {
    [P in keyof T & keyof AggregateIngredient]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIngredient[P]> : Prisma.GetScalarType<T[P], AggregateIngredient[P]>;
};
export type IngredientGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithAggregationInput | Prisma.IngredientOrderByWithAggregationInput[];
    by: Prisma.IngredientScalarFieldEnum[] | Prisma.IngredientScalarFieldEnum;
    having?: Prisma.IngredientScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IngredientCountAggregateInputType | true;
    _avg?: IngredientAvgAggregateInputType;
    _sum?: IngredientSumAggregateInputType;
    _min?: IngredientMinAggregateInputType;
    _max?: IngredientMaxAggregateInputType;
};
export type IngredientGroupByOutputType = {
    id: number;
    name: string;
    unit: $Enums.Unit;
    currentStock: runtime.Decimal;
    minimumStock: runtime.Decimal;
    costPerUnit: runtime.Decimal;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: IngredientCountAggregateOutputType | null;
    _avg: IngredientAvgAggregateOutputType | null;
    _sum: IngredientSumAggregateOutputType | null;
    _min: IngredientMinAggregateOutputType | null;
    _max: IngredientMaxAggregateOutputType | null;
};
export type GetIngredientGroupByPayload<T extends IngredientGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IngredientGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IngredientGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IngredientGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IngredientGroupByOutputType[P]>;
}>>;
export type IngredientWhereInput = {
    AND?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    OR?: Prisma.IngredientWhereInput[];
    NOT?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    id?: Prisma.IntFilter<"Ingredient"> | number;
    name?: Prisma.StringFilter<"Ingredient"> | string;
    unit?: Prisma.EnumUnitFilter<"Ingredient"> | $Enums.Unit;
    currentStock?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    products?: Prisma.ProductIngredientListRelationFilter;
    movements?: Prisma.InventoryMovementListRelationFilter;
};
export type IngredientOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    products?: Prisma.ProductIngredientOrderByRelationAggregateInput;
    movements?: Prisma.InventoryMovementOrderByRelationAggregateInput;
};
export type IngredientWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    OR?: Prisma.IngredientWhereInput[];
    NOT?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    unit?: Prisma.EnumUnitFilter<"Ingredient"> | $Enums.Unit;
    currentStock?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    products?: Prisma.ProductIngredientListRelationFilter;
    movements?: Prisma.InventoryMovementListRelationFilter;
}, "id" | "name">;
export type IngredientOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.IngredientCountOrderByAggregateInput;
    _avg?: Prisma.IngredientAvgOrderByAggregateInput;
    _max?: Prisma.IngredientMaxOrderByAggregateInput;
    _min?: Prisma.IngredientMinOrderByAggregateInput;
    _sum?: Prisma.IngredientSumOrderByAggregateInput;
};
export type IngredientScalarWhereWithAggregatesInput = {
    AND?: Prisma.IngredientScalarWhereWithAggregatesInput | Prisma.IngredientScalarWhereWithAggregatesInput[];
    OR?: Prisma.IngredientScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IngredientScalarWhereWithAggregatesInput | Prisma.IngredientScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Ingredient"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Ingredient"> | string;
    unit?: Prisma.EnumUnitWithAggregatesFilter<"Ingredient"> | $Enums.Unit;
    currentStock?: Prisma.DecimalWithAggregatesFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalWithAggregatesFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalWithAggregatesFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolWithAggregatesFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Ingredient"> | Date | string;
};
export type IngredientCreateInput = {
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: Prisma.ProductIngredientCreateNestedManyWithoutIngredientInput;
    movements?: Prisma.InventoryMovementCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateInput = {
    id?: number;
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: Prisma.ProductIngredientUncheckedCreateNestedManyWithoutIngredientInput;
    movements?: Prisma.InventoryMovementUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.ProductIngredientUpdateManyWithoutIngredientNestedInput;
    movements?: Prisma.InventoryMovementUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.ProductIngredientUncheckedUpdateManyWithoutIngredientNestedInput;
    movements?: Prisma.InventoryMovementUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCreateManyInput = {
    id?: number;
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IngredientUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
};
export type IngredientMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    costPerUnit?: Prisma.SortOrder;
};
export type IngredientScalarRelationFilter = {
    is?: Prisma.IngredientWhereInput;
    isNot?: Prisma.IngredientWhereInput;
};
export type EnumUnitFieldUpdateOperationsInput = {
    set?: $Enums.Unit;
};
export type IngredientCreateNestedOneWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutProductsInput, Prisma.IngredientUncheckedCreateWithoutProductsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutProductsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateOneRequiredWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutProductsInput, Prisma.IngredientUncheckedCreateWithoutProductsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutProductsInput;
    upsert?: Prisma.IngredientUpsertWithoutProductsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.IngredientUpdateToOneWithWhereWithoutProductsInput, Prisma.IngredientUpdateWithoutProductsInput>, Prisma.IngredientUncheckedUpdateWithoutProductsInput>;
};
export type IngredientCreateNestedOneWithoutMovementsInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutMovementsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutMovementsInput;
    upsert?: Prisma.IngredientUpsertWithoutMovementsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.IngredientUpdateToOneWithWhereWithoutMovementsInput, Prisma.IngredientUpdateWithoutMovementsInput>, Prisma.IngredientUncheckedUpdateWithoutMovementsInput>;
};
export type IngredientCreateWithoutProductsInput = {
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.InventoryMovementCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateWithoutProductsInput = {
    id?: number;
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.InventoryMovementUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientCreateOrConnectWithoutProductsInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutProductsInput, Prisma.IngredientUncheckedCreateWithoutProductsInput>;
};
export type IngredientUpsertWithoutProductsInput = {
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutProductsInput, Prisma.IngredientUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutProductsInput, Prisma.IngredientUncheckedCreateWithoutProductsInput>;
    where?: Prisma.IngredientWhereInput;
};
export type IngredientUpdateToOneWithWhereWithoutProductsInput = {
    where?: Prisma.IngredientWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutProductsInput, Prisma.IngredientUncheckedUpdateWithoutProductsInput>;
};
export type IngredientUpdateWithoutProductsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.InventoryMovementUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.InventoryMovementUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCreateWithoutMovementsInput = {
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: Prisma.ProductIngredientCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateWithoutMovementsInput = {
    id?: number;
    name: string;
    unit: $Enums.Unit;
    currentStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: Prisma.ProductIngredientUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientCreateOrConnectWithoutMovementsInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
};
export type IngredientUpsertWithoutMovementsInput = {
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutMovementsInput, Prisma.IngredientUncheckedUpdateWithoutMovementsInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutMovementsInput, Prisma.IngredientUncheckedCreateWithoutMovementsInput>;
    where?: Prisma.IngredientWhereInput;
};
export type IngredientUpdateToOneWithWhereWithoutMovementsInput = {
    where?: Prisma.IngredientWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutMovementsInput, Prisma.IngredientUncheckedUpdateWithoutMovementsInput>;
};
export type IngredientUpdateWithoutMovementsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.ProductIngredientUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateWithoutMovementsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    currentStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    minimumStock?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    costPerUnit?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.ProductIngredientUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCountOutputType = {
    products: number;
    movements: number;
};
export type IngredientCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | IngredientCountOutputTypeCountProductsArgs;
    movements?: boolean | IngredientCountOutputTypeCountMovementsArgs;
};
export type IngredientCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientCountOutputTypeSelect<ExtArgs> | null;
};
export type IngredientCountOutputTypeCountProductsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductIngredientWhereInput;
};
export type IngredientCountOutputTypeCountMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryMovementWhereInput;
};
export type IngredientSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    costPerUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    products?: boolean | Prisma.Ingredient$productsArgs<ExtArgs>;
    movements?: boolean | Prisma.Ingredient$movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.IngredientCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    costPerUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    costPerUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectScalar = {
    id?: boolean;
    name?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    costPerUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type IngredientOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "unit" | "currentStock" | "minimumStock" | "costPerUnit" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["ingredient"]>;
export type IngredientInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.Ingredient$productsArgs<ExtArgs>;
    movements?: boolean | Prisma.Ingredient$movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.IngredientCountOutputTypeDefaultArgs<ExtArgs>;
};
export type IngredientIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type IngredientIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $IngredientPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Ingredient";
    objects: {
        products: Prisma.$ProductIngredientPayload<ExtArgs>[];
        movements: Prisma.$InventoryMovementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        unit: $Enums.Unit;
        currentStock: runtime.Decimal;
        minimumStock: runtime.Decimal;
        costPerUnit: runtime.Decimal;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["ingredient"]>;
    composites: {};
};
export type IngredientGetPayload<S extends boolean | null | undefined | IngredientDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IngredientPayload, S>;
export type IngredientCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IngredientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IngredientCountAggregateInputType | true;
};
export interface IngredientDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Ingredient'];
        meta: {
            name: 'Ingredient';
        };
    };
    findUnique<T extends IngredientFindUniqueArgs>(args: Prisma.SelectSubset<T, IngredientFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IngredientFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IngredientFindFirstArgs>(args?: Prisma.SelectSubset<T, IngredientFindFirstArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IngredientFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IngredientFindManyArgs>(args?: Prisma.SelectSubset<T, IngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IngredientCreateArgs>(args: Prisma.SelectSubset<T, IngredientCreateArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IngredientCreateManyArgs>(args?: Prisma.SelectSubset<T, IngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IngredientCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IngredientDeleteArgs>(args: Prisma.SelectSubset<T, IngredientDeleteArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IngredientUpdateArgs>(args: Prisma.SelectSubset<T, IngredientUpdateArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IngredientDeleteManyArgs>(args?: Prisma.SelectSubset<T, IngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IngredientUpdateManyArgs>(args: Prisma.SelectSubset<T, IngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IngredientUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IngredientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IngredientUpsertArgs>(args: Prisma.SelectSubset<T, IngredientUpsertArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IngredientCountArgs>(args?: Prisma.Subset<T, IngredientCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IngredientCountAggregateOutputType> : number>;
    aggregate<T extends IngredientAggregateArgs>(args: Prisma.Subset<T, IngredientAggregateArgs>): Prisma.PrismaPromise<GetIngredientAggregateType<T>>;
    groupBy<T extends IngredientGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IngredientGroupByArgs['orderBy'];
    } : {
        orderBy?: IngredientGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IngredientFieldRefs;
}
export interface Prisma__IngredientClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    products<T extends Prisma.Ingredient$productsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ingredient$productsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    movements<T extends Prisma.Ingredient$movementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ingredient$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IngredientFieldRefs {
    readonly id: Prisma.FieldRef<"Ingredient", 'Int'>;
    readonly name: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly unit: Prisma.FieldRef<"Ingredient", 'Unit'>;
    readonly currentStock: Prisma.FieldRef<"Ingredient", 'Decimal'>;
    readonly minimumStock: Prisma.FieldRef<"Ingredient", 'Decimal'>;
    readonly costPerUnit: Prisma.FieldRef<"Ingredient", 'Decimal'>;
    readonly active: Prisma.FieldRef<"Ingredient", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Ingredient", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Ingredient", 'DateTime'>;
}
export type IngredientFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
export type IngredientFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
export type IngredientFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    cursor?: Prisma.IngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
export type IngredientCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IngredientCreateInput, Prisma.IngredientUncheckedCreateInput>;
};
export type IngredientCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IngredientCreateManyInput | Prisma.IngredientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IngredientCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    data: Prisma.IngredientCreateManyInput | Prisma.IngredientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IngredientUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IngredientUpdateInput, Prisma.IngredientUncheckedUpdateInput>;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyInput>;
    where?: Prisma.IngredientWhereInput;
    limit?: number;
};
export type IngredientUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyInput>;
    where?: Prisma.IngredientWhereInput;
    limit?: number;
};
export type IngredientUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateInput, Prisma.IngredientUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IngredientUpdateInput, Prisma.IngredientUncheckedUpdateInput>;
};
export type IngredientDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    where: Prisma.IngredientWhereUniqueInput;
};
export type IngredientDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    limit?: number;
};
export type Ingredient$productsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    where?: Prisma.ProductIngredientWhereInput;
    orderBy?: Prisma.ProductIngredientOrderByWithRelationInput | Prisma.ProductIngredientOrderByWithRelationInput[];
    cursor?: Prisma.ProductIngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductIngredientScalarFieldEnum | Prisma.ProductIngredientScalarFieldEnum[];
};
export type Ingredient$movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    where?: Prisma.InventoryMovementWhereInput;
    orderBy?: Prisma.InventoryMovementOrderByWithRelationInput | Prisma.InventoryMovementOrderByWithRelationInput[];
    cursor?: Prisma.InventoryMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryMovementScalarFieldEnum | Prisma.InventoryMovementScalarFieldEnum[];
};
export type IngredientDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    include?: Prisma.IngredientInclude<ExtArgs> | null;
};
