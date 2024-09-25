import { getContext } from '../utils';
import { Vector2 } from '../types';
/**
 * Manages canvases on which an animation can be displayed.
 */
export class Stage {
    get canvasSize() {
        return this.size.scale(this.resolutionScale);
    }
    constructor() {
        // TODO Consider adding pooling for canvases.
        this.background = null;
        this.resolutionScale = 1;
        this.colorSpace = 'srgb';
        this.size = Vector2.zero;
        this.finalBuffer = document.createElement('canvas');
        this.currentBuffer = document.createElement('canvas');
        this.previousBuffer = document.createElement('canvas');
        const colorSpace = this.colorSpace;
        this.context = getContext({ colorSpace }, this.finalBuffer);
        this.currentContext = getContext({ colorSpace }, this.currentBuffer);
        this.previousContext = getContext({ colorSpace }, this.previousBuffer);
    }
    configure({ colorSpace = this.colorSpace, size = this.size, resolutionScale = this.resolutionScale, background = this.background, }) {
        if (colorSpace !== this.colorSpace) {
            this.colorSpace = colorSpace;
            this.context = getContext({ colorSpace }, this.finalBuffer);
            this.currentContext = getContext({ colorSpace }, this.currentBuffer);
            this.previousContext = getContext({ colorSpace }, this.previousBuffer);
        }
        if (!size.exactlyEquals(this.size) ||
            resolutionScale !== this.resolutionScale) {
            this.resolutionScale = resolutionScale;
            this.size = size;
            this.resizeCanvas(this.context);
            this.resizeCanvas(this.currentContext);
            this.resizeCanvas(this.previousContext);
        }
        this.background =
            typeof background === 'string'
                ? background
                : background?.serialize() ?? null;
    }
    async render(currentScene, previousScene) {
        if (previousScene) {
            this.transformCanvas(this.previousContext);
            await previousScene.render(this.previousContext);
        }
        this.transformCanvas(this.currentContext);
        await currentScene.render(this.currentContext);
        const size = this.canvasSize;
        this.context.clearRect(0, 0, size.width, size.height);
        if (this.background) {
            this.context.save();
            this.context.fillStyle = this.background;
            this.context.fillRect(0, 0, size.width, size.height);
            this.context.restore();
        }
        if (previousScene) {
            this.context.drawImage(this.previousBuffer, 0, 0);
        }
        this.context.drawImage(this.currentBuffer, 0, 0);
    }
    transformCanvas(context) {
        const offset = this.canvasSize.scale(0.5);
        context.setTransform(this.resolutionScale, 0, 0, this.resolutionScale, offset.x, offset.y);
    }
    resizeCanvas(context) {
        const size = this.canvasSize;
        context.canvas.width = size.width;
        context.canvas.height = size.height;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwL1N0YWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFcEMsT0FBTyxFQUFtQixPQUFPLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFVbkQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sS0FBSztJQWdCaEIsSUFBWSxVQUFVO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDtRQW5CQSw2Q0FBNkM7UUFFckMsZUFBVSxHQUFrQixJQUFJLENBQUM7UUFDakMsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFDcEIsZUFBVSxHQUFxQixNQUFNLENBQUM7UUFDdEMsU0FBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFlMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxFQUFDLFVBQVUsRUFBQyxFQUFFLElBQUksQ0FB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