import { ThreadGenerator } from './ThreadGenerator';
/**
 * A class representing an individual thread.
 *
 * @remarks
 * Thread is a wrapper for a generator that can be executed concurrently.
 *
 * Aside from the main thread, all threads need to have a parent.
 * If a parent finishes execution, all of its child threads are terminated.
 */
export declare class Thread {
    /**
     * The generator wrapped by this thread.
     */
    readonly runner: ThreadGenerator;
    children: Thread[];
    /**
     * The next value to be passed to the wrapped generator.
     */
    value: unknown;
    /**
     * The current time of this thread.
     *
     * @remarks
     * Used by {@link flow.waitFor} and other time-based functions to properly
     * support durations shorter than one frame.
     */
    readonly time: import("../signals").SimpleSignal<number, void>;
    /**
     * The fixed time of this thread.
     *
     * @remarks
     * Fixed time is a multiple of the frame duration. It can be used to account
     * for the difference between this thread's {@link time} and the time of the
     * current animation frame.
     */
    get fixed(): number;
    /**
     * Check if this thread or any of its ancestors has been canceled.
     */
    get canceled(): boolean;
    get paused(): boolean;
    parent: Thread | null;
    private isCanceled;
    private isPaused;
    private fixedTime;
    constructor(
    /**
     * The generator wrapped by this thread.
     */
    runner: ThreadGenerator);
    /**
     * Progress the wrapped generator once.
     */
    next(): IteratorYieldResult<void | Promise<any> | ThreadGenerator | import("./ThreadGenerator").Promisable<any>> | IteratorReturnResult<void> | {
        value: null;
        done: boolean;
    };
    /**
     * Prepare the thread for the next update cycle.
     *
     * @param dt - The delta time of the next cycle.
     */
    update(dt: number): void;
    add(child: Thread): void;
    cancel(): void;
    pause(value: boolean): void;
}
//# sourceMappingURL=Thread.d.ts.map