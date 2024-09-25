var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
import { computed, initial, signal } from '../decorators';
import { Color, BBox, Vector2, } from '@motion-canvas/core/lib/types';
import { drawImage } from '../utils';
import { Rect } from './Rect';
import { DependencyContext, } from '@motion-canvas/core/lib/signals';
import { viaProxy } from '@motion-canvas/core/lib/utils';
/**
 * A node for displaying images.
 *
 * @preview
 * ```tsx editor
 * import {Img} from '@motion-canvas/2d/lib/components';
 * import {all, waitFor} from '@motion-canvas/core/lib/flow';
 * import {createRef} from '@motion-canvas/core/lib/utils';
 * import {makeScene2D} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   const ref = createRef<Img>();
 *   view.add(
 *     <Img
 *       ref={ref}
 *       src="https://images.unsplash.com/photo-1679218407381-a6f1660d60e9"
 *       width={300}
 *       radius={20}
 *       clip
 *     />,
 *   );
 *
 *   // set the background using the color sampled from the image:
 *   ref().fill(ref().getColorAtPoint(0));
 *
 *   yield* all(
 *     ref().size([100, 100], 1).to([300, null], 1),
 *     ref().radius(50, 1).to(20, 1),
 *     ref().alpha(0, 1).to(1, 1),
 *   );
 *   yield* waitFor(0.5);
 * });
 * ```
 */
export class Img extends Rect {
    constructor(props) {
        super(props);
    }
    desiredSize() {
        const custom = super.desiredSize();
        if (custom.x === null && custom.y === null) {
            const image = this.image();
            return {
                x: image.naturalWidth,
                y: image.naturalHeight,
            };
        }
        return custom;
    }
    image() {
        const src = viaProxy(this.src());
        const url = new URL(src, window.location.origin);
        if (url.origin === window.location.origin) {
            const hash = this.view().assetHash();
            url.searchParams.set('asset-hash', hash);
        }
        let image = Img.pool[src];
        if (!image) {
            image = document.createElement('img');
            image.crossOrigin = 'anonymous';
            image.src = url.toString();
            Img.pool[src] = image;
        }
        if (!image.complete) {
            DependencyContext.collectPromise(new Promise((resolve, reject) => {
                image.addEventListener('load', resolve);
                image.addEventListener('error', reject);
            }));
        }
        return image;
    }
    imageCanvas() {
        const canvas = document
            .createElement('canvas')
            .getContext('2d', { willReadFrequently: true });
        if (!canvas) {
            throw new Error('Could not create an image canvas');
        }
        return canvas;
    }
    filledImageCanvas() {
        const context = this.imageCanvas();
        const image = this.image();
        context.canvas.width = image.naturalWidth;
        context.canvas.height = image.naturalHeight;
        context.imageSmoothingEnabled = this.smoothing();
        context.drawImage(image, 0, 0);
        return context;
    }
    draw(context) {
        this.drawShape(context);
        if (this.clip()) {
            context.clip(this.getPath());
        }
        const alpha = this.alpha();
        if (alpha > 0) {
            const box = BBox.fromSizeCentered(this.computedSize());
            context.save();
            if (alpha < 1) {
                context.globalAlpha *= alpha;
            }
            context.imageSmoothingEnabled = this.smoothing();
            drawImage(context, this.image(), box);
            context.restore();
        }
        this.drawChildren(context);
    }
    applyFlex() {
        super.applyFlex();
        const image = this.image();
        this.element.style.aspectRatio = (this.ratio() ?? image.naturalWidth / image.naturalHeight).toString();
    }
    /**
     * Get color of the image at the given position.
     *
     * @param position - The position in local space at which to sample the color.
     */
    getColorAtPoint(position) {
        const size = this.computedSize();
        const naturalSize = this.naturalSize();
        const pixelPosition = new Vector2(position)
            .add(this.computedSize().scale(0.5))
            .mul(naturalSize.div(size).safe);
        return this.getPixelColor(pixelPosition);
    }
    /**
     * The natural size of this image.
     *
     * @remarks
     * The natural size is the size of the source image unaffected by the size
     * and scale properties.
     */
    naturalSize() {
        const image = this.image();
        return new Vector2(image.naturalWidth, image.naturalHeight);
    }
    /**
     * Get color of the image at the given pixel.
     *
     * @param position - The pixel's position.
     */
    getPixelColor(position) {
        const context = this.filledImageCanvas();
        const vector = new Vector2(position);
        const data = context.getImageData(vector.x, vector.y, 1, 1).data;
        return new Color({
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3] / 255,
        });
    }
    collectAsyncResources() {
        super.collectAsyncResources();
        this.image();
    }
}
_a = Img;
Img.pool = {};
(() => {
    if (import.meta.hot) {
        import.meta.hot.on('motion-canvas:assets', ({ urls }) => {
            for (const url of urls) {
                if (_a.pool[url]) {
                    delete _a.pool[url];
                }
            }
        });
    }
})();
__decorate([
    signal()
], Img.prototype, "src", void 0);
__decorate([
    initial(1),
    signal()
], Img.prototype, "alpha", void 0);
__decorate([
    initial(true),
    signal()
], Img.prototype, "smoothing", void 0);
__decorate([
    computed()
], Img.prototype, "image", null);
__decorate([
    computed()
], Img.prototype, "imageCanvas", null);
__decorate([
    computed()
], Img.prototype, "filledImageCanvas", null);
__decorate([
    computed()
], Img.prototype, "naturalSize", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvSW1nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUNMLEtBQUssRUFFTCxJQUFJLEVBRUosT0FBTyxHQUNSLE1BQU0sK0JBQStCLENBQUM7QUFDdkMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsSUFBSSxFQUFZLE1BQU0sUUFBUSxDQUFDO0FBRXZDLE9BQU8sRUFDTCxpQkFBaUIsR0FHbEIsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFpQnZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQ0c7QUFDSCxNQUFNLE9BQU8sR0FBSSxTQUFRLElBQUk7SUF5RDNCLFlBQW1CLEtBQWU7UUFDaEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVrQixXQUFXO1FBQzVCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQixPQUFPO2dCQUNMLENBQUMsRUFBRSxLQUFLLENBQUMsWUFBWTtnQkFDckIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxhQUFhO2FBQ3ZCLENBQUM7U0FDSDtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFHUyxLQUFLO1FBQ2IsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUs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