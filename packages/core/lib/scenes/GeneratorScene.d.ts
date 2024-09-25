import { Thread, ThreadGenerator } from '../threading';
import { Logger, PlaybackStatus } from '../app';
import { TimeEvents } from './timeEvents';
import { Variables } from './Variables';
import { EventDispatcher } from '../events';
import { CachedSceneData, FullSceneDescription, Scene, SceneDescriptionReload, SceneRenderEvent } from './Scene';
import { LifecycleEvents } from './LifecycleEvents';
import { Threadable } from './Threadable';
import { Vector2 } from '../types';
import { Random } from './Random';
import { SceneMetadata } from './SceneMetadata';
import { Slides } from './Slides';
export interface ThreadGeneratorFactory<T> {
    (view: T): ThreadGenerator;
}
/**
 * The default implementation of the {@link Scene} interface.
 *
 * Uses generators to control the animation.
 */
export declare abstract class GeneratorScene<T> implements Scene<ThreadGeneratorFactory<T>>, Threadable {
    readonly name: string;
    readonly playback: PlaybackStatus;
    readonly logger: Logger;
    readonly meta: SceneMetadata;
    readonly timeEvents: TimeEvents;
    readonly slides: Slides;
    readonly variables: Variables;
    random: Random;
    creationStack?: string;
    get firstFrame(): number;
    get lastFrame(): number;
    get onCacheChanged(): import("../events").SubscribableValueEvent<CachedSceneData>;
    private readonly cache;
    get onReloaded(): import("../events").Subscribable<void, import("../events").EventHandler<void>>;
    private readonly reloaded;
    get onRecalculated(): import("../events").Subscribable<void, import("../events").EventHandler<void>>;
    private readonly recalculated;
    get onThreadChanged(): import("../events").SubscribableValueEvent<Thread | null>;
    private readonly thread;
    get onRenderLifecycle(): import("../events").Subscribable<[SceneRenderEvent, CanvasRenderingContext2D], import("../events").EventHandler<[SceneRenderEvent, CanvasRenderingContext2D]>>;
    protected readonly renderLifecycle: EventDispatcher<[SceneRenderEvent, CanvasRenderingContext2D]>;
    get onReset(): import("../events").Subscribable<void, import("../events").EventHandler<void>>;
    private readonly afterReset;
    readonly lifecycleEvents: LifecycleEvents;
    get LifecycleEvents(): LifecycleEvents;
    get previous(): Scene<unknown> | null;
    protected resolutionScale: number;
    private runnerFactory;
    private previousScene;
    private runner;
    private state;
    private cached;
    private counters;
    private size;
    constructor(description: FullSceneDescription<ThreadGeneratorFactory<T>>);
    abstract getView(): T;
    /**
     * Update the view.
     *
     * Invoked after each step of the main generator.
     * Can be used for calculating layout.
     *
     * Can modify the state of the view.
     */
    update(): void;
    render(context: CanvasRenderingContext2D): Promise<void>;
    protected abstract draw(context: CanvasRenderingContext2D): void;
    reload({ config, size, stack, resolutionScale, }?: SceneDescriptionReload<ThreadGeneratorFactory<T>>): void;
    recalculate(setFrame: (frame: number) => void): Promise<void>;
    next(): Promise<void>;
    reset(previousScene?: Scene | null): Promise<void>;
    getSize(): Vector2;
    isAfterTransitionIn(): boolean;
    canTransitionOut(): boolean;
    isFinished(): boolean;
    enterInitial(): void;
    enterAfterTransitionIn(): void;
    enterCanTransitionOut(): void;
    isCached(): boolean;
    /**
     * Invoke the given callback in the context of this scene.
     *
     * @remarks
     * This method makes sure that the context of this scene is globally available
     * during the execution of the callback.
     *
     * @param callback - The callback to invoke.
     */
    protected execute<T>(callback: () => T): T;
}
//# sourceMappingURL=GeneratorScene.d.ts.map