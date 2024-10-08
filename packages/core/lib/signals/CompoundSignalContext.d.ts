import { InterpolationFunction } from '../tweening';
import { Signal, SignalContext } from './SignalContext';
import { SignalExtensions, SignalValue } from './types';
export type CompoundSignal<TSetterValue, TValue extends TSetterValue, TKeys extends keyof TValue = keyof TValue, TOwner = void, TContext = CompoundSignalContext<TSetterValue, TValue, TKeys, TOwner>> = Signal<TSetterValue, TValue, TOwner, TContext> & {
    [K in TKeys]: Signal<TValue[K], TValue[K], TOwner extends void ? CompoundSignal<TSetterValue, TValue, TKeys, TOwner, TContext> : TOwner>;
};
export declare class CompoundSignalContext<TSetterValue, TValue extends TSetterValue, TKeys extends keyof TValue = keyof TValue, TOwner = void> extends SignalContext<TSetterValue, TValue, TOwner> {
    private readonly entries;
    readonly signals: [keyof TValue, Signal<any, any, TOwner>][];
    constructor(entries: (TKeys | [keyof TValue, Signal<any, any, TOwner>])[], parser: (value: TSetterValue) => TValue, initial: SignalValue<TSetterValue>, interpolation: InterpolationFunction<TValue>, owner?: TOwner, extensions?: Partial<SignalExtensions<TSetterValue, TValue>>);
    toSignal(): CompoundSignal<TSetterValue, TValue, TKeys, TOwner>;
    parse(value: TSetterValue): TValue;
    getter(): TValue;
    setter(value: SignalValue<TValue>): TOwner;
    reset(): TOwner;
    save(): TOwner;
}
//# sourceMappingURL=CompoundSignalContext.d.ts.map