import { SubscribableValueEvent } from '../events';
import { Thread } from '../threading';
/**
 * Scenes can implement this interface to display their thread hierarchy in the
 * UI.
 *
 * @remarks
 * This interface is only useful when a scene uses thread generators to run.
 */
export interface Threadable {
    /**
     * Triggered when the main thread changes.
     *
     * @eventProperty
     */
    get onThreadChanged(): SubscribableValueEvent<Thread | null>;
}
export declare function isThreadable(value: any): value is Threadable;
//# sourceMappingURL=Threadable.d.ts.map