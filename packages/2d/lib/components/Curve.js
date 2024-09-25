var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { clamp } from '@motion-canvas/core/lib/tweening';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { getPointAtDistance, } from '../curves';
import { computed, initial, signal } from '../decorators';
import { lineTo, moveTo, resolveCanvasStyle } from '../utils';
import { Shape } from './Shape';
export class Curve extends Shape {
    desiredSize() {
        return this.childrenBBox().size;
    }
    constructor(props) {
        super(props);
    }
    /**
     * Convert a percentage along the curve to a distance.
     *
     * @remarks
     * The returned distance is given in relation to the full curve, not
     * accounting for {@link startOffset} and {@link endOffset}.
     *
     * @param value - The percentage along the curve.
     */
    percentageToDistance(value) {
        return clamp(0, this.baseArcLength(), this.startOffset() + this.offsetArcLength() * value);
    }
    /**
     * Convert a distance along the curve to a percentage.
     *
     * @remarks
     * The distance should be given in relation to the full curve, not
     * accounting for {@link startOffset} and {@link endOffset}.
     *
     * @param value - The distance along the curve.
     */
    distanceToPercentage(value) {
        return (value - this.startOffset()) / this.offsetArcLength();
    }
    /**
     * The base arc length of this curve.
     *
     * @remarks
     * This is the entire length of this curve, not accounting for
     * {@link startOffset | the offsets}.
     */
    baseArcLength() {
        return this.profile().arcLength;
    }
    /**
     * The offset arc length of this curve.
     *
     * @remarks
     * This is the length of the curve that accounts for
     * {@link startOffset | the offsets}.
     */
    offsetArcLength() {
        const startOffset = this.startOffset();
        const endOffset = this.endOffset();
        const baseLength = this.baseArcLength();
        return clamp(0, baseLength, baseLength - startOffset - endOffset);
    }
    /**
     * The visible arc length of this curve.
     *
     * @remarks
     * This arc length accounts for both the offset and the {@link start} and
     * {@link end} properties.
     */
    arcLength() {
        return this.offsetArcLength() * Math.abs(this.start() - this.end());
    }
    /**
     * The percentage of the curve that's currently visible.
     *
     * @remarks
     * The returned value is the ratio between the visible length (as defined by
     * {@link start} and {@link end}) and the offset length of the curve.
     */
    completion() {
        return Math.abs(this.start() - this.end());
    }
    curveDrawingInfo() {
        const path = new Path2D();
        const profile = this.profile();
        let start = this.percentageToDistance(this.start());
        let end = this.percentageToDistance(this.end());
        if (start > end) {
            [start, end] = [end, start];
        }
        const distance = end - start;
        const arrowSize = Math.min(distance / 2, this.arrowSize());
        if (this.startArrow()) {
            start += arrowSize / 2;
        }
        if (this.endArrow()) {
            end -= arrowSize / 2;
        }
        let length = 0;
        let startPoint = null;
        let startTangent = null;
        let endPoint = null;
        let endTangent = null;
        for (const segment of profile.segments) {
            const previousLength = length;
            length += segment.arcLength;
            if (length < start) {
                continue;
            }
            const relativeStart = (start - previousLength) / segment.arcLength;
            const relativeEnd = (end - previousLength) / segment.arcLength;
            const clampedStart = clamp(0, 1, relativeStart);
            const clampedEnd = clamp(0, 1, relativeEnd);
            const [startCurvePoint, endCurvePoint] = segment.draw(path, clampedStart, clampedEnd, startPoint === null);
            if (startPoint === null) {
                startPoint = startCurvePoint.position;
                startTangent = startCurvePoint.normal.flipped.perpendicular;
            }
            endPoint = endCurvePoint.position;
            endTangent = endCurvePoint.normal.flipped.perpendicular;
            if (length > end) {
                break;
            }
        }
        if (this.end() === 1 && this.closed()) {
            path.closePath();
        }
        return {
            startPoint: startPoint ?? Vector2.zero,
            startTangent: startTangent ?? Vector2.right,
            endPoint: endPoint ?? Vector2.zero,
            endTangent: endTangent ?? Vector2.right,
            arrowSize,
            path,
            startOffset: start,
        };
    }
    getPointAtDistance(value) {
        return getPointAtDistance(this.profile(), value + this.startOffset());
    }
    getPointAtPercentage(value) {
        return getPointAtDistance(this.profile(), this.percentageToDistance(value));
    }
    applyStyle(context) {
        super.applyStyle(context);
        const { arcLength } = this.profile();
        context.lineDashOffset -= arcLength / 2;
    }
    getComputedLayout() {
        return this.offsetComputedLayout(super.getComputedLayout());
    }
    offsetComputedLayout(box) {
        box.position = box.position.sub(this.childrenBBox().center);
        return box;
    }
    getPath() {
        return this.curveDrawingInfo().path;
    }
    getCacheBBox() {
        const box = this.childrenBBox();
        const arrowSize = this.arrowSize();
        const lineWidth = this.lineWidth();
        const coefficient = this.lineWidthCoefficient();
        return box.expand(Math.max(0, arrowSize, lineWidth * coefficient));
    }
    lineWidthCoefficient() {
        return this.lineCap() === 'square' ? 0.5 * 1.4143 : 0.5;
    }
    drawShape(context) {
        super.drawShape(context);
        const { startPoint, startTangent, endPoint, endTangent, arrowSize } = this.curveDrawingInfo();
        if (arrowSize < 0.001) {
            return;
        }
        context.save();
        context.beginPath();
        if (this.endArrow()) {
            this.drawArrow(context, endPoint, endTangent.flipped, arrowSize);
        }
        if (this.startArrow()) {
            this.drawArrow(context, startPoint, startTangent, arrowSize);
        }
        context.fillStyle = resolveCanvasStyle(this.stroke(), context);
        context.closePath();
        context.fill();
        context.restore();
    }
    drawArrow(context, center, tangent, arrowSize) {
        const normal = tangent.perpendicular;
        const origin = center.add(tangent.scale(-arrowSize / 2));
        moveTo(context, origin);
        lineTo(context, origin.add(tangent.add(normal).scale(arrowSize)));
        lineTo(context, origin.add(tangent.sub(normal).scale(arrowSize)));
        lineTo(context, origin);
        context.closePath();
    }
}
__decorate([
    initial(false),
    signal()
], Curve.prototype, "closed", void 0);
__decorate([
    initial(0),
    signal()
], Curve.prototype, "start", void 0);
__decorate([
    initial(0),
    signal()
], Curve.prototype, "startOffset", void 0);
__decorate([
    initial(false),
    signal()
], Curve.prototype, "startArrow", void 0);
__decorate([
    initial(1),
    signal()
], Curve.prototype, "end", void 0);
__decorate([
    initial(0),
    signal()
], Curve.prototype, "endOffset", void 0);
__decorate([
    initial(false),
    signal()
], Curve.prototype, "endArrow", void 0);
__decorate([
    initial(24),
    signal()
], Curve.prototype, "arrowSize", void 0);
__decorate([
    computed()
], Curve.prototype, "arcLength", null);
__decorate([
    computed()
], Curve.prototype, "curveDrawingInfo", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VydmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tcG9uZW50cy9DdXJ2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDdkQsT0FBTyxFQUEwQixPQUFPLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMvRSxPQUFPLEVBSUwsa0JBQWtCLEdBQ25CLE1BQU0sV0FBVyxDQUFDO0FBQ25CLE9BQU8sRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4RCxPQUFPLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsS0FBSyxFQUFhLE1BQU0sU0FBUyxDQUFDO0FBcUMxQyxNQUFNLE9BQWdCLEtBQU0sU0FBUSxLQUFLO0lBMEdwQixXQUFXO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRUQsWUFBbUIsS0FBaUI7UUFDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQU1EOzs7Ozs7OztPQVFHO0lBQ0ksb0JBQW9CLENBQUMsS0FBYTtRQUN2QyxPQUFPLEtBQUssQ0FDVixDQUFDLEVBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEtBQUssQ0FDcEQsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLG9CQUFvQixDQUFDLEtBQWE7UUFDdkMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGFB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