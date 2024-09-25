import { PlaybackManager, PlaybackState } from './PlaybackManager';
import { Stage } from './Stage';
import { EventDispatcher, ValueDispatcher } from '../events';
import { Vector2 } from '../types';
import { PlaybackStatus } from './PlaybackStatus';
import { Semaphore } from '../utils';
import { ReadOnlyTimeEvents } from '../scenes/timeEvents';
export var RendererState;
(function (RendererState) {
    RendererState[RendererState["Initial"] = 0] = "Initial";
    RendererState[RendererState["Working"] = 1] = "Working";
    RendererState[RendererState["Aborting"] = 2] = "Aborting";
})(RendererState || (RendererState = {}));
export var RendererResult;
(function (RendererResult) {
    RendererResult[RendererResult["Success"] = 0] = "Success";
    RendererResult[RendererResult["Error"] = 1] = "Error";
    RendererResult[RendererResult["Aborted"] = 2] = "Aborted";
})(RendererResult || (RendererResult = {}));
/**
 * The rendering logic used by the editor to export animations.
 *
 * @remarks
 * This class uses the `PlaybackManager` to render animations. In contrast to a
 * player, a renderer does not use an update loop. It plays through the
 * animation as fast as it can, occasionally pausing to keep the UI responsive.
 *
 * The actual exporting is outsourced to an {@link Exporter}.
 */
export class Renderer {
    get onStateChanged() {
        return this.state.subscribable;
    }
    get onFinished() {
        return this.finished.subscribable;
    }
    get onFrameChanged() {
        return this.frame.subscribable;
    }
    constructor(project) {
        this.project = project;
        this.state = new ValueDispatcher(RendererState.Initial);
        this.finished = new EventDispatcher();
        this.frame = new ValueDispatcher(0);
        this.stage = new Stage();
        this.lock = new Semaphore();
        this.exporter = null;
        this.abortController = null;
        this.playback = new PlaybackManager();
        this.status = new PlaybackStatus(this.playback);
        const scenes = [];
        for (const description of project.scenes) {
            const scene = new description.klass({
                ...description,
                meta: description.meta.clone(),
                logger: this.project.logger,
                playback: this.status,
                size: new Vector2(1920, 1080),
                resolutionScale: 1,
                timeEventsClass: ReadOnlyTimeEvents,
            });
            scenes.push(scene);
        }
        this.playback.setup(scenes);
    }
    /**
     * Render the animation using the provided settings.
     *
     * @param settings - The rendering settings.
     */
    async render(settings) {
        if (this.state.current !== RendererState.Initial)
            return;
        await this.lock.acquire();
        this.state.current = RendererState.Working;
        let result;
        try {
            this.abortController = new AbortController();
            result = await this.run(settings, this.abortController.signal);
        }
        catch (e) {
            this.project.logger.error(e);
            result = RendererResult.Error;
            if (this.exporter) {
                try {
                    await this.exporter.stop?.(result);
                }
                catch (_) {
                    // do nothing
                }
                this.exporter = null;
            }
        }
        this.state.current = RendererState.Initial;
        this.finished.dispatch(result);
        this.lock.release();
    }
    /**
     * Abort the ongoing render process.
     */
    abort() {
        if (this.state.current !== RendererState.Working)
            return;
        this.abortController?.abort();
        this.state.current = RendererState.Aborting;
    }
    /**
     * Export an individual frame.
     *
     * @remarks
     * This method always uses the default `ImageExporter`.
     *
     * @param settings - The rendering settings.
     * @param time - The timestamp to export.
     */
    async renderFrame(settings, time) {
        await this.lock.acquire();
        try {
            const frame = this.status.secondsToFrames(time);
            this.stage.configure(settings);
            this.playback.fps = settings.fps;
            this.playback.state = PlaybackState.Rendering;
            await this.reloadScenes(settings);
            await this.playback.reset();
            await this.playback.seek(frame);
            await this.stage.render(this.playback.currentScene, this.playback.previousScene);
            if (import.meta.hot) {
                import.meta.hot.send('motion-canvas:export', {
                    frame,
                    data: this.stage.finalBuffer.toDataURL('image/png'),
                    mimeType: 'image/png',
                    subDirectories: ['still', this.project.name],
                });
            }
        }
        catch (e) {
            this.project.logger.error(e);
        }
        this.lock.release();
    }
    async run(settings, signal) {
        const exporterClass = this.project.meta.rendering.exporter.exporters.find(exporter => exporter.id === settings.exporter.name);
        if (!exporterClass) {
            this.project.logger.error(`Could not find the "${settings.exporter.name}" exporter.`);
            return RendererResult.Error;
        }
        this.exporter = await exporterClass.create(this.project, settings);
        if (this.exporter.configuration) {
            settings = {
                ...settings,
                ...((await this.exporter.configuration()) ?? {}),
            };
        }
        this.stage.configure(settings);
        this.playback.fps = settings.fps;
        this.playback.state = PlaybackState.Rendering;
        const from = this.status.secondsToFrames(settings.range[0]);
        const to = this.status.secondsToFrames(settings.range[1]);
        await this.reloadScenes(settings);
        await this.playback.recalculate();
        if (signal.aborted)
            return RendererResult.Aborted;
        await this.playback.reset();
        if (signal.aborted)
            return RendererResult.Aborted;
        await this.playback.seek(from);
        if (signal.aborted)
            return RendererResult.Aborted;
        await this.exporter.start?.();
        let lastRefresh = performance.now();
        let result = RendererResult.Success;
        try {
            await this.exportFrame(signal);
            if (signal.aborted) {
                result = RendererResult.Aborted;
            }
            else {
                let finished = false;
                while (!finished) {
                    await this.playback.progress();
                    await this.exportFrame(signal);
                    if (performance.now() - lastRefresh > 1 / 30) {
                        lastRefresh = performance.now();
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    if (this.playback.finished || this.playback.frame >= to) {
                        finished = true;
                    }
                    if (signal.aborted) {
                        result = RendererResult.Aborted;
                        finished = true;
                    }
                }
            }
        }
        catch (e) {
            this.project.logger.error(e);
            result = RendererResult.Error;
        }
        await this.exporter.stop?.(result);
        this.exporter = null;
        return result;
    }
    async reloadScenes(settings) {
        for (let i = 0; i < this.project.scenes.length; i++) {
            const description = this.project.scenes[i];
            const scene = this.playback.onScenesRecalculated.current[i];
            scene.reload({
                config: description.onReplaced.current.config,
                size: settings.size,
                resolutionScale: settings.resolutionScale,
            });
            scene.meta.set(description.meta.get());
            scene.variables.updateSignals(this.project.variables ?? {});
        }
    }
    async exportFrame(signal) {
        this.frame.current = this.playback.frame;
        await this.stage.render(this.playback.currentScene, this.playback.previousScene);
        const sceneFrame = this.playback.frame - this.playback.currentScene.firstFrame;
        await this.exporter.handleFrame(this.stage.finalBuffer, this.playback.frame, sceneFrame, this.playback.currentScene.name, signal);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwL1JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakUsT0FBTyxFQUFDLEtBQUssRUFBZ0IsTUFBTSxTQUFTLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDM0QsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNqQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQVl4RCxNQUFNLENBQU4sSUFBWSxhQUlYO0FBSkQsV0FBWSxhQUFhO0lBQ3ZCLHVEQUFPLENBQUE7SUFDUCx1REFBTyxDQUFBO0lBQ1AseURBQVEsQ0FBQTtBQUNWLENBQUMsRUFKVyxhQUFhLEtBQWIsYUFBYSxRQUl4QjtBQUVELE1BQU0sQ0FBTixJQUFZLGNBSVg7QUFKRCxXQUFZLGNBQWM7SUFDeEIseURBQU8sQ0FBQTtJQUNQLHFEQUFLLENBQUE7SUFDTCx5REFBTyxDQUFBO0FBQ1QsQ0FBQyxFQUpXLGNBQWMsS0FBZCxjQUFjLFFBSXpCO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxPQUFPLFFBQVE7SUFDbkIsSUFBVyxjQUFjO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7SUFDakMsQ0FBQztJQUdELElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ3BDLENBQUM7SUFHRCxJQUFXLGNBQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlB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