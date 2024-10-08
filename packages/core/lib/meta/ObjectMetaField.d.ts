import { MetaField } from './MetaField';
import { ValueDispatcher } from '../events';
export type ValueOf<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends MetaField<any, infer P> ? P : never;
};
type TransformationOf<TObject extends Record<string, any>, TKey extends CallableKeys<MetaField<any>>> = {
    [K in keyof TObject]: TObject[K] extends MetaField<infer A, infer B> ? ReturnType<MetaField<A, B>[TKey]> : never;
};
type CallableKeys<T> = {
    [K in keyof T]: T[K] extends () => void ? K : never;
}[keyof T];
/**
 * Represents an object with nested meta-fields.
 */
declare class ObjectMetaFieldInternal<T extends Record<string, MetaField<any>>> extends MetaField<ValueOf<T>> {
    readonly type: ObjectConstructor;
    /**
     * Triggered when the nested fields change.
     *
     * @eventProperty
     */
    get onFieldsChanged(): import("../events").SubscribableValueEvent<MetaField<unknown, unknown>[]>;
    protected ignoreChange: boolean;
    protected customFields: Record<string, unknown>;
    protected readonly fields: Map<string, MetaField<unknown>>;
    protected readonly event: ValueDispatcher<MetaField<unknown>[]>;
    constructor(name: string, fields: T);
    set(value: Partial<ValueOf<T>>): void;
    serialize(): ValueOf<T>;
    clone(): this;
    protected handleChange: () => void;
    protected transform<TKey extends CallableKeys<MetaField<any>>>(fn: TKey): TransformationOf<T, TKey>;
}
/**
 * {@inheritDoc ObjectMetaFieldInternal}
 */
export type ObjectMetaField<T extends Record<string, MetaField<any>>> = ObjectMetaFieldInternal<T> & T;
/**
 * {@inheritDoc ObjectMetaFieldInternal}
 */
export declare const ObjectMetaField: new <T extends Record<string, MetaField<any, any>>>(name: string, data: T) => ObjectMetaField<T>;
export {};
//# sourceMappingURL=ObjectMetaField.d.ts.map