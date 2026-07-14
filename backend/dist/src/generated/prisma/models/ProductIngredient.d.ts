import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ProductIngredientModel = runtime.Types.Result.DefaultSelection<Prisma.$ProductIngredientPayload>;
export type AggregateProductIngredient = {
    _count: ProductIngredientCountAggregateOutputType | null;
    _avg: ProductIngredientAvgAggregateOutputType | null;
    _sum: ProductIngredientSumAggregateOutputType | null;
    _min: ProductIngredientMinAggregateOutputType | null;
    _max: ProductIngredientMaxAggregateOutputType | null;
};
export type ProductIngredientAvgAggregateOutputType = {
    productId: number | null;
    ingredientId: number | null;
    quantity: runtime.Decimal | null;
};
export type ProductIngredientSumAggregateOutputType = {
    productId: number | null;
    ingredientId: number | null;
    quantity: runtime.Decimal | null;
};
export type ProductIngredientMinAggregateOutputType = {
    productId: number | null;
    ingredientId: number | null;
    quantity: runtime.Decimal | null;
};
export type ProductIngredientMaxAggregateOutputType = {
    productId: number | null;
    ingredientId: number | null;
    quantity: runtime.Decimal | null;
};
export type ProductIngredientCountAggregateOutputType = {
    productId: number;
    ingredientId: number;
    quantity: number;
    _all: number;
};
export type ProductIngredientAvgAggregateInputType = {
    productId?: true;
    ingredientId?: true;
    quantity?: true;
};
export type ProductIngredientSumAggregateInputType = {
    productId?: true;
    ingredientId?: true;
    quantity?: true;
};
export type ProductIngredientMinAggregateInputType = {
    productId?: true;
    ingredientId?: true;
    quantity?: true;
};
export type ProductIngredientMaxAggregateInputType = {
    productId?: true;
    ingredientId?: true;
    quantity?: true;
};
export type ProductIngredientCountAggregateInputType = {
    productId?: true;
    ingredientId?: true;
    quantity?: true;
    _all?: true;
};
export type ProductIngredientAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductIngredientWhereInput;
    orderBy?: Prisma.ProductIngredientOrderByWithRelationInput | Prisma.ProductIngredientOrderByWithRelationInput[];
    cursor?: Prisma.ProductIngredientWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProductIngredientCountAggregateInputType;
    _avg?: ProductIngredientAvgAggregateInputType;
    _sum?: ProductIngredientSumAggregateInputType;
    _min?: ProductIngredientMinAggregateInputType;
    _max?: ProductIngredientMaxAggregateInputType;
};
export type GetProductIngredientAggregateType<T extends ProductIngredientAggregateArgs> = {
    [P in keyof T & keyof AggregateProductIngredient]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProductIngredient[P]> : Prisma.GetScalarType<T[P], AggregateProductIngredient[P]>;
};
export type ProductIngredientGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductIngredientWhereInput;
    orderBy?: Prisma.ProductIngredientOrderByWithAggregationInput | Prisma.ProductIngredientOrderByWithAggregationInput[];
    by: Prisma.ProductIngredientScalarFieldEnum[] | Prisma.ProductIngredientScalarFieldEnum;
    having?: Prisma.ProductIngredientScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductIngredientCountAggregateInputType | true;
    _avg?: ProductIngredientAvgAggregateInputType;
    _sum?: ProductIngredientSumAggregateInputType;
    _min?: ProductIngredientMinAggregateInputType;
    _max?: ProductIngredientMaxAggregateInputType;
};
export type ProductIngredientGroupByOutputType = {
    productId: number;
    ingredientId: number;
    quantity: runtime.Decimal;
    _count: ProductIngredientCountAggregateOutputType | null;
    _avg: ProductIngredientAvgAggregateOutputType | null;
    _sum: ProductIngredientSumAggregateOutputType | null;
    _min: ProductIngredientMinAggregateOutputType | null;
    _max: ProductIngredientMaxAggregateOutputType | null;
};
export type GetProductIngredientGroupByPayload<T extends ProductIngredientGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductIngredientGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductIngredientGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductIngredientGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductIngredientGroupByOutputType[P]>;
}>>;
export type ProductIngredientWhereInput = {
    AND?: Prisma.ProductIngredientWhereInput | Prisma.ProductIngredientWhereInput[];
    OR?: Prisma.ProductIngredientWhereInput[];
    NOT?: Prisma.ProductIngredientWhereInput | Prisma.ProductIngredientWhereInput[];
    productId?: Prisma.IntFilter<"ProductIngredient"> | number;
    ingredientId?: Prisma.IntFilter<"ProductIngredient"> | number;
    quantity?: Prisma.DecimalFilter<"ProductIngredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
};
export type ProductIngredientOrderByWithRelationInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    product?: Prisma.ProductOrderByWithRelationInput;
    ingredient?: Prisma.IngredientOrderByWithRelationInput;
};
export type ProductIngredientWhereUniqueInput = Prisma.AtLeast<{
    productId_ingredientId?: Prisma.ProductIngredientProductIdIngredientIdCompoundUniqueInput;
    AND?: Prisma.ProductIngredientWhereInput | Prisma.ProductIngredientWhereInput[];
    OR?: Prisma.ProductIngredientWhereInput[];
    NOT?: Prisma.ProductIngredientWhereInput | Prisma.ProductIngredientWhereInput[];
    productId?: Prisma.IntFilter<"ProductIngredient"> | number;
    ingredientId?: Prisma.IntFilter<"ProductIngredient"> | number;
    quantity?: Prisma.DecimalFilter<"ProductIngredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    product?: Prisma.XOR<Prisma.ProductScalarRelationFilter, Prisma.ProductWhereInput>;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
}, "productId_ingredientId">;
export type ProductIngredientOrderByWithAggregationInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    _count?: Prisma.ProductIngredientCountOrderByAggregateInput;
    _avg?: Prisma.ProductIngredientAvgOrderByAggregateInput;
    _max?: Prisma.ProductIngredientMaxOrderByAggregateInput;
    _min?: Prisma.ProductIngredientMinOrderByAggregateInput;
    _sum?: Prisma.ProductIngredientSumOrderByAggregateInput;
};
export type ProductIngredientScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProductIngredientScalarWhereWithAggregatesInput | Prisma.ProductIngredientScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProductIngredientScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProductIngredientScalarWhereWithAggregatesInput | Prisma.ProductIngredientScalarWhereWithAggregatesInput[];
    productId?: Prisma.IntWithAggregatesFilter<"ProductIngredient"> | number;
    ingredientId?: Prisma.IntWithAggregatesFilter<"ProductIngredient"> | number;
    quantity?: Prisma.DecimalWithAggregatesFilter<"ProductIngredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientCreateInput = {
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    product: Prisma.ProductCreateNestedOneWithoutIngredientsInput;
    ingredient: Prisma.IngredientCreateNestedOneWithoutProductsInput;
};
export type ProductIngredientUncheckedCreateInput = {
    productId: number;
    ingredientId: number;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUpdateInput = {
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutIngredientsNestedInput;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutProductsNestedInput;
};
export type ProductIngredientUncheckedUpdateInput = {
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    ingredientId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientCreateManyInput = {
    productId: number;
    ingredientId: number;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUpdateManyMutationInput = {
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUncheckedUpdateManyInput = {
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    ingredientId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientListRelationFilter = {
    every?: Prisma.ProductIngredientWhereInput;
    some?: Prisma.ProductIngredientWhereInput;
    none?: Prisma.ProductIngredientWhereInput;
};
export type ProductIngredientOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProductIngredientProductIdIngredientIdCompoundUniqueInput = {
    productId: number;
    ingredientId: number;
};
export type ProductIngredientCountOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type ProductIngredientAvgOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type ProductIngredientMaxOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type ProductIngredientMinOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type ProductIngredientSumOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type ProductIngredientCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutProductInput, Prisma.ProductIngredientUncheckedCreateWithoutProductInput> | Prisma.ProductIngredientCreateWithoutProductInput[] | Prisma.ProductIngredientUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutProductInput | Prisma.ProductIngredientCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.ProductIngredientCreateManyProductInputEnvelope;
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
};
export type ProductIngredientUncheckedCreateNestedManyWithoutProductInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutProductInput, Prisma.ProductIngredientUncheckedCreateWithoutProductInput> | Prisma.ProductIngredientCreateWithoutProductInput[] | Prisma.ProductIngredientUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutProductInput | Prisma.ProductIngredientCreateOrConnectWithoutProductInput[];
    createMany?: Prisma.ProductIngredientCreateManyProductInputEnvelope;
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
};
export type ProductIngredientUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutProductInput, Prisma.ProductIngredientUncheckedCreateWithoutProductInput> | Prisma.ProductIngredientCreateWithoutProductInput[] | Prisma.ProductIngredientUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutProductInput | Prisma.ProductIngredientCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.ProductIngredientUpsertWithWhereUniqueWithoutProductInput | Prisma.ProductIngredientUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.ProductIngredientCreateManyProductInputEnvelope;
    set?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    disconnect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    delete?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    update?: Prisma.ProductIngredientUpdateWithWhereUniqueWithoutProductInput | Prisma.ProductIngredientUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.ProductIngredientUpdateManyWithWhereWithoutProductInput | Prisma.ProductIngredientUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.ProductIngredientScalarWhereInput | Prisma.ProductIngredientScalarWhereInput[];
};
export type ProductIngredientUncheckedUpdateManyWithoutProductNestedInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutProductInput, Prisma.ProductIngredientUncheckedCreateWithoutProductInput> | Prisma.ProductIngredientCreateWithoutProductInput[] | Prisma.ProductIngredientUncheckedCreateWithoutProductInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutProductInput | Prisma.ProductIngredientCreateOrConnectWithoutProductInput[];
    upsert?: Prisma.ProductIngredientUpsertWithWhereUniqueWithoutProductInput | Prisma.ProductIngredientUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: Prisma.ProductIngredientCreateManyProductInputEnvelope;
    set?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    disconnect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    delete?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    update?: Prisma.ProductIngredientUpdateWithWhereUniqueWithoutProductInput | Prisma.ProductIngredientUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?: Prisma.ProductIngredientUpdateManyWithWhereWithoutProductInput | Prisma.ProductIngredientUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: Prisma.ProductIngredientScalarWhereInput | Prisma.ProductIngredientScalarWhereInput[];
};
export type ProductIngredientCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutIngredientInput, Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput> | Prisma.ProductIngredientCreateWithoutIngredientInput[] | Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput | Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.ProductIngredientCreateManyIngredientInputEnvelope;
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
};
export type ProductIngredientUncheckedCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutIngredientInput, Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput> | Prisma.ProductIngredientCreateWithoutIngredientInput[] | Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput | Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.ProductIngredientCreateManyIngredientInputEnvelope;
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
};
export type ProductIngredientUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutIngredientInput, Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput> | Prisma.ProductIngredientCreateWithoutIngredientInput[] | Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput | Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.ProductIngredientUpsertWithWhereUniqueWithoutIngredientInput | Prisma.ProductIngredientUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.ProductIngredientCreateManyIngredientInputEnvelope;
    set?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    disconnect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    delete?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    update?: Prisma.ProductIngredientUpdateWithWhereUniqueWithoutIngredientInput | Prisma.ProductIngredientUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.ProductIngredientUpdateManyWithWhereWithoutIngredientInput | Prisma.ProductIngredientUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.ProductIngredientScalarWhereInput | Prisma.ProductIngredientScalarWhereInput[];
};
export type ProductIngredientUncheckedUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.ProductIngredientCreateWithoutIngredientInput, Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput> | Prisma.ProductIngredientCreateWithoutIngredientInput[] | Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput | Prisma.ProductIngredientCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.ProductIngredientUpsertWithWhereUniqueWithoutIngredientInput | Prisma.ProductIngredientUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.ProductIngredientCreateManyIngredientInputEnvelope;
    set?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    disconnect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    delete?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    connect?: Prisma.ProductIngredientWhereUniqueInput | Prisma.ProductIngredientWhereUniqueInput[];
    update?: Prisma.ProductIngredientUpdateWithWhereUniqueWithoutIngredientInput | Prisma.ProductIngredientUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.ProductIngredientUpdateManyWithWhereWithoutIngredientInput | Prisma.ProductIngredientUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.ProductIngredientScalarWhereInput | Prisma.ProductIngredientScalarWhereInput[];
};
export type ProductIngredientCreateWithoutProductInput = {
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    ingredient: Prisma.IngredientCreateNestedOneWithoutProductsInput;
};
export type ProductIngredientUncheckedCreateWithoutProductInput = {
    ingredientId: number;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientCreateOrConnectWithoutProductInput = {
    where: Prisma.ProductIngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductIngredientCreateWithoutProductInput, Prisma.ProductIngredientUncheckedCreateWithoutProductInput>;
};
export type ProductIngredientCreateManyProductInputEnvelope = {
    data: Prisma.ProductIngredientCreateManyProductInput | Prisma.ProductIngredientCreateManyProductInput[];
    skipDuplicates?: boolean;
};
export type ProductIngredientUpsertWithWhereUniqueWithoutProductInput = {
    where: Prisma.ProductIngredientWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProductIngredientUpdateWithoutProductInput, Prisma.ProductIngredientUncheckedUpdateWithoutProductInput>;
    create: Prisma.XOR<Prisma.ProductIngredientCreateWithoutProductInput, Prisma.ProductIngredientUncheckedCreateWithoutProductInput>;
};
export type ProductIngredientUpdateWithWhereUniqueWithoutProductInput = {
    where: Prisma.ProductIngredientWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProductIngredientUpdateWithoutProductInput, Prisma.ProductIngredientUncheckedUpdateWithoutProductInput>;
};
export type ProductIngredientUpdateManyWithWhereWithoutProductInput = {
    where: Prisma.ProductIngredientScalarWhereInput;
    data: Prisma.XOR<Prisma.ProductIngredientUpdateManyMutationInput, Prisma.ProductIngredientUncheckedUpdateManyWithoutProductInput>;
};
export type ProductIngredientScalarWhereInput = {
    AND?: Prisma.ProductIngredientScalarWhereInput | Prisma.ProductIngredientScalarWhereInput[];
    OR?: Prisma.ProductIngredientScalarWhereInput[];
    NOT?: Prisma.ProductIngredientScalarWhereInput | Prisma.ProductIngredientScalarWhereInput[];
    productId?: Prisma.IntFilter<"ProductIngredient"> | number;
    ingredientId?: Prisma.IntFilter<"ProductIngredient"> | number;
    quantity?: Prisma.DecimalFilter<"ProductIngredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientCreateWithoutIngredientInput = {
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    product: Prisma.ProductCreateNestedOneWithoutIngredientsInput;
};
export type ProductIngredientUncheckedCreateWithoutIngredientInput = {
    productId: number;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientCreateOrConnectWithoutIngredientInput = {
    where: Prisma.ProductIngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductIngredientCreateWithoutIngredientInput, Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput>;
};
export type ProductIngredientCreateManyIngredientInputEnvelope = {
    data: Prisma.ProductIngredientCreateManyIngredientInput | Prisma.ProductIngredientCreateManyIngredientInput[];
    skipDuplicates?: boolean;
};
export type ProductIngredientUpsertWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.ProductIngredientWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProductIngredientUpdateWithoutIngredientInput, Prisma.ProductIngredientUncheckedUpdateWithoutIngredientInput>;
    create: Prisma.XOR<Prisma.ProductIngredientCreateWithoutIngredientInput, Prisma.ProductIngredientUncheckedCreateWithoutIngredientInput>;
};
export type ProductIngredientUpdateWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.ProductIngredientWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProductIngredientUpdateWithoutIngredientInput, Prisma.ProductIngredientUncheckedUpdateWithoutIngredientInput>;
};
export type ProductIngredientUpdateManyWithWhereWithoutIngredientInput = {
    where: Prisma.ProductIngredientScalarWhereInput;
    data: Prisma.XOR<Prisma.ProductIngredientUpdateManyMutationInput, Prisma.ProductIngredientUncheckedUpdateManyWithoutIngredientInput>;
};
export type ProductIngredientCreateManyProductInput = {
    ingredientId: number;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUpdateWithoutProductInput = {
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutProductsNestedInput;
};
export type ProductIngredientUncheckedUpdateWithoutProductInput = {
    ingredientId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUncheckedUpdateManyWithoutProductInput = {
    ingredientId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientCreateManyIngredientInput = {
    productId: number;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUpdateWithoutIngredientInput = {
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    product?: Prisma.ProductUpdateOneRequiredWithoutIngredientsNestedInput;
};
export type ProductIngredientUncheckedUpdateWithoutIngredientInput = {
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientUncheckedUpdateManyWithoutIngredientInput = {
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ProductIngredientSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    productId?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["productIngredient"]>;
export type ProductIngredientSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    productId?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["productIngredient"]>;
export type ProductIngredientSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    productId?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["productIngredient"]>;
export type ProductIngredientSelectScalar = {
    productId?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
};
export type ProductIngredientOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"productId" | "ingredientId" | "quantity", ExtArgs["result"]["productIngredient"]>;
export type ProductIngredientInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type ProductIngredientIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type ProductIngredientIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product?: boolean | Prisma.ProductDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type $ProductIngredientPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProductIngredient";
    objects: {
        product: Prisma.$ProductPayload<ExtArgs>;
        ingredient: Prisma.$IngredientPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        productId: number;
        ingredientId: number;
        quantity: runtime.Decimal;
    }, ExtArgs["result"]["productIngredient"]>;
    composites: {};
};
export type ProductIngredientGetPayload<S extends boolean | null | undefined | ProductIngredientDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload, S>;
export type ProductIngredientCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProductIngredientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductIngredientCountAggregateInputType | true;
};
export interface ProductIngredientDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProductIngredient'];
        meta: {
            name: 'ProductIngredient';
        };
    };
    findUnique<T extends ProductIngredientFindUniqueArgs>(args: Prisma.SelectSubset<T, ProductIngredientFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProductIngredientFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProductIngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProductIngredientFindFirstArgs>(args?: Prisma.SelectSubset<T, ProductIngredientFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProductIngredientFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProductIngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProductIngredientFindManyArgs>(args?: Prisma.SelectSubset<T, ProductIngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProductIngredientCreateArgs>(args: Prisma.SelectSubset<T, ProductIngredientCreateArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProductIngredientCreateManyArgs>(args?: Prisma.SelectSubset<T, ProductIngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProductIngredientCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProductIngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProductIngredientDeleteArgs>(args: Prisma.SelectSubset<T, ProductIngredientDeleteArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProductIngredientUpdateArgs>(args: Prisma.SelectSubset<T, ProductIngredientUpdateArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProductIngredientDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProductIngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProductIngredientUpdateManyArgs>(args: Prisma.SelectSubset<T, ProductIngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProductIngredientUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProductIngredientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProductIngredientUpsertArgs>(args: Prisma.SelectSubset<T, ProductIngredientUpsertArgs<ExtArgs>>): Prisma.Prisma__ProductIngredientClient<runtime.Types.Result.GetResult<Prisma.$ProductIngredientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProductIngredientCountArgs>(args?: Prisma.Subset<T, ProductIngredientCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductIngredientCountAggregateOutputType> : number>;
    aggregate<T extends ProductIngredientAggregateArgs>(args: Prisma.Subset<T, ProductIngredientAggregateArgs>): Prisma.PrismaPromise<GetProductIngredientAggregateType<T>>;
    groupBy<T extends ProductIngredientGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProductIngredientGroupByArgs['orderBy'];
    } : {
        orderBy?: ProductIngredientGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProductIngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProductIngredientFieldRefs;
}
export interface Prisma__ProductIngredientClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    product<T extends Prisma.ProductDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProductDefaultArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    ingredient<T extends Prisma.IngredientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.IngredientDefaultArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProductIngredientFieldRefs {
    readonly productId: Prisma.FieldRef<"ProductIngredient", 'Int'>;
    readonly ingredientId: Prisma.FieldRef<"ProductIngredient", 'Int'>;
    readonly quantity: Prisma.FieldRef<"ProductIngredient", 'Decimal'>;
}
export type ProductIngredientFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    where: Prisma.ProductIngredientWhereUniqueInput;
};
export type ProductIngredientFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    where: Prisma.ProductIngredientWhereUniqueInput;
};
export type ProductIngredientFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProductIngredientFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProductIngredientFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProductIngredientCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductIngredientCreateInput, Prisma.ProductIngredientUncheckedCreateInput>;
};
export type ProductIngredientCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProductIngredientCreateManyInput | Prisma.ProductIngredientCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductIngredientCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    data: Prisma.ProductIngredientCreateManyInput | Prisma.ProductIngredientCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProductIngredientIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProductIngredientUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductIngredientUpdateInput, Prisma.ProductIngredientUncheckedUpdateInput>;
    where: Prisma.ProductIngredientWhereUniqueInput;
};
export type ProductIngredientUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProductIngredientUpdateManyMutationInput, Prisma.ProductIngredientUncheckedUpdateManyInput>;
    where?: Prisma.ProductIngredientWhereInput;
    limit?: number;
};
export type ProductIngredientUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductIngredientUpdateManyMutationInput, Prisma.ProductIngredientUncheckedUpdateManyInput>;
    where?: Prisma.ProductIngredientWhereInput;
    limit?: number;
    include?: Prisma.ProductIngredientIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProductIngredientUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    where: Prisma.ProductIngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductIngredientCreateInput, Prisma.ProductIngredientUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProductIngredientUpdateInput, Prisma.ProductIngredientUncheckedUpdateInput>;
};
export type ProductIngredientDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
    where: Prisma.ProductIngredientWhereUniqueInput;
};
export type ProductIngredientDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductIngredientWhereInput;
    limit?: number;
};
export type ProductIngredientDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductIngredientSelect<ExtArgs> | null;
    omit?: Prisma.ProductIngredientOmit<ExtArgs> | null;
    include?: Prisma.ProductIngredientInclude<ExtArgs> | null;
};
