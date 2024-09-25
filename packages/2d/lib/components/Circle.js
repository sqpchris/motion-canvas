var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Shape } from './Shape';
import { initial, signal } from '../decorators';
import { DEG2RAD } from '@motion-canvas/core/lib/utils';
/**
 * A node for drawing circular shapes.
 *
 * @remarks
 * This node can be used to render shapes such as: circle, ellipse, arc, and
 * sector (pie chart).
 *
 * @preview
 * ```tsx editor
 * // snippet Simple circle
 * import {makeScene2D, Circle} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   view.add(
 *     <Circle
 *       size={160}
 *       fill={'lightseagreen'}
 *     />
 *    );
 * });
 *
 * // snippet Ellipse
 * import {makeScene2D, Circle} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   view.add(
 *     <Circle
 *       width={160}
 *       height={80}
 *       fill={'lightseagreen'}
 *     />
 *   );
 * });
 *
 * // snippet Sector (pie chart):
 * import {makeScene2D, Circle} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const ref = createRef<Circle>();
 *   view.add(
 *     <Circle
 *       ref={ref}
 *       size={160}
 *       fill={'lightseagreen'}
 *       startAngle={30}
 *       endAngle={270}
 *       closed={true}
 *     />
 *   );
 *
 *   yield* ref().startAngle(270, 2).to(30, 2);
 * });
 *
 * // snippet Arc:
 * import {makeScene2D, Circle} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const ref = createRef<Circle>();
 *   view.add(
 *     <Circle
 *       ref={ref}
 *       size={160}
 *       stroke={'lightseagreen'}
 *       lineWidth={8}
 *       startAngle={-90}
 *       endAngle={90}
 *     />
 *   );
 *
 *   yield* ref().startAngle(-270, 2).to(-90, 2);
 * });
 * ```
 */
export class Circle extends Shape {
    constructor(props) {
        super(props);
    }
    getPath() {
        return this.createPath();
    }
    getRipplePath() {
        return this.createPath(this.rippleSize());
    }
    createPath(expand = 0) {
        const path = new Path2D();
        const start = this.startAngle() * DEG2RAD;
        const end = this.endAngle() * DEG2RAD;
        const size = this.size().scale(0.5);
        const closed = this.closed();
        if (closed) {
            path.moveTo(0, 0);
        }
        path.ellipse(0, 0, size.x + expand, size.y + expand, 0, start, end);
        if (closed) {
            path.closePath();
        }
        return path;
    }
}
__decorate([
    initial(0),
    signal()
], Circle.prototype, "startAngle", void 0);
__decorate([
    initial(360),
    signal()
], Circle.prototype, "endAngle", void 0);
__decorate([
    initial(false),
    signal()
], Circle.prototype, "closed", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2lyY2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvQ2lyY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxTQUFTLENBQUM7QUFFMUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBaUJ0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwRUc7QUFDSCxNQUFNLE9BQU8sTUFBTyxTQUFRLEtBQUs7SUE2RC9CLFlBQW1CLEtBQWtCO1FBQ25DLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFa0IsT0FBTztRQUN4QixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRWtCLGFBQWE7UUFDOUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFUyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDN0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0IsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuQjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BFLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUE3RUM7SUFGQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1YsTUFBTSxFQUFFOzBDQUNzRDtBQWEvRDtJQUZDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDWixNQUFNLEVBQUU7d0NBQ29EO0FBa0M3RDtJQUZDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDZCxNQUFNLEVBQUU7c0NBQ21EIn0=