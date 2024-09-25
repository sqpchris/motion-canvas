var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BBox, } from '@motion-canvas/core/lib/types';
import { Shape } from './Shape';
import { drawRoundRect } from '../utils';
import { initial, signal } from '../decorators';
import { spacingSignal } from '../decorators/spacingSignal';
export class Rect extends Shape {
    constructor(props) {
        super(props);
    }
    getPath() {
        const path = new Path2D();
        const radius = this.radius();
        const smoothCorners = this.smoothCorners();
        const cornerSharpness = this.cornerSharpness();
        const box = BBox.fromSizeCentered(this.size());
        drawRoundRect(path, box, radius, smoothCorners, cornerSharpness);
        return path;
    }
    getCacheBBox() {
        return super.getCacheBBox().expand(this.rippleSize());
    }
    getRipplePath() {
        const path = new Path2D();
        const rippleSize = this.rippleSize();
        const radius = this.radius().addScalar(rippleSize);
        const smoothCorners = this.smoothCorners();
        const cornerSharpness = this.cornerSharpness();
        const box = BBox.fromSizeCentered(this.size()).expand(rippleSize);
        drawRoundRect(path, box, radius, smoothCorners, cornerSharpness);
        return path;
    }
}
__decorate([
    spacingSignal('radius')
], Rect.prototype, "radius", void 0);
__decorate([
    initial(false),
    signal()
], Rect.prototype, "smoothCorners", void 0);
__decorate([
    initial(0.6),
    signal()
], Rect.prototype, "cornerSharpness", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1JlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUVMLElBQUksR0FFTCxNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxTQUFTLENBQUM7QUFDMUMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFpQjFELE1BQU0sT0FBTyxJQUFLLFNBQVEsS0FBSztJQWlEN0IsWUFBbUIsS0FBZ0I7UUFDakMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVrQixPQUFPO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzdCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQyxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFakUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRWtCLFlBQVk7UUFDN0IsT0FBTyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFa0IsYUFBYTtRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQyxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRSxhQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRWpFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBN0VDO0lBREMsYUFBYSxDQUFDLFFBQVEsQ0FBQztvQ0FDNEI7QUF1QnBEO0lBRkMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNkLE1BQU0sRUFBRTsyQ0FDMEQ7QUFzQm5FO0lBRkMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUNaLE1BQU0sRUFBRTs2Q0FDMkQifQ==