export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly STAFF: "STAFF";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Unit: {
    readonly GRAM: "GRAM";
    readonly KILOGRAM: "KILOGRAM";
    readonly MILLILITER: "MILLILITER";
    readonly LITER: "LITER";
    readonly UNIT: "UNIT";
};
export type Unit = (typeof Unit)[keyof typeof Unit];
export declare const MovementType: {
    readonly IN: "IN";
    readonly OUT: "OUT";
    readonly ADJUSTMENT: "ADJUSTMENT";
};
export type MovementType = (typeof MovementType)[keyof typeof MovementType];
