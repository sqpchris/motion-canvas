import { Vector2 } from '../types';
export interface InterpolationFunction<T, TRest extends any[] = any[]> {
    (from: T, to: T, value: number, ...args: TRest): T;
}
export declare function textLerp(from: string, to: string, value: number): string;
/**
 * Interpolate between any two Records, including objects and Maps, even with
 * mismatched keys.
 *
 * @remarks
 * Any old key that is missing in `to` will be removed immediately once value is
 * not 0. Any new key that is missing in `from` will be added once value reaches
 * 1.
 *
 * @param from - The input to favor when value is 0.
 * @param to - The input to favor when value is 1.
 * @param value - On a scale between 0 and 1, how closely to favor from vs to.
 *
 * @returns A value matching the structure of from and to.
 */
export declare function deepLerp<TFrom extends Record<any, unknown>, TTo extends Record<any, unknown>>(from: TFrom, to: TTo, value: number): TFrom | TTo;
export declare function deepLerp<TFrom extends Record<any, unknown>, TTo extends Record<any, unknown>>(from: TFrom, to: TTo, value: number, suppressWarnings: boolean): TFrom | TTo;
/**
 * Interpolate between any two values, including objects, arrays, and Maps.
 *
 * @param from - The input to favor when value is 0.
 * @param to - The input to favor when value is 1.
 * @param value - On a scale between 0 and 1, how closely to favor from vs to.
 *
 * @returns A value matching the structure of from and to.
 */
export declare function deepLerp<T>(from: T, to: T, value: number): T;
export declare function deepLerp<T>(from: T, to: T, value: number, suppressWarnings: boolean): T;
export declare function map(from: number, to: number, value: number): number;
export declare function remap(fromIn: number, toIn: number, fromOut: number, toOut: number, value: number): number;
export declare function clamp(min: number, max: number, value: number): number;
export declare function clampRemap(fromIn: number, toIn: number, fromOut: number, toOut: number, value: number): number;
export declare function arcLerp(value: number, reverse: boolean, ratio: number): Vector2;
//# sourceMappingURL=interpolationFunctions.d.ts.map