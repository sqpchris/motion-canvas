import { ThreadGenerator } from '../threading';
/**
 * A callback called by {@link EveryTimer} every N seconds.
 */
export interface EveryCallback {
    /**
     * @param tick - The amount of times the timer has ticked.
     */
    (tick: number): void;
}
export interface EveryTimer {
    /**
     * The generator responsible for running this timer.
     */
    runner: ThreadGenerator;
    setInterval(value: number): void;
    setCallback(value: EveryCallback): void;
    /**
     * Wait until the timer ticks.
     */
    sync(): ThreadGenerator;
}
/**
 * Call the given callback every N seconds.
 *
 * @example
 * ```ts
 * const timer = every(2, time => console.log(time));
 * yield timer.runner;
 *
 * // current time: 0s
 * yield* waitFor(5);
 * // current time: 5s
 * yield* timer.sync();
 * // current time: 6s
 * ```
 *
 * @param interval - The interval between subsequent calls.
 * @param callback - The callback to be called.
 */
export declare function every(interval: number, callback: EveryCallback): EveryTimer;
//# sourceMappingURL=every.d.ts.map