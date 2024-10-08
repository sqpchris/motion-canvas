import { InterpolationFunction, TimingFunction } from '../tweening';
import { ThreadGenerator } from '../threading';
import { DependencyContext } from './DependencyContext';
import { SignalExtensions, SignalGenerator, SignalGetter, SignalSetter, SignalTween, SignalValue } from './types';
import { DEFAULT } from './symbols';
export type SimpleSignal<TValue, TReturn = void> = Signal<TValue, TValue, TReturn>;
export interface Signal<TSetterValue, TValue extends TSetterValue, TOwner = void, TContext = SignalContext<TSetterValue, TValue, TOwner>> extends SignalSetter<TSetterValue, TOwner>, SignalGetter<TValue>, SignalTween<TSetterValue, TValue> {
    /**
     * {@inheritDoc SignalContext.reset}
     */
    reset(): TOwner;
    /**
     * {@inheritDoc SignalContext.save}
     */
    save(): TOwner;
    /**
     * {@inheritDoc SignalContext.isInitial}
     */
    isInitial(): boolean;
    context: TContext;
}
export declare class SignalContext<TSetterValue, TValue extends TSetterValue = TSetterValue, TOwner = void> extends DependencyContext<TOwner> {
    private initial;
    private readonly interpolation;
    protected parser: (value: TSetterValue) => TValue;
    protected extensions: SignalExtensions<TSetterValue, TValue>;
    protected current: SignalValue<TSetterValue> | undefined;
    protected last: TValue | undefined;
    constructor(initial: SignalValue<TSetterValue> | undefined, interpolation: InterpolationFunction<TValue>, owner?: TOwner, parser?: (value: TSetterValue) => TValue, extensions?: Partial<SignalExtensions<TSetterValue, TValue>>);
    toSignal(): Signal<TSetterValue, TValue, TOwner>;
    parse(value: TSetterValue): TValue;
    set(value: SignalValue<TSetterValue> | typeof DEFAULT): TOwner;
    setter(value: SignalValue<TSetterValue> | typeof DEFAULT): TOwner;
    get(): TValue;
    getter(): TValue;
    protected invoke(value?: SignalValue<TSetterValue> | typeof DEFAULT, duration?: number, timingFunction?: TimingFunction, interpolationFunction?: InterpolationFunction<TValue>): TValue | TOwner | SignalGenerator<TSetterValue, TValue>;
    protected createQueue(defaultTimingFunction: TimingFunction, defaultInterpolationFunction: InterpolationFunction<TValue>): SignalGenerator<TSetterValue, TValue>;
    protected tween(value: SignalValue<TSetterValue> | typeof DEFAULT, duration: number, timingFunction: TimingFunction, interpolationFunction: InterpolationFunction<TValue>): ThreadGenerator;
    tweener(value: SignalValue<TSetterValue>, duration: number, timingFunction: TimingFunction, interpolationFunction: InterpolationFunction<TValue>): ThreadGenerator;
    dispose(): void;
    /**
     * Reset the signal to its initial value (if one has been set).
     *
     * @example
     * ```ts
     * const signal = createSignal(7);
     *
     * signal.reset();
     * // same as:
     * signal(7);
     * ```
     */
    reset(): TOwner;
    /**
     * Compute the current value of the signal and immediately set it.
     *
     * @remarks
     * This method can be used to stop the signal from updating while keeping its
     * current value.
     *
     * @example
     * ```ts
     * signal.save();
     * // same as:
     * signal(signal());
     * ```
     */
    save(): TOwner;
    /**
     * Check if the signal is currently using its initial value.
     *
     * @example
     * ```ts
     *
     * const signal = createSignal(0);
     * signal.isInitial(); // true
     *
     * signal(5);
     * signal.isInitial(); // false
     *
     * signal(DEFAULT);
     * signal.isInitial(); // true
     * ```
     */
    isInitial(): boolean;
    /**
     * Get the raw value of this signal.
     *
     * @remarks
     * If the signal was provided with a factory function, the function itself
     * will be returned, without invoking it.
     *
     * This method can be used to create copies of signals.
     *
     * @example
     * ```ts
     * const a = createSignal(2);
     * const b = createSignal(() => a);
     * // b() == 2
     *
     * const bClone = createSignal(b.raw());
     * // bClone() == 2
     *
     * a(4);
     * // b() == 4
     * // bClone() == 4
     * ```
     */
    raw(): SignalValue<TSetterValue> | undefined;
}
//# sourceMappingURL=SignalContext.d.ts.map