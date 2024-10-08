import { PlaybackState } from '../app/PlaybackManager';
import { ValueDispatcher } from '../events';
export class Slides {
    get onChanged() {
        return this.slides.subscribable;
    }
    constructor(scene) {
        this.scene = scene;
        this.slides = new ValueDispatcher([]);
        this.lookup = new Map();
        this.collisionLookup = new Set();
        this.current = null;
        this.canResume = false;
        this.waitsForId = null;
        this.targetId = null;
        this.handleReload = () => {
            this.lookup.clear();
            this.collisionLookup.clear();
            this.current = null;
            this.waitsForId = null;
            this.targetId = null;
        };
        this.handleReset = () => {
            this.collisionLookup.clear();
            this.current = null;
            this.waitsForId = null;
        };
        this.handleRecalculated = () => {
            this.slides.current = [...this.lookup.values()];
        };
        this.scene.onReloaded.subscribe(this.handleReload);
        this.scene.onReset.subscribe(this.handleReset);
        this.scene.onRecalculated.subscribe(this.handleRecalculated);
    }
    setTarget(target) {
        this.targetId = target;
    }
    resume() {
        this.canResume = true;
    }
    isWaitingFor(slide) {
        return this.waitsForId === slide;
    }
    isWaiting() {
        return this.waitsForId !== null;
    }
    didHappen(slide) {
        if (this.current === null) {
            return false;
        }
        for (const key of this.lookup.keys()) {
            if (key === slide) {
                return true;
            }
            if (key === this.current?.id) {
                return false;
            }
        }
        return false;
    }
    getCurrent() {
        return this.current;
    }
    register(name, initialTime) {
        if (this.waitsForId !== null) {
            throw new Error(`The animation already waits for a slide: ${this.waitsForId}.`);
        }
        const id = this.toId(name);
        if (this.scene.playback.state !== PlaybackState.Presenting) {
            if (!this.lookup.has(id)) {
                this.lookup.set(id, {
                    id,
                    name,
                    time: initialTime,
                    scene: this.scene,
                    stack: new Error().stack,
                });
            }
            if (this.collisionLookup.has(name)) {
                this.scene.logger.warn({
                    message: `A slide named "${name}" already exists.`,
                    stack: new Error().stack,
                });
            }
            else {
                this.collisionLookup.add(name);
            }
        }
        this.waitsForId = id;
        this.current = this.lookup.get(id) ?? null;
        this.canResume = false;
    }
    shouldWait(name) {
        const id = this.toId(name);
        if (this.waitsForId !== id) {
            throw new Error(`The animation waits for a different slide: ${this.waitsForId}.`);
        }
        const data = this.lookup.get(id);
        if (!data) {
            throw new Error(`Could not find the "${name}" slide.`);
        }
        let canResume = this.canResume;
        if (this.scene.playback.state !== PlaybackState.Presenting) {
            canResume = id !== this.targetId;
        }
        if (canResume) {
            this.waitsForId = null;
        }
        return !canResume;
    }
    toId(name) {
        return `${this.scene.name}:${name}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2xpZGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjZW5lcy9TbGlkZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFVMUMsTUFBTSxPQUFPLE1BQU07SUFDakIsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDbEMsQ0FBQztJQVVELFlBQW9DLEtBQVk7UUFBWixVQUFLLEdBQUwsS0FBSyxDQUFPO1FBVC9CLFdBQU0sR0FBRyxJQUFJLGVBQWUsQ0FBVSxFQUFFLENBQUMsQ0FBQztRQUUxQyxXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7UUFDbEMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQzdDLFlBQU8sR0FBaUIsSUFBSSxDQUFDO1FBQzdCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsZUFBVSxHQUFrQixJQUFJLENBQUM7UUFDakMsYUFBUSxHQUFrQixJQUFJLENBQUM7UUFzRy9CLGlCQUFZLEdBQUcsR0FBRyxFQUFFO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN2QixDQUFDLENBQUM7UUFFTSxnQkFBVyxHQUFHLEdBQUcsRUFBRTtZQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUks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