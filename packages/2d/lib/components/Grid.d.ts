import { Shape, ShapeProps } from './Shape';
import { PossibleVector2, Vector2Signal } from '@motion-canvas/core/lib/types';
import { SignalValue } from '@motion-canvas/core/lib/signals';
export interface GridProps extends ShapeProps {
    spacing?: SignalValue<PossibleVector2>;
}
export declare class Grid extends Shape {
    readonly spacing: Vector2Signal<this>;
    constructor(props: GridProps);
    protected drawShape(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Grid.d.ts.map