import { InterpolationFunction } from '../tweening';
import { Direction, Origin } from './Origin';
import { Type } from './Type';
import { CompoundSignal, Signal, SignalValue } from '../signals';
export type SerializedVector2<T = number> = {
    x: T;
    y: T;
};
export type PossibleVector2<T = number> = SerializedVector2<T> | {
    width: T;
    height: T;
} | T | [T, T] | undefined;
export type Vector2Signal<T> = CompoundSignal<PossibleVector2, Vector2, 'x' | 'y', T>;
export type SimpleVector2Signal<T> = Signal<PossibleVector2, Vector2, T>;
/**
 * Represents a two-dimensional vector.
 */
export declare class Vector2 implements Type {
    static readonly symbol: unique symbol;
    static readonly zero: Vector2;
    static readonly one: Vector2;
    static readonly right: Vector2;
    static readonly left: Vector2;
    static readonly up: Vector2;
    static readonly down: Vector2;
    x: number;
    y: number;
    static createSignal(initial?: SignalValue<PossibleVector2>, interpolation?: InterpolationFunction<Vector2>, owner?: any): Vector2Signal<void>;
    static lerp(from: Vector2, to: Vector2, value: number | Vector2): Vector2;
    static arcLerp(from: Vector2, to: Vector2, value: number, reverse?: boolean, ratio?: number): Vector2;
    static createArcLerp(reverse?: boolean, ratio?: number): (from: Vector2, to: Vector2, value: number) => Vector2;
    static fromOrigin(origin: Origin | Direction): Vector2;
    static fromScalar(value: number): Vector2;
    static fromRadians(radians: number): Vector2;
    static fromDegrees(degrees: number): Vector2;
    /**
     * Return the angle in radians between the vector described by x and y and the
     * positive x-axis.
     *
     * @param x - The x component of the vector.
     * @param y - The y component of the vector.
     */
    static radians(x: number, y: number): number;
    /**
     * Return the angle in degrees between the vector described by x and y and the
     * positive x-axis.
     *
     * @param x - The x component of the vector.
     * @param y - The y component of the vector.
     *
     * @remarks
     * The returned angle will be between -180 and 180 degrees.
     */
    static degrees(x: number, y: number): number;
    static magnitude(x: number, y: number): number;
    static squaredMagnitude(x: number, y: number): number;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get magnitude(): number;
    get squaredMagnitude(): number;
    get normalized(): Vector2;
    get safe(): Vector2;
    get flipped(): Vector2;
    get floored(): Vector2;
    get perpendicular(): Vector2;
    /**
     * Return the angle in radians between the vector and the positive x-axis.
     */
    get radians(): number;
    /**
     * Return the angle in degrees between the vector and the positive x-axis.
     *
     * @remarks
     * The returned angle will be between -180 and 180 degrees.
     */
    get degrees(): number;
    get ctg(): number;
    constructor();
    constructor(from: PossibleVector2);
    constructor(x: number, y: number);
    lerp(to: Vector2, value: Vector2 | number): Vector2;
    getOriginOffset(origin: Origin | Direction): Vector2;
    scale(value: number): Vector2;
    transformAsPoint(matrix: DOMMatrix): Vector2;
    transform(matrix: DOMMatrix): Vector2;
    mul(possibleVector: PossibleVector2): Vector2;
    div(possibleVector: PossibleVector2): Vector2;
    add(possibleVector: PossibleVector2): Vector2;
    sub(possibleVector: PossibleVector2): Vector2;
    dot(possibleVector: PossibleVector2): number;
    mod(possibleVector: PossibleVector2): Vector2;
    addX(value: number): Vector2;
    addY(value: number): Vector2;
    toSymbol(): symbol;
    toString(): string;
    serialize(): SerializedVector2;
    /**
     * Check if two vectors are exactly equal to each other.
     *
     * @remarks
     * If you need to compensate for floating point inaccuracies, use the
     * {@link equals} method, instead.
     *
     * @param other - The vector to compare.
     */
    exactlyEquals(other: Vector2): boolean;
    /**
     * Check if two vectors are equal to each other.
     *
     * @remarks
     * This method allows passing an allowed error margin when comparing vectors
     * to compensate for floating point inaccuracies. To check if two vectors are
     * exactly equal, use the {@link exactlyEquals} method, instead.
     *
     * @param other - The vector to compare.
     * @param threshold - The allowed error threshold when comparing the vectors.
     */
    equals(other: Vector2, threshold?: number): boolean;
}
//# sourceMappingURL=Vector.d.ts.map