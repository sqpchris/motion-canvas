import { PossibleSpacing, BBox, SpacingSignal } from '@motion-canvas/core/lib/types';
import { Shape, ShapeProps } from './Shape';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
export interface RectProps extends ShapeProps {
    radius?: SignalValue<PossibleSpacing>;
    /**
     * {@inheritDoc Rect.smoothCorners}
     */
    smoothCorners?: SignalValue<boolean>;
    /**
     * {@inheritDoc Rect.cornerSharpness}
     */
    cornerSharpness?: SignalValue<number>;
}
export declare class Rect extends Shape {
    readonly radius: SpacingSignal<this>;
    /**
     * Will set the corner drawing method to smooth corners.
     *
     * @remarks
     * Smooth corners are drawn continuously by a bezìer curves, rather than by a
     * quarter circle.
     *
     * When `smoothCorners` is set to `true`, the sharpness of the curve can be
     * controlled by the {@link Rect.cornerSharpness}.
     *
     * @example
     * ```tsx
     * <Rect
     *   width={300}
     *   height={300}
     *   smoothCorners={true}
     * />
     * ```
     */
    readonly smoothCorners: SimpleSignal<boolean, this>;
    /**
     * Controls the sharpness of the corners. {@link Rect.smoothCorners} must
     * be set to `true`.
     *
     * @remarks
     * By default the `cornerSharpness` is set to `0.6` which represents smooth,
     * circle-like rounding. At `0` the edges are squared off.
     *
     * @example
     * ```tsx
     * <Rect
     *   width={300}
     *   height={300}
     *   smoothCorners={true}
     *   cornerSharpness={0.7}
     * />
     * ```
     */
    readonly cornerSharpness: SimpleSignal<number, this>;
    constructor(props: RectProps);
    protected getPath(): Path2D;
    protected getCacheBBox(): BBox;
    protected getRipplePath(): Path2D;
}
//# sourceMappingURL=Rect.d.ts.map