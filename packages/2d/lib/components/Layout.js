var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { addInitializer, cloneable, computed, defaultStyle, getPropertyMeta, initial, signal, vector2Signal, } from '../decorators';
import { Origin, originToOffset, BBox, Vector2, } from '@motion-canvas/core/lib/types';
import { tween, } from '@motion-canvas/core/lib/tweening';
import { threadable } from '@motion-canvas/core/lib/decorators';
import { Node } from './Node';
import { drawLine, drawPivot } from '../utils';
import { spacingSignal } from '../decorators/spacingSignal';
import { modify, } from '@motion-canvas/core/lib/signals';
export class Layout extends Node {
    get columnGap() {
        return this.gap.x;
    }
    get rowGap() {
        return this.gap.y;
    }
    getX() {
        if (this.isLayoutRoot()) {
            return this.x.context.getter();
        }
        return this.computedPosition().x;
    }
    setX(value) {
        this.x.context.setter(value);
    }
    getY() {
        if (this.isLayoutRoot()) {
            return this.y.context.getter();
        }
        return this.computedPosition().y;
    }
    setY(value) {
        this.y.context.setter(value);
    }
    get width() {
        return this.size.x;
    }
    get height() {
        return this.size.y;
    }
    getWidth() {
        return this.computedSize().width;
    }
    setWidth(value) {
        this.width.context.setter(value);
    }
    *tweenWidth(value, time, timingFunction, interpolationFunction) {
        const width = this.desiredSize().x;
        const lock = typeof width !== 'number' || typeof value !== 'number';
        let from;
        if (lock) {
            from = this.size.x();
        }
        else {
            from = width;
        }
        let to;
        if (lock) {
            this.size.x(value);
            to = this.size.x();
        }
        else {
            to = value;
        }
        this.size.x(from);
        lock && this.lockSize();
        yield* tween(time, value => this.size.x(interpolationFunction(from, to, timingFunction(value))));
        this.size.x(value);
        lock && this.releaseSize();
    }
    getHeight() {
        return this.computedSize().height;
    }
    setHeight(value) {
        this.height.context.setter(value);
    }
    *tweenHeight(value, time, timingFunction, interpolationFunction) {
        const height = this.desiredSize().y;
        const lock = typeof height !== 'number' || typeof value !== 'number';
        let from;
        if (lock) {
            from = this.size.y();
        }
        else {
            from = height;
        }
        let to;
        if (lock) {
            this.size.y(value);
            to = this.size.y();
        }
        else {
            to = value;
        }
        this.size.y(from);
        lock && this.lockSize();
        yield* tween(time, value => this.size.y(interpolationFunction(from, to, timingFunction(value))));
        this.size.y(value);
        lock && this.releaseSize();
    }
    /**
     * Get the desired size of this node.
     *
     * @remarks
     * This method can be used to control the size using external factors.
     * By default, the returned size is the same as the one declared by the user.
     */
    desiredSize() {
        return {
            x: this.width.context.getter(),
            y: this.height.context.getter(),
        };
    }
    *tweenSize(value, time, timingFunction, interpolationFunction) {
        const size = this.desiredSize();
        let from;
        if (typeof size.x !== 'number' || typeof size.y !== 'number') {
            from = this.size();
        }
        else {
            from = new Vector2(size);
        }
        let to;
        if (typeof value === 'object' &&
            typeof value.x === 'number' &&
            typeof value.y === 'number') {
            to = new Vector2(value);
        }
        else {
            this.size(value);
            to = this.size();
        }
        this.size(from);
        this.lockSize();
        yield* tween(time, value => this.size(interpolationFunction(from, to, timingFunction(value))));
        this.releaseSize();
        this.size(value);
    }
    constructor(props) {
        super(props);
    }
    lockSize() {
        this.sizeLockCounter(this.sizeLockCounter() + 1);
    }
    releaseSize() {
        this.sizeLockCounter(this.sizeLockCounter() - 1);
    }
    parentTransform() {
        let parent = this.parent();
        while (parent) {
            if (parent instanceof Layout) {
                return parent;
            }
            parent = parent.parent();
        }
        return null;
    }
    anchorPosition() {
        const size = this.computedSize();
        const offset = this.offset();
        return size.scale(0.5).mul(offset);
    }
    /**
     * Get the resolved layout mode of this node.
     *
     * @remarks
     * When the mode is `null`, its value will be inherited from the parent.
     *
     * Use {@link layout} to get the raw mode set for this node (without
     * inheritance).
     */
    layoutEnabled() {
        return this.layout() ?? this.parentTransform()?.layoutEnabled() ?? false;
    }
    isLayoutRoot() {
        return !this.layoutEnabled() || !this.parentTransform()?.layoutEnabled();
    }
    localToParent() {
        const matrix = new DOMMatrix();
        matrix.translateSelf(this.x(), this.y());
        matrix.rotateSelf(0, 0, this.rotation());
        matrix.scaleSelf(this.scale.x(), this.scale.y());
        const offset = this.offset();
        if (!offset.exactlyEquals(Vector2.zero)) {
            const translate = this.size().mul(offset).scale(-0.5);
            matrix.translateSelf(translate.x, translate.y);
        }
        return matrix;
    }
    /**
     * A simplified version of {@link localToParent} matrix used for transforming
     * direction vectors.
     *
     * @internal
     */
    scalingRotationMatrix() {
        const matrix = new DOMMatrix();
        matrix.rotateSelf(0, 0, this.rotation());
        matrix.scaleSelf(this.scale.x(), this.scale.y());
        const offset = this.offset();
        if (!offset.exactlyEquals(Vector2.zero)) {
            const translate = this.size().mul(offset).scale(-0.5);
            matrix.translateSelf(translate.x, translate.y);
        }
        return matrix;
    }
    getComputedLayout() {
        return new BBox(this.element.getBoundingClientRect());
    }
    computedPosition() {
        this.requestLayoutUpdate();
        const box = this.getComputedLayout();
        const position = new Vector2(box.x + (box.width / 2) * this.offset.x(), box.y + (box.height / 2) * this.offset.y());
        const parent = this.parentTransform();
        if (parent) {
            const parentRect = parent.getComputedLayout();
            position.x -= parentRect.x + (parentRect.width - box.width) / 2;
            position.y -= parentRect.y + (parentRect.height - box.height) / 2;
        }
        return position;
    }
    computedSize() {
        this.requestLayoutUpdate();
        return this.getComputedLayout().size;
    }
    /**
     * Find the closest layout root and apply any new layout changes.
     */
    requestLayoutUpdate() {
        const parent = this.parentTransform();
        if (this.appendedToView()) {
            parent?.requestFontUpdate();
            this.updateLayout();
        }
        else {
            parent.requestLayoutUpdate();
        }
    }
    appendedToView() {
        const root = this.isLayoutRoot();
        if (root) {
            this.view().element.append(this.element);
        }
        return root;
    }
    /**
     * Apply any new layout changes to this node and its children.
     */
    updateLayout() {
        this.applyFont();
        this.applyFlex();
        if (this.layoutEnabled()) {
            const children = this.layoutChildren();
            for (const child of children) {
                child.updateLayout();
            }
        }
    }
    layoutChildren() {
        const queue = [...this.children()];
        const result = [];
        const elements = [];
        while (queue.length) {
            const child = queue.shift();
            if (child instanceof Layout) {
                if (child.layoutEnabled()) {
                    result.push(child);
                    elements.push(child.element);
                }
            }
            else if (child) {
                queue.unshift(...child.children());
            }
        }
        this.element.replaceChildren(...elements);
        return result;
    }
    /**
     * Apply any new font changes to this node and all of its ancestors.
     */
    requestFontUpdate() {
        this.appendedToView();
        this.parentTransform()?.requestFontUpdate();
        this.applyFont();
    }
    getCacheBBox() {
        return BBox.fromSizeCentered(this.computedSize());
    }
    draw(context) {
        if (this.clip()) {
            const size = this.computedSize();
            if (size.width === 0 || size.height === 0) {
                return;
            }
            context.beginPath();
            context.rect(size.width / -2, size.height / -2, size.width, size.height);
            context.closePath();
            context.clip();
        }
        this.drawChildren(context);
    }
    drawOverlay(context, matrix) {
        const size = this.computedSize();
        const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
        const box = BBox.fromSizeCentered(size);
        const layout = box.transformCorners(matrix);
        const padding = box
            .addSpacing(this.padding().scale(-1))
            .transformCorners(matrix);
        const margin = box.addSpacing(this.margin()).transformCorners(matrix);
        context.beginPath();
        drawLine(context, margin);
        drawLine(context, layout);
        context.closePath();
        context.fillStyle = 'rgba(255,193,125,0.6)';
        context.fill('evenodd');
        context.beginPath();
        drawLine(context, layout);
        drawLine(context, padding);
        context.closePath();
        context.fillStyle = 'rgba(180,255,147,0.6)';
        context.fill('evenodd');
        context.beginPath();
        drawLine(context, layout);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = 'white';
        context.stroke();
        context.beginPath();
        drawPivot(context, offset);
        context.stroke();
    }
    getOriginDelta(origin) {
        const size = this.computedSize().scale(0.5);
        const offset = this.offset().mul(size);
        if (origin === Origin.Middle) {
            return offset.flipped;
        }
        const newOffset = originToOffset(origin).mul(size);
        return newOffset.sub(offset);
    }
    /**
     * Update the offset of this node and adjust the position to keep it in the
     * same place.
     *
     * @param offset - The new offset.
     */
    moveOffset(offset) {
        const size = this.computedSize().scale(0.5);
        const oldOffset = this.offset().mul(size);
        const newOffset = offset.mul(size);
        this.offset(offset);
        this.position(this.position().add(newOffset).sub(oldOffset));
    }
    parsePixels(value) {
        return value === null ? '' : `${value}px`;
    }
    parseLength(value) {
        if (value === null) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        return `${value}px`;
    }
    applyFlex() {
        this.element.style.position = this.isLayoutRoot() ? 'absolute' : 'relative';
        const size = this.desiredSize();
        this.element.style.width = this.parseLength(size.x);
        this.element.style.height = this.parseLength(size.y);
        this.element.style.maxWidth = this.parseLength(this.maxWidth());
        this.element.style.minWidth = this.parseLength(this.minWidth());
        this.element.style.maxHeight = this.parseLength(this.maxHeight());
        this.element.style.minHeight = this.parseLength(this.minHeight());
        this.element.style.aspectRatio =
            this.ratio() === null ? '' : this.ratio().toString();
        this.element.style.marginTop = this.parsePixels(this.margin.top());
        this.element.style.marginBottom = this.parsePixels(this.margin.bottom());
        this.element.style.marginLeft = this.parsePixels(this.margin.left());
        this.element.style.marginRight = this.parsePixels(this.margin.right());
        this.element.style.paddingTop = this.parsePixels(this.padding.top());
        this.element.style.paddingBottom = this.parsePixels(this.padding.bottom());
        this.element.style.paddingLeft = this.parsePixels(this.padding.left());
        this.element.style.paddingRight = this.parsePixels(this.padding.right());
        this.element.style.flexDirection = this.direction();
        this.element.style.flexBasis = this.parseLength(this.basis());
        this.element.style.flexWrap = this.wrap();
        this.element.style.justifyContent = this.justifyContent();
        this.element.style.alignContent = this.alignContent();
        this.element.style.alignItems = this.alignItems();
        this.element.style.alignSelf = this.alignSelf();
        this.element.style.columnGap = this.parseLength(this.gap.x());
        this.element.style.rowGap = this.parseLength(this.gap.y());
        if (this.sizeLockCounter() > 0) {
            this.element.style.flexGrow = '0';
            this.element.style.flexShrink = '0';
        }
        else {
            this.element.style.flexGrow = this.grow().toString();
            this.element.style.flexShrink = this.shrink().toString();
        }
    }
    applyFont() {
        this.element.style.fontFamily = this.fontFamily.isInitial()
            ? ''
            : this.fontFamily();
        this.element.style.fontSize = this.fontSize.isInitial()
            ? ''
            : `${this.fontSize()}px`;
        this.element.style.fontStyle = this.fontStyle.isInitial()
            ? ''
            : this.fontStyle();
        if (this.lineHeight.isInitial()) {
            this.element.style.lineHeight = '';
        }
        else {
            const lineHeight = this.lineHeight();
            this.element.style.lineHeight =
                typeof lineHeight === 'string'
                    ? (parseFloat(lineHeight) / 100).toString()
                    : `${lineHeight}px`;
        }
        this.element.style.fontWeight = this.fontWeight.isInitial()
            ? ''
            : this.fontWeight().toString();
        this.element.style.letterSpacing = this.letterSpacing.isInitial()
            ? ''
            : `${this.letterSpacing()}px`;
        this.element.style.textAlign = this.textAlign.isInitial()
            ? ''
            : this.textAlign();
        if (this.textWrap.isInitial()) {
            this.element.style.whiteSpace = '';
        }
        else {
            const wrap = this.textWrap();
            if (typeof wrap === 'boolean') {
                this.element.style.whiteSpace = wrap ? 'normal' : 'nowrap';
            }
            else {
                this.element.style.whiteSpace = wrap;
            }
        }
    }
    dispose() {
        super.dispose();
        this.sizeLockCounter?.context.dispose();
        if (this.element) {
            this.element.remove();
            this.element.innerHTML = '';
        }
        this.element = null;
        this.styles = null;
    }
    hit(position) {
        const local = position.transformAsPoint(this.localToParent().inverse());
        if (this.cacheBBox().includes(local)) {
            return super.hit(position) ?? this;
        }
        return null;
    }
}
__decorate([
    initial(null),
    signal()
], Layout.prototype, "layout", void 0);
__decorate([
    initial(null),
    signal()
], Layout.prototype, "maxWidth", void 0);
__decorate([
    initial(null),
    signal()
], Layout.prototype, "maxHeight", void 0);
__decorate([
    initial(null),
    signal()
], Layout.prototype, "minWidth", void 0);
__decorate([
    initial(null),
    signal()
], Layout.prototype, "minHeight", void 0);
__decorate([
    initial(null),
    signal()
], Layout.prototype, "ratio", void 0);
__decorate([
    spacingSignal('margin')
], Layout.prototype, "margin", void 0);
__decorate([
    spacingSignal('padding')
], Layout.prototype, "padding", void 0);
__decorate([
    initial('row'),
    signal()
], Layout.prototype, "direction", void 0);
__decorate([
    initial(null),
    signal()
], Layout.prototype, "basis", void 0);
__decorate([
    initial(0),
    signal()
], Layout.prototype, "grow", void 0);
__decorate([
    initial(1),
    signal()
], Layout.prototype, "shrink", void 0);
__decorate([
    initial('nowrap'),
    signal()
], Layout.prototype, "wrap", void 0);
__decorate([
    initial('start'),
    signal()
], Layout.prototype, "justifyContent", void 0);
__decorate([
    initial('normal'),
    signal()
], Layout.prototype, "alignContent", void 0);
__decorate([
    initial('stretch'),
    signal()
], Layout.prototype, "alignItems", void 0);
__decorate([
    initial('auto'),
    signal()
], Layout.prototype, "alignSelf", void 0);
__decorate([
    initial(0),
    vector2Signal({ x: 'columnGap', y: 'rowGap' })
], Layout.prototype, "gap", void 0);
__decorate([
    defaultStyle('font-family'),
    signal()
], Layout.prototype, "fontFamily", void 0);
__decorate([
    defaultStyle('font-size', parseFloat),
    signal()
], Layout.prototype, "fontSize", void 0);
__decorate([
    defaultStyle('font-style'),
    signal()
], Layout.prototype, "fontStyle", void 0);
__decorate([
    defaultStyle('font-weight', parseInt),
    signal()
], Layout.prototype, "fontWeight", void 0);
__decorate([
    defaultStyle('line-height', parseFloat),
    signal()
], Layout.prototype, "lineHeight", void 0);
__decorate([
    defaultStyle('letter-spacing', i => (i === 'normal' ? 0 : parseFloat(i))),
    signal()
], Layout.prototype, "letterSpacing", void 0);
__decorate([
    defaultStyle('white-space', i => (i === 'pre' ? 'pre' : i === 'normal')),
    signal()
], Layout.prototype, "textWrap", void 0);
__decorate([
    initial('inherit'),
    signal()
], Layout.prototype, "textDirection", void 0);
__decorate([
    defaultStyle('text-align'),
    signal()
], Layout.prototype, "textAlign", void 0);
__decorate([
    initial({ x: null, y: null }),
    vector2Signal({ x: 'width', y: 'height' })
], Layout.prototype, "size", void 0);
__decorate([
    threadable()
], Layout.prototype, "tweenWidth", null);
__decorate([
    threadable()
], Layout.prototype, "tweenHeight", null);
__decorate([
    computed()
], Layout.prototype, "desiredSize", null);
__decorate([
    threadable()
], Layout.prototype, "tweenSize", null);
__decorate([
    vector2Signal('offset')
], Layout.prototype, "offset", void 0);
__decorate([
    originSignal(Origin.Top)
], Layout.prototype, "top", void 0);
__decorate([
    originSignal(Origin.Bottom)
], Layout.prototype, "bottom", void 0);
__decorate([
    originSignal(Origin.Left)
], Layout.prototype, "left", void 0);
__decorate([
    originSignal(Origin.Right)
], Layout.prototype, "right", void 0);
__decorate([
    originSignal(Origin.TopLeft)
], Layout.prototype, "topLeft", void 0);
__decorate([
    originSignal(Origin.TopRight)
], Layout.prototype, "topRight", void 0);
__decorate([
    originSignal(Origin.BottomLeft)
], Layout.prototype, "bottomLeft", void 0);
__decorate([
    originSignal(Origin.BottomRight)
], Layout.prototype, "bottomRight", void 0);
__decorate([
    initial(false),
    signal()
], Layout.prototype, "clip", void 0);
__decorate([
    initial(0),
    signal()
], Layout.prototype, "sizeLockCounter", void 0);
__decorate([
    computed()
], Layout.prototype, "parentTransform", null);
__decorate([
    computed()
], Layout.prototype, "anchorPosition", null);
__decorate([
    computed()
], Layout.prototype, "layoutEnabled", null);
__decorate([
    computed()
], Layout.prototype, "isLayoutRoot", null);
__decorate([
    computed()
], Layout.prototype, "scalingRotationMatrix", null);
__decorate([
    computed()
], Layout.prototype, "computedPosition", null);
__decorate([
    computed()
], Layout.prototype, "computedSize", null);
__decorate([
    computed()
], Layout.prototype, "requestLayoutUpdate", null);
__decorate([
    computed()
], Layout.prototype, "appendedToView", null);
__decorate([
    computed()
], Layout.prototype, "updateLayout", null);
__decorate([
    computed()
], Layout.prototype, "layoutChildren", null);
__decorate([
    computed()
], Layout.prototype, "requestFontUpdate", null);
__decorate([
    computed()
], Layout.prototype, "applyFlex", null);
__decorate([
    computed()
], Layout.prototype, "applyFont", null);
function originSignal(origin) {
    return (target, key) => {
        signal()(target, key);
        cloneable(false)(target, key);
        const meta = getPropertyMeta(target, key);
        meta.getter = function () {
            return this.getOriginDelta(origin).transformAsPoint(this.localToParent());
        };
        meta.setter = function (value) {
            this.position(modify(value, unwrapped => this.getOriginDelta(origin)
                .transform(this.scalingRotationMatrix())
                .flipped.add(unwrapped)));
            return this;
        };
    };
}
addInitializer(Layout.prototype, instance => {
    instance.element = document.createElement('div');
    instance.element.style.display = 'flex';
    instance.element.style.boxSizing = 'border-box';
    instance.styles = getComputedStyle(instance.element);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvTGF5b3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFDTCxjQUFjLEVBQ2QsU0FBUyxFQUNULFFBQVEsRUFDUixZQUFZLEVBQ1osZUFBZSxFQUNmLE9BQU8sRUFDUCxNQUFNLEVBRU4sYUFBYSxHQUNkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUdkLElBQUksRUFHSixPQUFPLEdBR1IsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBR0wsS0FBSyxHQUNOLE1BQU0sa0NBQWtDLENBQUM7QUFhMUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBRTlELE9BQU8sRUFBQyxJQUFJLEVBQVksTUFBTSxRQUFRLENBQUM7QUFDdkMsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzFELE9BQU8sRUFDTCxNQUFNLEdBSVAsTUFBTSxpQ0FBaUMsQ0FBQztBQWlJekMsTUFBTSxPQUFPLE1BQU8sU0FBUSxJQUFJO0lBMEQ5QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBVyxNQUFNO1FBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBK0JTLElBQUk7UUFDWixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FB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QUFLLElBQUksQ0FBQztJQUN0QixDQUFDO0lBR1MsU0FBUztRQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUU1RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFHLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXO1lBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXhELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV2RSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFekUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxH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