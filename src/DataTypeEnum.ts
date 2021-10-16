export enum BaseType {
    f32, 
    f64,
    f16,
    i32,
    u32
}

export enum DataComposing {
    Base,
    Vector,
    Matrix,
    Array,
}

export type DataType = BaseType | {
    base: DataType,
    dimensions: [1],
    composing: DataComposing
};