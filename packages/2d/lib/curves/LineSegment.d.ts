import { Vector2 } from '@motion-canvas/core/lib/types';
import { Segment } from './Segment';
import { CurvePoint } from './CurvePoint';
export declare class LineSegment extends Segment {
    private from;
    private to;
    private readonly length;
    private readonly vector;
    private readonly normal;
    constructor(from: Vector2, to: Vector2);
    get arcLength(): number;
    draw(context: CanvasRenderingContext2D | Path2D, start?: number, end?: number, move?: boolean): [CurvePoint, CurvePoint];
    getPoint(distance: number): CurvePoint;
}
//# sourceMappingURL=LineSegment.d.ts.map