import { Gradient, Pattern } from '../partials';
import { Color, Vector2 } from '@motion-canvas/core/lib/types';
export function canvasStyleParser(style) {
    if (style === null) {
        return null;
    }
    if (style instanceof Gradient) {
        return style;
    }
    if (style instanceof Pattern) {
        return style;
    }
    return new Color(style);
}
export function resolveCanvasStyle(style, context) {
    if (style === null) {
        return '';
    }
    if (style instanceof Color) {
        return style.serialize();
    }
    if (style instanceof Gradient) {
        return style.canvasGradient(context);
    }
    if (style instanceof Pattern) {
        return style.canvasPattern(context) ?? '';
    }
    return '';
}
export function drawRoundRect(context, rect, radius, smoothCorners, cornerSharpness) {
    if (radius.top === 0 &&
        radius.right === 0 &&
        radius.bottom === 0 &&
        radius.left === 0) {
        drawRect(context, rect);
        return;
    }
    const topLeft = adjustRectRadius(radius.top, radius.right, radius.left, rect);
    const topRight = adjustRectRadius(radius.right, radius.top, radius.bottom, rect);
    const bottomRight = adjustRectRadius(radius.bottom, radius.left, radius.right, rect);
    const bottomLeft = adjustRectRadius(radius.left, radius.bottom, radius.top, rect);
    if (smoothCorners) {
        const sharpness = (radius) => {
            const val = radius * cornerSharpness;
            return radius - val;
        };
        context.moveTo(rect.left + topLeft, rect.top);
        context.lineTo(rect.right - topRight, rect.top);
        context.bezierCurveTo(rect.right - sharpness(topRight), rect.top, rect.right, rect.top + sharpness(topRight), rect.right, rect.top + topRight);
        context.lineTo(rect.right, rect.bottom - bottomRight);
        context.bezierCurveTo(rect.right, rect.bottom - sharpness(bottomRight), rect.right - sharpness(bottomRight), rect.bottom, rect.right - bottomRight, rect.bottom);
        context.lineTo(rect.left + bottomLeft, rect.bottom);
        context.bezierCurveTo(rect.left + sharpness(bottomLeft), rect.bottom, rect.left, rect.bottom - sharpness(bottomLeft), rect.left, rect.bottom - bottomLeft);
        context.lineTo(rect.left, rect.top + topLeft);
        context.bezierCurveTo(rect.left, rect.top + sharpness(topLeft), rect.left + sharpness(topLeft), rect.top, rect.left + topLeft, rect.top);
        return;
    }
    context.moveTo(rect.left + topLeft, rect.top);
    context.arcTo(rect.right, rect.top, rect.right, rect.bottom, topRight);
    context.arcTo(rect.right, rect.bottom, rect.left, rect.bottom, bottomRight);
    context.arcTo(rect.left, rect.bottom, rect.left, rect.top, bottomLeft);
    context.arcTo(rect.left, rect.top, rect.right, rect.top, topLeft);
}
function adjustRectRadius(radius, horizontal, vertical, rect) {
    const width = radius + horizontal > rect.width
        ? rect.width * (radius / (radius + horizontal))
        : radius;
    const height = radius + vertical > rect.height
        ? rect.height * (radius / (radius + vertical))
        : radius;
    return Math.min(width, height);
}
export function drawRect(context, rect) {
    context.rect(rect.x, rect.y, rect.width, rect.height);
}
export function fillRect(context, rect) {
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
}
export function strokeRect(context, rect) {
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);
}
export function drawPolygon(path, rect, sides) {
    const size = rect.size.scale(0.5);
    for (let i = 0; i <= sides; i++) {
        const theta = (i * 2 * Math.PI) / sides;
        const direction = Vector2.fromRadians(theta).perpendicular;
        const vertex = direction.mul(size);
        if (i == 0) {
            moveTo(path, vertex);
        }
        else {
            lineTo(path, vertex);
        }
    }
    path.closePath();
}
export function drawImage(context, image, first, second) {
    if (second) {
        context.drawImage(image, first.x, first.y, first.width, first.height, second.x, second.y, second.width, second.height);
    }
    else {
        context.drawImage(image, first.x, first.y, first.width, first.height);
    }
}
export function moveTo(context, position) {
    context.moveTo(position.x, position.y);
}
export function lineTo(context, position) {
    context.lineTo(position.x, position.y);
}
export function arcTo(context, through, position, radius) {
    context.arcTo(through.x, through.y, position.x, position.y, radius);
}
export function drawLine(context, points) {
    if (points.length < 2)
        return;
    moveTo(context, points[0]);
    for (const point of points.slice(1)) {
        lineTo(context, point);
    }
}
export function drawPivot(context, offset, radius = 8) {
    lineTo(context, offset.addY(-radius));
    lineTo(context, offset.addY(radius));
    lineTo(context, offset);
    lineTo(context, offset.addX(-radius));
    arc(context, offset, radius);
}
export function arc(context, center, radius, startAngle = 0, endAngle = Math.PI * 2, counterclockwise = false) {
    context.arc(center.x, center.y, radius, startAngle, endAngle, counterclockwise);
}
export function bezierCurveTo(context, controlPoint1, controlPoint2, to) {
    context.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, to.x, to.y);
}
export function quadraticCurveTo(context, controlPoint, to) {
    context.quadraticCurveTo(controlPoint.x, controlPoint.y, to.x, to.y);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FudmFzVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvQ2FudmFzVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFFBQVEsRUFBRSxPQUFPLEVBQXNCLE1BQU0sYUFBYSxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxLQUFLLEVBQWlCLE9BQU8sRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTVFLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxLQUEwQjtJQUMxRCxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFDbEIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRTtRQUM3QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSSxLQUFLLFlBQVksT0FBTyxFQUFFO1FBQzVCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQ2hDLEtBQWtCLEVBQ2xCLE9BQWlDO0lBRWpDLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtRQUNsQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1FBQzFCLE9BQWUsS0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ25DO0lBQ0QsSUFBSSxLQUFLLFlBQVksUUFBUSxFQUFFO1FBQzdCLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN0QztJQUNELElBQUksS0FBSyxZQUFZLE9BQU8sRUFBRTtRQUM1QixPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzNDO0lBRUQsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FDM0IsT0FBMEMsRUFDMUMsSUFB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