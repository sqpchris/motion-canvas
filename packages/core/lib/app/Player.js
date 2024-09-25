import { PlaybackManager, PlaybackState } from './PlaybackManager';
import { AudioManager } from '../media';
import { clamp } from '../tweening';
import { AsyncEventDispatcher, EventDispatcher, ValueDispatcher, } from '../events';
import { Vector2 } from '../types';
import { PlaybackStatus } from './PlaybackStatus';
import { Semaphore } from '../utils';
import { EditableTimeEvents } from '../scenes/timeEvents';
const MAX_AUDIO_DESYNC = 1 / 50;
/**
 * The player logic used by the editor and embeddable player.
 *
 * @remarks
 * This class builds on top of the `PlaybackManager` to provide a simple
 * interface similar to other media players. It plays through the animation
 * using a real-time update loop and optionally synchronises it with audio.
 */
export class Player {
    /**
     * Triggered during each iteration of the update loop when the frame is ready
     * to be rendered.
     *
     * @remarks
     * Player does not perform any rendering on its own. For the animation to be
     * visible, another class must subscribe to this event and perform the
     * rendering itself. {@link Stage} can be used to display the animation.
     *
     * @eventProperty
     */
    get onRender() {
        return this.render.subscribable;
    }
    get onStateChanged() {
        return this.playerState.subscribable;
    }
    get onFrameChanged() {
        return this.frame.subscribable;
    }
    get onDurationChanged() {
        return this.duration.subscribable;
    }
    /**
     * Triggered right after recalculation finishes.
     *
     * @remarks
     * Can be used to provide visual feedback.
     *
     * @eventProperty
     */
    get onRecalculated() {
        return this.recalculated.subscribable;
    }
    get startFrame() {
        return Math.min(this.playback.duration, this.status.secondsToFrames(this.startTime));
    }
    get endFrame() {
        return Math.min(this.playback.duration, this.status.secondsToFrames(this.endTime));
    }
    get finished() {
        return this.playback.finished || this.playback.frame >= this.endFrame;
    }
    constructor(project, settings = {}, initialState = {}, initialFrame = -1) {
        this.project = project;
        this.settings = settings;
        this.initialState = initialState;
        this.initialFrame = initialFrame;
        this.render = new AsyncEventDispatcher();
        this.frame = new ValueDispatcher(0);
        this.duration = new ValueDispatcher(0);
        this.recalculated = new EventDispatcher();
        this.lock = new Semaphore();
        this.startTime = 0;
        this.endTime = Infinity;
        this.requestId = null;
        this.renderTime = 0;
        this.playFramesAdvanced = 0;
        this.playStartTime = 0;
        this.requestAnimationFrameTime = 0;
        this.requestedSeek = -1;
        this.requestedRecalculation = true;
        this.active = false;
        this.playerState = new ValueDispatcher({
            loop: true,
            muted: true,
            speed: 1,
            ...initialState,
            paused: true,
        });
        this.requestedSeek = initialFrame;
        this.logger = this.project.logger;
        this.playback = new PlaybackManager();
        this.status = new PlaybackStatus(this.playback);
        this.audio = new AudioManager(this.logger);
        this.size = settings.size ?? new Vector2(1920, 1080);
        this.resolutionScale = settings.resolutionScale ?? 1;
        this.startTime = settings.range?.[0] ?? 0;
        this.endTime = settings.range?.[1] ?? Infinity;
        this.playback.fps = settings.fps ?? 60;
        this.audio.setOffset(settings.audioOffset ?? 0);
        if (project.audio) {
            this.audio.setSource(project.audio);
        }
        const scenes = [];
        for (const description of project.scenes) {
            const scene = new description.klass({
                ...description,
                playback: this.status,
                logger: this.project.logger,
                size: this.size,
                resolutionScale: this.resolutionScale,
                timeEventsClass: EditableTimeEvents,
            });
            description.onReplaced?.subscribe(description => {
                scene.reload(description);
            }, false);
            scene.onReloaded.subscribe(() => this.requestRecalculation());
            scene.variables.updateSignals(project.variables ?? {});
            scenes.push(scene);
        }
        this.playback.setup(scenes);
        this.activate();
    }
    async configure(settings) {
        await this.lock.acquire();
        let frame = this.playback.frame;
        let recalculate = false;
        this.startTime = settings.range[0];
        this.endTime = settings.range[1];
        if (this.playback.fps !== settings.fps) {
            const ratio = settings.fps / this.playback.fps;
            this.playback.fps = settings.fps;
            frame = Math.floor(frame * ratio);
            recalculate = true;
        }
        if (!settings.size.exactlyEquals(this.size) ||
            settings.resolutionScale !== this.resolutionScale) {
            this.size = settings.size;
            this.resolutionScale = settings.resolutionScale;
            this.playback.reload({
                size: this.size,
                resolutionScale: this.resolutionScale,
            });
        }
        if (settings.audioOffset !== undefined) {
            this.audio.setOffset(settings.audioOffset);
        }
        this.lock.release();
        if (recalculate) {
            this.playback.reload();
            this.frame.current = frame;
            this.requestRecalculation();
            this.requestedSeek = frame;
        }
    }
    requestSeek(value) {
        this.requestedSeek = this.clampRange(value);
    }
    requestPreviousFrame() {
        this.requestedSeek = this.frame.current - this.playback.speed;
    }
    requestNextFrame() {
        this.requestedSeek = this.frame.current + this.playback.speed;
    }
    requestReset() {
        this.requestedSeek = 0;
    }
    toggleLoop(value = !this.playerState.current.loop) {
        if (value !== this.playerState.current.loop) {
            this.playerState.current = {
                ...this.playerState.current,
                loop: value,
            };
        }
    }
    togglePlayback(value = this.playerState.current.paused) {
        if (value === this.playerState.current.paused) {
            this.playerState.current = {
                ...this.playerState.current,
                paused: !value,
            };
            if (value) {
                this.playStartTime = this.requestAnimationFrameTime;
                this.playFramesAdvanced = 0;
            }
            // hitting play after the animation has finished should reset the
            // playback, even if looping is disabled.
            if (value &&
                !this.playerState.current.loop &&
                this.playback.frame === this.playback.duration) {
                this.requestReset();
            }
        }
    }
    toggleAudio(value = this.playerState.current.muted) {
        if (value === this.playerState.current.muted) {
            this.playerState.current = {
                ...this.playerState.current,
                muted: !value,
            };
        }
    }
    setSpeed(value) {
        if (value !== this.playerState.current.speed) {
            this.playback.speed = value;
            this.playback.reload();
            this.playerState.current = {
                ...this.playerState.current,
                speed: value,
            };
            this.requestRecalculation();
        }
    }
    setVariables(variables) {
        for (const scene of this.playback.onScenesRecalculated.current) {
            scene.variables.updateSignals(variables);
        }
    }
    /**
     * Activate the player.
     *
     * @remarks
     * A player needs to be active in order for the update loop to run. Each
     * player is active by default.
     */
    activate() {
        this.active = true;
        this.request();
    }
    /**
     * Deactivate the player.
     *
     * @remarks
     * Deactivating the player prevents its update loop from running. This should
     * be done before disposing the player, to prevent it from running in the
     * background.
     *
     * Just pausing the player does not stop the loop.
     */
    deactivate() {
        this.active = false;
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }
    requestRecalculation() {
        this.requestedRecalculation = true;
        this.request();
    }
    async prepare() {
        const state = {
            ...this.playerState.current,
            seek: this.requestedSeek,
        };
        this.requestedSeek = -1;
        // Recalculate the project if necessary
        if (this.requestedRecalculation) {
            if (state.seek < 0) {
                state.seek = this.playback.frame;
            }
            try {
                await this.playback.recalculate();
                this.duration.current = this.playback.frame;
                this.recalculated.dispatch();
            }
            catch (e) {
                this.requestSeek(state.seek);
                throw e;
            }
            finally {
                this.requestedRecalculation = false;
            }
        }
        // Pause if reached the end or the range is 0
        if ((!state.loop && this.finished && !state.paused && state.seek < 0) ||
            this.endFrame === this.startFrame) {
            this.togglePlayback(false);
            state.paused = true;
        }
        // Seek to the beginning if looping is enabled
        if (state.loop &&
            (state.seek > this.endFrame || (this.finished && !state.paused)) &&
            this.startFrame !== this.endTime) {
            state.seek = this.startFrame;
        }
        // Pause / play audio.
        const audioPaused = state.paused || this.finished || !this.audio.isInRange(this.status.time);
        if (await this.audio.setPaused(audioPaused)) {
            this.syncAudio(-3);
        }
        this.audio.setMuted(state.muted);
        return state;
    }
    async run(time) {
        const state = await this.prepare();
        const previousState = this.playback.state;
        this.playback.state = state.paused
            ? PlaybackState.Paused
            : PlaybackState.Playing;
        // Seek to the given frame
        if (state.seek >= 0 || !this.isInRange(this.status.frame)) {
            const seekFrame = state.seek < 0 ? this.status.frame : state.seek;
            const clampedFrame = this.clampRange(seekFrame);
            this.logger.profile('seek time');
            await this.playback.seek(clampedFrame);
            this.logger.profile('seek time');
            this.syncAudio(-3);
        }
        // Do nothing if paused or is ahead of the audio.
        else if (state.paused ||
            (state.speed === 1 &&
                this.audio.isReady() &&
                this.audio.isInRange(this.status.time) &&
                this.audio.getTime() < this.status.time)) {
            if (state.paused && previousState !== PlaybackState.Paused) {
                await this.render.dispatch();
            }
            // Sync the audio if the animation is too far ahead.
            if (!state.paused &&
                this.status.time > this.audio.getTime() + MAX_AUDIO_DESYNC) {
                this.syncAudio();
            }
            this.request();
            return;
        }
        // Seek to synchronize animation with audio.
        else if (this.audio.isReady() &&
            state.speed === 1 &&
            this.audio.isInRange(this.status.time) &&
            this.status.framesToSeconds(this.playback.frame + 1) <
                this.audio.getTime() - MAX_AUDIO_DESYNC) {
            const seekFrame = this.status.secondsToFrames(this.audio.getTime());
            await this.playback.seek(seekFrame);
        }
        // Simply move forward one frame
        else if (this.status.frame < this.endFrame) {
            // await this.playback.progress();
            const { fps } = this.playback;
            const mspf = 1000 / fps;
            const timeAdvanced = time - this.playStartTime;
            const framesToAdvance = Math.floor((this.playback.speed * timeAdvanced) / mspf) -
                this.playFramesAdvanced;
            console.log(framesToAdvance, (this.playback.speed * (time - this.renderTime)) / mspf);
            if (framesToAdvance > 0) {
                await this.playback.seek(this.status.frame + framesToAdvance);
                // this.renderTimeDiff = this.renderTime + (framesToAdvance * mspf)
                this.playFramesAdvanced += framesToAdvance;
                this.renderTime = time;
                if (state.speed !== 1) {
                    this.syncAudio();
                }
            }
        }
        // Pause if a new slide has just started.
        if (!state.paused && this.playback.currentScene.slides.isWaiting()) {
            this.togglePlayback(false);
            state.paused = true;
        }
        // Draw the project
        await this.render.dispatch();
        this.frame.current = this.playback.frame;
        this.request();
    }
    request() {
        if (!this.active)
            return;
        this.requestId ?? (this.requestId = requestAnimationFrame(async (time) => {
            this.requestAnimationFrameTime = time;
            this.requestId = null;
            // if (time - this.renderTime >= 1000 / (this.status.fps + 5)) {
            // this.renderTime = time;
            await this.lock.acquire();
            try {
                await this.run(time);
            }
            catch (e) {
                this.logger.error(e);
            }
            this.lock.release();
            // } else {
            this.request();
            // }
        }));
    }
    clampRange(frame) {
        return clamp(this.startFrame, this.endFrame, frame);
    }
    isInRange(frame) {
        return frame >= this.startFrame && frame <= this.endFrame;
    }
    syncAudio(frameOffset = 0) {
        this.audio.setTime(this.status.framesToSeconds(this.playback.frame + frameOffset));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9QbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFbEMsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixlQUFlLEVBQ2YsZUFBZSxHQUNoQixNQUFNLFdBQVcsQ0FBQztBQUVuQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBaUJ4RCxNQUFNLGdCQUFnQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFaEM7Ozs7Ozs7R0FPRztBQUNILE1BQU0sT0FBTyxNQUFNO0lBQ2pCOzs7Ozs7Ozs7O09BVUc7SUFDSCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUNsQyxDQUFDO0lBR0QsSUFBVyxjQUFjO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUdELElBQVcsY0FBYztRQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ2pDLENBQUM7SUFHRCxJQUFXLGlCQUFpQjtRQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ3BDLENBQUM7SUFHRDs7Ozs7OztPQU9HO0lBQ0gsSUFBVyxjQUFjO1FBQ3ZCLE9BQU8sSUFBSSxDQUFD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