import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type InventoryMovementModel = runtime.Types.Result.DefaultSelection<Prisma.$InventoryMovementPayload>;
export type AggregateInventoryMovement = {
    _count: InventoryMovementCountAggregateOutputType | null;
    _avg: InventoryMovementAvgAggregateOutputType | null;
    _sum: InventoryMovementSumAggregateOutputType | null;
    _min: InventoryMovementMinAggregateOutputType | null;
    _max: InventoryMovementMaxAggregateOutputType | null;
};
export type InventoryMovementAvgAggregateOutputType = {
    id: number | null;
    ingredientId: number | null;
    quantity: runtime.Decimal | null;
};
export type InventoryMovementSumAggregateOutputType = {
    id: number | null;
    ingredientId: number | null;
    quantity: runtime.Decimal | null;
};
export type InventoryMovementMinAggregateOutputType = {
    id: number | null;
    ingredientId: number | null;
    type: $Enums.MovementType | null;
    quantity: runtime.Decimal | null;
    reason: string | null;
    createdAt: Date | null;
};
export type InventoryMovementMaxAggregateOutputType = {
    id: number | null;
    ingredientId: number | null;
    type: $Enums.MovementType | null;
    quantity: runtime.Decimal | null;
    reason: string | null;
    createdAt: Date | null;
};
export type InventoryMovementCountAggregateOutputType = {
    id: number;
    ingredientId: number;
    type: number;
    quantity: number;
    reason: number;
    createdAt: number;
    _all: number;
};
export type InventoryMovementAvgAggregateInputType = {
    id?: true;
    ingredientId?: true;
    quantity?: true;
};
export type InventoryMovementSumAggregateInputType = {
    id?: true;
    ingredientId?: true;
    quantity?: true;
};
export type InventoryMovementMinAggregateInputType = {
    id?: true;
    ingredientId?: true;
    type?: true;
    quantity?: true;
    reason?: true;
    createdAt?: true;
};
export type InventoryMovementMaxAggregateInputType = {
    id?: true;
    ingredientId?: true;
    type?: true;
    quantity?: true;
    reason?: true;
    createdAt?: true;
};
export type InventoryMovementCountAggregateInputType = {
    id?: true;
    ingredientId?: true;
    type?: true;
    quantity?: true;
    reason?: true;
    createdAt?: true;
    _all?: true;
};
export type InventoryMovementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryMovementWhereInput;
    orderBy?: Prisma.InventoryMovementOrderByWithRelationInput | Prisma.InventoryMovementOrderByWithRelationInput[];
    cursor?: Prisma.InventoryMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InventoryMovementCountAggregateInputType;
    _avg?: InventoryMovementAvgAggregateInputType;
    _sum?: InventoryMovementSumAggregateInputType;
    _min?: InventoryMovementMinAggregateInputType;
    _max?: InventoryMovementMaxAggregateInputType;
};
export type GetInventoryMovementAggregateType<T extends InventoryMovementAggregateArgs> = {
    [P in keyof T & keyof AggregateInventoryMovement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInventoryMovement[P]> : Prisma.GetScalarType<T[P], AggregateInventoryMovement[P]>;
};
export type InventoryMovementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryMovementWhereInput;
    orderBy?: Prisma.InventoryMovementOrderByWithAggregationInput | Prisma.InventoryMovementOrderByWithAggregationInput[];
    by: Prisma.InventoryMovementScalarFieldEnum[] | Prisma.InventoryMovementScalarFieldEnum;
    having?: Prisma.InventoryMovementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InventoryMovementCountAggregateInputType | true;
    _avg?: InventoryMovementAvgAggregateInputType;
    _sum?: InventoryMovementSumAggregateInputType;
    _min?: InventoryMovementMinAggregateInputType;
    _max?: InventoryMovementMaxAggregateInputType;
};
export type InventoryMovementGroupByOutputType = {
    id: number;
    ingredientId: number;
    type: $Enums.MovementType;
    quantity: runtime.Decimal;
    reason: string | null;
    createdAt: Date;
    _count: InventoryMovementCountAggregateOutputType | null;
    _avg: InventoryMovementAvgAggregateOutputType | null;
    _sum: InventoryMovementSumAggregateOutputType | null;
    _min: InventoryMovementMinAggregateOutputType | null;
    _max: InventoryMovementMaxAggregateOutputType | null;
};
export type GetInventoryMovementGroupByPayload<T extends InventoryMovementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InventoryMovementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InventoryMovementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InventoryMovementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InventoryMovementGroupByOutputType[P]>;
}>>;
export type InventoryMovementWhereInput = {
    AND?: Prisma.InventoryMovementWhereInput | Prisma.InventoryMovementWhereInput[];
    OR?: Prisma.InventoryMovementWhereInput[];
    NOT?: Prisma.InventoryMovementWhereInput | Prisma.InventoryMovementWhereInput[];
    id?: Prisma.IntFilter<"InventoryMovement"> | number;
    ingredientId?: Prisma.IntFilter<"InventoryMovement"> | number;
    type?: Prisma.EnumMovementTypeFilter<"InventoryMovement"> | $Enums.MovementType;
    quantity?: Prisma.DecimalFilter<"InventoryMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringNullableFilter<"InventoryMovement"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InventoryMovement"> | Date | string;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
};
export type InventoryMovementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    ingredient?: Prisma.IngredientOrderByWithRelationInput;
};
export type InventoryMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.InventoryMovementWhereInput | Prisma.InventoryMovementWhereInput[];
    OR?: Prisma.InventoryMovementWhereInput[];
    NOT?: Prisma.InventoryMovementWhereInput | Prisma.InventoryMovementWhereInput[];
    ingredientId?: Prisma.IntFilter<"InventoryMovement"> | number;
    type?: Prisma.EnumMovementTypeFilter<"InventoryMovement"> | $Enums.MovementType;
    quantity?: Prisma.DecimalFilter<"InventoryMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringNullableFilter<"InventoryMovement"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InventoryMovement"> | Date | string;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
}, "id">;
export type InventoryMovementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.InventoryMovementCountOrderByAggregateInput;
    _avg?: Prisma.InventoryMovementAvgOrderByAggregateInput;
    _max?: Prisma.InventoryMovementMaxOrderByAggregateInput;
    _min?: Prisma.InventoryMovementMinOrderByAggregateInput;
    _sum?: Prisma.InventoryMovementSumOrderByAggregateInput;
};
export type InventoryMovementScalarWhereWithAggregatesInput = {
    AND?: Prisma.InventoryMovementScalarWhereWithAggregatesInput | Prisma.InventoryMovementScalarWhereWithAggregatesInput[];
    OR?: Prisma.InventoryMovementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InventoryMovementScalarWhereWithAggregatesInput | Prisma.InventoryMovementScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"InventoryMovement"> | number;
    ingredientId?: Prisma.IntWithAggregatesFilter<"InventoryMovement"> | number;
    type?: Prisma.EnumMovementTypeWithAggregatesFilter<"InventoryMovement"> | $Enums.MovementType;
    quantity?: Prisma.DecimalWithAggregatesFilter<"InventoryMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringNullableWithAggregatesFilter<"InventoryMovement"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"InventoryMovement"> | Date | string;
};
export type InventoryMovementCreateInput = {
    type: $Enums.MovementType;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: string | null;
    createdAt?: Date | string;
    ingredient: Prisma.IngredientCreateNestedOneWithoutMovementsInput;
};
export type InventoryMovementUncheckedCreateInput = {
    id?: number;
    ingredientId: number;
    type: $Enums.MovementType;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type InventoryMovementUpdateInput = {
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutMovementsNestedInput;
};
export type InventoryMovementUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    ingredientId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryMovementCreateManyInput = {
    id?: number;
    ingredientId: number;
    type: $Enums.MovementType;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type InventoryMovementUpdateManyMutationInput = {
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryMovementUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    ingredientId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryMovementListRelationFilter = {
    every?: Prisma.InventoryMovementWhereInput;
    some?: Prisma.InventoryMovementWhereInput;
    none?: Prisma.InventoryMovementWhereInput;
};
export type InventoryMovementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InventoryMovementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type InventoryMovementAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type InventoryMovementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type InventoryMovementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type InventoryMovementSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type InventoryMovementCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.InventoryMovementCreateWithoutIngredientInput, Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput> | Prisma.InventoryMovementCreateWithoutIngredientInput[] | Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput | Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.InventoryMovementCreateManyIngredientInputEnvelope;
    connect?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
};
export type InventoryMovementUncheckedCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.InventoryMovementCreateWithoutIngredientInput, Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput> | Prisma.InventoryMovementCreateWithoutIngredientInput[] | Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput | Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.InventoryMovementCreateManyIngredientInputEnvelope;
    connect?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
};
export type InventoryMovementUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryMovementCreateWithoutIngredientInput, Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput> | Prisma.InventoryMovementCreateWithoutIngredientInput[] | Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput | Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.InventoryMovementUpsertWithWhereUniqueWithoutIngredientInput | Prisma.InventoryMovementUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.InventoryMovementCreateManyIngredientInputEnvelope;
    set?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    disconnect?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    delete?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    connect?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    update?: Prisma.InventoryMovementUpdateWithWhereUniqueWithoutIngredientInput | Prisma.InventoryMovementUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.InventoryMovementUpdateManyWithWhereWithoutIngredientInput | Prisma.InventoryMovementUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.InventoryMovementScalarWhereInput | Prisma.InventoryMovementScalarWhereInput[];
};
export type InventoryMovementUncheckedUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryMovementCreateWithoutIngredientInput, Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput> | Prisma.InventoryMovementCreateWithoutIngredientInput[] | Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput | Prisma.InventoryMovementCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.InventoryMovementUpsertWithWhereUniqueWithoutIngredientInput | Prisma.InventoryMovementUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.InventoryMovementCreateManyIngredientInputEnvelope;
    set?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    disconnect?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    delete?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    connect?: Prisma.InventoryMovementWhereUniqueInput | Prisma.InventoryMovementWhereUniqueInput[];
    update?: Prisma.InventoryMovementUpdateWithWhereUniqueWithoutIngredientInput | Prisma.InventoryMovementUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.InventoryMovementUpdateManyWithWhereWithoutIngredientInput | Prisma.InventoryMovementUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.InventoryMovementScalarWhereInput | Prisma.InventoryMovementScalarWhereInput[];
};
export type EnumMovementTypeFieldUpdateOperationsInput = {
    set?: $Enums.MovementType;
};
export type InventoryMovementCreateWithoutIngredientInput = {
    type: $Enums.MovementType;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type InventoryMovementUncheckedCreateWithoutIngredientInput = {
    id?: number;
    type: $Enums.MovementType;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type InventoryMovementCreateOrConnectWithoutIngredientInput = {
    where: Prisma.InventoryMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryMovementCreateWithoutIngredientInput, Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput>;
};
export type InventoryMovementCreateManyIngredientInputEnvelope = {
    data: Prisma.InventoryMovementCreateManyIngredientInput | Prisma.InventoryMovementCreateManyIngredientInput[];
    skipDuplicates?: boolean;
};
export type InventoryMovementUpsertWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.InventoryMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.InventoryMovementUpdateWithoutIngredientInput, Prisma.InventoryMovementUncheckedUpdateWithoutIngredientInput>;
    create: Prisma.XOR<Prisma.InventoryMovementCreateWithoutIngredientInput, Prisma.InventoryMovementUncheckedCreateWithoutIngredientInput>;
};
export type InventoryMovementUpdateWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.InventoryMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.InventoryMovementUpdateWithoutIngredientInput, Prisma.InventoryMovementUncheckedUpdateWithoutIngredientInput>;
};
export type InventoryMovementUpdateManyWithWhereWithoutIngredientInput = {
    where: Prisma.InventoryMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.InventoryMovementUpdateManyMutationInput, Prisma.InventoryMovementUncheckedUpdateManyWithoutIngredientInput>;
};
export type InventoryMovementScalarWhereInput = {
    AND?: Prisma.InventoryMovementScalarWhereInput | Prisma.InventoryMovementScalarWhereInput[];
    OR?: Prisma.InventoryMovementScalarWhereInput[];
    NOT?: Prisma.InventoryMovementScalarWhereInput | Prisma.InventoryMovementScalarWhereInput[];
    id?: Prisma.IntFilter<"InventoryMovement"> | number;
    ingredientId?: Prisma.IntFilter<"InventoryMovement"> | number;
    type?: Prisma.EnumMovementTypeFilter<"InventoryMovement"> | $Enums.MovementType;
    quantity?: Prisma.DecimalFilter<"InventoryMovement"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.StringNullableFilter<"InventoryMovement"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InventoryMovement"> | Date | string;
};
export type InventoryMovementCreateManyIngredientInput = {
    id?: number;
    type: $Enums.MovementType;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type InventoryMovementUpdateWithoutIngredientInput = {
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryMovementUncheckedUpdateWithoutIngredientInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryMovementUncheckedUpdateManyWithoutIngredientInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumMovementTypeFieldUpdateOperationsInput | $Enums.MovementType;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryMovementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    type?: boolean;
    quantity?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryMovement"]>;
export type InventoryMovementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    type?: boolean;
    quantity?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryMovement"]>;
export type InventoryMovementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    ingredientId?: boolean;
    type?: boolean;
    quantity?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryMovement"]>;
export type InventoryMovementSelectScalar = {
    id?: boolean;
    ingredientId?: boolean;
    type?: boolean;
    quantity?: boolean;
    reason?: boolean;
    createdAt?: boolean;
};
export type InventoryMovementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "ingredientId" | "type" | "quantity" | "reason" | "createdAt", ExtArgs["result"]["inventoryMovement"]>;
export type InventoryMovementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type InventoryMovementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type InventoryMovementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type $InventoryMovementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InventoryMovement";
    objects: {
        ingredient: Prisma.$IngredientPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        ingredientId: number;
        type: $Enums.MovementType;
        quantity: runtime.Decimal;
        reason: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["inventoryMovement"]>;
    composites: {};
};
export type InventoryMovementGetPayload<S extends boolean | null | undefined | InventoryMovementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload, S>;
export type InventoryMovementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InventoryMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InventoryMovementCountAggregateInputType | true;
};
export interface InventoryMovementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InventoryMovement'];
        meta: {
            name: 'InventoryMovement';
        };
    };
    findUnique<T extends InventoryMovementFindUniqueArgs>(args: Prisma.SelectSubset<T, InventoryMovementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InventoryMovementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InventoryMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InventoryMovementFindFirstArgs>(args?: Prisma.SelectSubset<T, InventoryMovementFindFirstArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InventoryMovementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InventoryMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InventoryMovementFindManyArgs>(args?: Prisma.SelectSubset<T, InventoryMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InventoryMovementCreateArgs>(args: Prisma.SelectSubset<T, InventoryMovementCreateArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InventoryMovementCreateManyArgs>(args?: Prisma.SelectSubset<T, InventoryMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InventoryMovementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InventoryMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InventoryMovementDeleteArgs>(args: Prisma.SelectSubset<T, InventoryMovementDeleteArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InventoryMovementUpdateArgs>(args: Prisma.SelectSubset<T, InventoryMovementUpdateArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InventoryMovementDeleteManyArgs>(args?: Prisma.SelectSubset<T, InventoryMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InventoryMovementUpdateManyArgs>(args: Prisma.SelectSubset<T, InventoryMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InventoryMovementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InventoryMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InventoryMovementUpsertArgs>(args: Prisma.SelectSubset<T, InventoryMovementUpsertArgs<ExtArgs>>): Prisma.Prisma__InventoryMovementClient<runtime.Types.Result.GetResult<Prisma.$InventoryMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InventoryMovementCountArgs>(args?: Prisma.Subset<T, InventoryMovementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InventoryMovementCountAggregateOutputType> : number>;
    aggregate<T extends InventoryMovementAggregateArgs>(args: Prisma.Subset<T, InventoryMovementAggregateArgs>): Prisma.PrismaPromise<GetInventoryMovementAggregateType<T>>;
    groupBy<T extends InventoryMovementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InventoryMovementGroupByArgs['orderBy'];
    } : {
        orderBy?: InventoryMovementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InventoryMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InventoryMovementFieldRefs;
}
export interface Prisma__InventoryMovementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    ingredient<T extends Prisma.IngredientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.IngredientDefaultArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InventoryMovementFieldRefs {
    readonly id: Prisma.FieldRef<"InventoryMovement", 'Int'>;
    readonly ingredientId: Prisma.FieldRef<"InventoryMovement", 'Int'>;
    readonly type: Prisma.FieldRef<"InventoryMovement", 'MovementType'>;
    readonly quantity: Prisma.FieldRef<"InventoryMovement", 'Decimal'>;
    readonly reason: Prisma.FieldRef<"InventoryMovement", 'String'>;
    readonly createdAt: Prisma.FieldRef<"InventoryMovement", 'DateTime'>;
}
export type InventoryMovementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    where: Prisma.InventoryMovementWhereUniqueInput;
};
export type InventoryMovementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    where: Prisma.InventoryMovementWhereUniqueInput;
};
export type InventoryMovementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InventoryMovementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InventoryMovementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InventoryMovementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryMovementCreateInput, Prisma.InventoryMovementUncheckedCreateInput>;
};
export type InventoryMovementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InventoryMovementCreateManyInput | Prisma.InventoryMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InventoryMovementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    data: Prisma.InventoryMovementCreateManyInput | Prisma.InventoryMovementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.InventoryMovementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type InventoryMovementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryMovementUpdateInput, Prisma.InventoryMovementUncheckedUpdateInput>;
    where: Prisma.InventoryMovementWhereUniqueInput;
};
export type InventoryMovementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InventoryMovementUpdateManyMutationInput, Prisma.InventoryMovementUncheckedUpdateManyInput>;
    where?: Prisma.InventoryMovementWhereInput;
    limit?: number;
};
export type InventoryMovementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryMovementUpdateManyMutationInput, Prisma.InventoryMovementUncheckedUpdateManyInput>;
    where?: Prisma.InventoryMovementWhereInput;
    limit?: number;
    include?: Prisma.InventoryMovementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type InventoryMovementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    where: Prisma.InventoryMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryMovementCreateInput, Prisma.InventoryMovementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InventoryMovementUpdateInput, Prisma.InventoryMovementUncheckedUpdateInput>;
};
export type InventoryMovementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
    where: Prisma.InventoryMovementWhereUniqueInput;
};
export type InventoryMovementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryMovementWhereInput;
    limit?: number;
};
export type InventoryMovementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryMovementSelect<ExtArgs> | null;
    omit?: Prisma.InventoryMovementOmit<ExtArgs> | null;
    include?: Prisma.InventoryMovementInclude<ExtArgs> | null;
};
