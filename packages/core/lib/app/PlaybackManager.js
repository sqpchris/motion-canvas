import { ValueDispatcher } from '../events';
export var PlaybackState;
(function (PlaybackState) {
    PlaybackState[PlaybackState["Playing"] = 0] = "Playing";
    PlaybackState[PlaybackState["Rendering"] = 1] = "Rendering";
    PlaybackState[PlaybackState["Paused"] = 2] = "Paused";
    PlaybackState[PlaybackState["Presenting"] = 3] = "Presenting";
})(PlaybackState || (PlaybackState = {}));
/**
 * A general class for managing a sequence of scenes.
 *
 * @remarks
 * This class provides primitive operations that can be executed on a scene
 * sequence, such as {@link progress} or {@link seek}.
 *
 * @internal
 */
export class PlaybackManager {
    constructor() {
        this.frame = 0;
        this.speed = 1;
        this.fps = 30;
        this.duration = 0;
        this.finished = false;
        this.slides = [];
        this.previousScene = null;
        this.state = PlaybackState.Paused;
        this.currentSceneReference = null;
        this.scenes = new ValueDispatcher([]);
    }
    /**
     * Triggered when the active scene changes.
     *
     * @eventProperty
     */
    get onSceneChanged() {
        if (this.currentSceneReference === null) {
            throw new Error('PlaybackManager has not been properly initialized');
        }
        return this.currentSceneReference.subscribable;
    }
    /**
     * Triggered when the scenes get recalculated.
     *
     * @remarks
     * This event indicates that the timing of at least one scene has changed.
     *
     * @eventProperty
     */
    get onScenesRecalculated() {
        return this.scenes.subscribable;
    }
    get currentScene() {
        if (this.currentSceneReference === null) {
            throw new Error('PlaybackManager has not been properly initialized');
        }
        return this.currentSceneReference.current;
    }
    set currentScene(scene) {
        if (!scene) {
            throw new Error('Invalid scene.');
        }
        this.currentSceneReference ?? (this.currentSceneReference = new ValueDispatcher(scene));
        this.currentSceneReference.current = scene;
    }
    setup(scenes) {
        this.scenes.current = scenes;
        this.currentScene = scenes[0];
    }
    async progress() {
        this.finished = await this.next();
        return this.finished;
    }
    async seek(frame) {
        if (frame <= this.frame ||
            (this.currentScene.isCached() && this.currentScene.lastFrame < frame)) {
            const scene = this.findBestScene(frame);
            if (scene !== this.currentScene) {
                this.previousScene = null;
                this.currentScene = scene;
                this.frame = this.currentScene.firstFrame;
                await this.currentScene.reset();
            }
            else if (this.frame >= frame) {
                this.previousScene = null;
                this.frame = this.currentScene.firstFrame;
                await this.currentScene.reset();
            }
        }
        this.finished = false;
        while (this.frame < frame && !this.finished) {
            this.finished = await this.next();
        }
        return this.finished;
    }
    async goBack() {
        let target = this.currentScene.slides.getCurrent();
        if (target && this.currentScene.slides.isWaiting()) {
            const index = this.slides.indexOf(target);
            target = this.slides[index - 1];
        }
        await this.seekSlide(target);
    }
    async goForward() {
        const current = this.currentScene.slides.getCurrent();
        const index = this.slides.indexOf(current);
        await this.seekSlide(this.slides[index + 1]);
    }
    async goTo(slideId) {
        await this.seekSlide(this.slides.find(slide => slide.id === slideId));
    }
    async seekSlide(slide = null) {
        if (!slide)
            return;
        const { id, scene } = slide;
        if (this.currentScene !== scene || this.currentScene.slides.didHappen(id)) {
            this.previousScene = null;
            this.currentScene = scene;
            this.frame = this.currentScene.firstFrame;
            this.currentScene.slides.setTarget(id);
            await this.currentScene.reset();
        }
        this.finished = false;
        this.currentScene.slides.setTarget(id);
        while (!this.currentScene.slides.isWaitingFor(id) && !this.finished) {
            this.finished = await this.next();
        }
        this.currentScene.slides.setTarget(null);
        return this.finished;
    }
    async reset() {
        this.previousScene = null;
        this.currentScene = this.scenes.current[0];
        this.frame = 0;
        await this.currentScene.reset();
    }
    reload(description) {
        this.scenes.current.forEach(scene => scene.reload(description));
    }
    async recalculate() {
        this.previousScene = null;
        this.slides = [];
        const speed = this.speed;
        this.frame = 0;
        this.speed = 1;
        const scenes = [];
        try {
            for (const scene of this.scenes.current) {
                await scene.recalculate(frame => {
                    this.frame = frame;
                });
                this.slides.push(...scene.slides.onChanged.current);
                scenes.push(scene);
            }
        }
        finally {
            this.speed = speed;
        }
        this.scenes.current = scenes;
        this.duration = this.frame;
    }
    async next() {
        if (this.previousScene) {
            await this.previousScene.next();
            if (this.currentScene.isFinished()) {
                this.previousScene = null;
            }
        }
        this.frame += this.speed;
        if (this.currentScene.isFinished()) {
            return true;
        }
        await this.currentScene.next();
        if (this.previousScene && this.currentScene.isAfterTransitionIn()) {
            this.previousScene = null;
        }
        if (this.currentScene.canTransitionOut()) {
            this.previousScene = this.currentScene;
            const nextScene = this.getNextScene(this.previousScene);
            if (nextScene) {
                this.currentScene = nextScene;
                await this.currentScene.reset(this.previousScene);
            }
            if (!nextScene || this.currentScene.isAfterTransitionIn()) {
                this.previousScene = null;
            }
        }
        return this.currentScene.isFinished();
    }
    findBestScene(frame) {
        let lastScene = this.scenes.current[0];
        for (const scene of this.scenes.current) {
            if (!scene.isCached() || scene.lastFrame > frame) {
                return scene;
            }
            lastScene = scene;
        }
        return lastScene;
    }
    getNextScene(scene) {
        const scenes = this.scenes.current;
        if (!scene) {
            return scenes[0];
        }
        const index = scenes.findIndex(s => s === scene);
        if (index < 0) {
            return null;
        }
        return scenes[index + 1] ?? null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWJhY2tNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC9QbGF5YmFja01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUUxQyxNQUFNLENBQU4sSUFBWSxhQUtYO0FBTEQsV0FBWSxhQUFhO0lBQ3ZCLHVEQUFPLENBQUE7SUFDUCwyREFBUyxDQUFBO0lBQ1QscURBQU0sQ0FBQTtJQUNOLDZEQUFVLENBQUE7QUFDWixDQUFDLEVBTFcsYUFBYSxLQUFiLGFBQWEsUUFLeEI7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBQTVCO1FBeUJTLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDVixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsUUFBRyxHQUFHLEVBQUUsQ0FBQztRQUNULGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLFdBQU0sR0FBWSxFQUFFLENBQUM7UUFFckIsa0JBQWEsR0FBaUIsSUFBSSxDQUFDO1FBQ25DLFVBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBaUI1QiwwQkFBcUIsR0FBa0MsSUFBSSxDQUFDO1FBQzVELFdBQU0sR0FBRyxJQUFJLGVBQWUsQ0FBVSxFQUFFLENBQUMsQ0FBQztJQStLcEQsQ0FBQztJQWpPQzs7OztPQUlHO0lBQ0gsSUFBVyxjQUFjO1FBQ3ZCLElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLElBQUksRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7U0FDdEU7UUFDRCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFXLG9CQUFvQjtRQUM3QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxD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