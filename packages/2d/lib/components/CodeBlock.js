var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, initial, parser, signal } from '../decorators';
import { useLogger } from '@motion-canvas/core/lib/utils';
import { Shape } from './Shape';
import { parse, diff, ready, } from 'code-fns';
import { clampRemap, easeInOutSine, map, tween, } from '@motion-canvas/core/lib/tweening';
import { threadable } from '@motion-canvas/core/lib/decorators';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { createComputedAsync, createSignal, } from '@motion-canvas/core/lib/signals';
import { join } from '@motion-canvas/core/lib/threading';
import { waitFor } from '@motion-canvas/core/lib/flow';
export class CodeBlock extends Shape {
    *tweenSelection(value, duration, timingFunction) {
        this.oldSelection = this.selection();
        this.selection(value);
        this.selectionProgress(0);
        yield* this.selectionProgress(1, duration, timingFunction);
        this.selectionProgress(null);
        this.oldSelection = null;
    }
    parsed() {
        if (!CodeBlock.initialized()) {
            return [];
        }
        return parse(this.code(), { codeStyle: this.theme() });
    }
    constructor({ children, ...rest }) {
        super({
            fontFamily: 'monospace',
            ...rest,
        });
        this.codeProgress = createSignal(null);
        this.selectionProgress = createSignal(null);
        this.oldSelection = null;
        this.diffed = null;
        if (children) {
            this.code(children);
        }
    }
    characterSize() {
        this.requestFontUpdate();
        const context = this.cacheCanvas();
        context.save();
        this.applyStyle(context);
        context.font = this.styles.font;
        const width = context.measureText('X').width;
        context.restore();
        return new Vector2(width, parseFloat(this.styles.lineHeight));
    }
    desiredSize() {
        const custom = super.desiredSize();
        const tokensSize = this.getTokensSize(this.parsed());
        return {
            x: custom.x ?? tokensSize.x,
            y: custom.y ?? tokensSize.y,
        };
    }
    getTokensSize(tokens) {
        const size = this.characterSize();
        let maxWidth = 0;
        let height = size.height;
        let width = 0;
        for (const token of tokens) {
            for (let i = 0; i < token.code.length; i++) {
                if (token.code[i] === '\n') {
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                    width = 0;
                    height += size.height;
                }
                else {
                    width += size.width;
                }
            }
        }
        if (width > maxWidth) {
            maxWidth = width;
        }
        return { x: maxWidth, y: height };
    }
    collectAsyncResources() {
        super.collectAsyncResources();
        CodeBlock.initialized();
    }
    set(strings, ...rest) {
        this.code({
            language: this.language(),
            spans: strings,
            nodes: rest,
        });
    }
    /**
     * Smoothly edit the code.
     *
     * @remarks
     * This method returns a tag function that should be used together with a
     * template literal to define what to edit. Expressions can be used to either
     * {@link insert}, {@link remove}, or {@link edit} the code.
     *
     * @example
     * ```ts
     * yield* codeBlock().edit()`
     *   const ${edit('a', 'b')} = [${insert('1, 2, 3')}];${remove(`
     *   // this comment will be removed`)}
     * `;
     * ```
     *
     * @param duration - The duration of the transition.
     * @param changeSelection - When set to `true`, the selection will be modified
     *                          to highlight the newly inserted code. Setting it
     *                          to `false` leaves the selection untouched.
     *                          Providing a custom {@link CodeRange} will select
     *                          it instead.
     */
    edit(duration = 0.6, changeSelection = true) {
        function* generator(strings, ...rest) {
            const from = {
                language: this.language(),
                spans: [...strings],
                nodes: rest.map(modification => isCodeModification(modification) ? modification.from : modification),
            };
            const to = {
                language: this.language(),
                spans: [...strings],
                nodes: rest.map(modification => isCodeModification(modification) ? modification.to : modification),
            };
            this.code(from);
            if (changeSelection) {
                const task = yield this.code(to, duration);
                yield* waitFor(duration * 0.2);
                yield* this.selection([], duration * 0.3);
                const newSelection = changeSelection === true
                    ? diff(from, to)
                        .filter(token => token.morph === 'create')
                        .map(token => [
                        [token.to[1], token.to[0]],
                        [token.to[1], token.to[0] + token.code.length],
                    ])
                    : changeSelection;
                yield* this.selection(newSelection, duration * 0.3);
                yield* join(task);
            }
            else {
                yield* this.code(to, duration);
            }
        }
        return generator.bind(this);
    }
    *tweenCode(code, time, timingFunction) {
        if (typeof code === 'function')
            throw new Error();
        if (!CodeBlock.initialized())
            return;
        const autoWidth = this.width.isInitial();
        const autoHeight = this.height.isInitial();
        const fromSize = this.size();
        const toSize = this.getTokensSize(parse(code, { codeStyle: this.theme() }));
        const beginning = 0.2;
        const ending = 0.8;
        this.codeProgress(0);
        this.diffed = diff(this.code(), code, { codeStyle: this.theme() });
        yield* tween(time, value => {
            const progress = timingFunction(value);
            const remapped = clampRemap(beginning, ending, 0, 1, progress);
            this.codeProgress(progress);
            if (autoWidth) {
                this.width(easeInOutSine(remapped, fromSize.x, toSize.x));
            }
            if (autoHeight) {
                this.height(easeInOutSine(remapped, fromSize.y, toSize.y));
            }
        }, () => {
            this.codeProgress(null);
            this.diffed = null;
            if (autoWidth) {
                this.width.reset();
            }
            if (autoHeight) {
                this.height.reset();
            }
            this.code(code);
        });
    }
    draw(context) {
        if (!CodeBlock.initialized())
            return;
        this.requestFontUpdate();
        this.applyStyle(context);
        context.font = this.styles.font;
        context.textBaseline = 'top';
        const lh = parseFloat(this.styles.lineHeight);
        const w = context.measureText('X').width;
        const size = this.computedSize();
        const progress = this.codeProgress();
        const unselectedOpacity = this.unselectedOpacity();
        const globalAlpha = context.globalAlpha;
        const getSelectionAlpha = (x, y) => map(unselectedOpacity, 1, this.selectionStrength(x, y));
        const drawToken = (code, position, alpha = 1) => {
            for (let i = 0; i < code.length; i++) {
                const char = code.charAt(i);
                if (char === '\n') {
                    position.y++;
                    position.x = 0;
                    continue;
                }
                context.globalAlpha =
                    globalAlpha * alpha * getSelectionAlpha(position.x, position.y);
                context.fillText(char, position.x * w, position.y * lh);
                position.x++;
            }
        };
        context.translate(size.x / -2, size.y / -2);
        if (progress == null) {
            const parsed = this.parsed();
            const position = { x: 0, y: 0 };
            for (const token of parsed) {
                context.save();
                context.fillStyle = token.color ?? '#c9d1d9';
                drawToken(token.code, position);
                context.restore();
            }
        }
        else {
            const diffed = this.diffed;
            const beginning = 0.2;
            const ending = 0.8;
            const overlap = 0.15;
            for (const token of diffed) {
                context.save();
                context.fillStyle = token.color ?? '#c9d1d9';
                if (token.morph === 'delete') {
                    drawToken(token.code, { x: token.from[0], y: token.from[1] }, clampRemap(0, beginning + overlap, 1, 0, progress));
                }
                else if (token.morph === 'create') {
                    drawToken(token.code, { x: token.to[0], y: token.to[1] }, clampRemap(ending - overlap, 1, 0, 1, progress));
                }
                else if (token.morph === 'retain') {
                    const remapped = clampRemap(beginning, ending, 0, 1, progress);
                    const x = easeInOutSine(remapped, token.from[0], token.to[0]);
                    const y = easeInOutSine(remapped, token.from[1], token.to[1]);
                    const point = remapped > 0.5 ? token.to : token.from;
                    let offsetX = 0;
                    let offsetY = 0;
                    for (let i = 0; i < token.code.length; i++) {
                        const char = token.code.charAt(i);
                        if (char === '\n') {
                            offsetY++;
                            offsetX = 0;
                            continue;
                        }
                        context.globalAlpha =
                            globalAlpha *
                                getSelectionAlpha(point[0] + offsetX, point[1] + offsetY);
                        context.fillText(char, (x + offsetX) * w, (y + offsetY) * lh);
                        offsetX++;
                    }
                }
                else {
                    useLogger().warn({
                        message: 'Invalid token',
                        object: token,
                    });
                }
                context.restore();
            }
        }
    }
    selectionStrength(x, y) {
        const selection = this.selection();
        const selectionProgress = this.selectionProgress();
        const isSelected = CodeBlock.selectionStrength(selection, x, y);
        if (selectionProgress === null || this.oldSelection === null) {
            return isSelected ? 1 : 0;
        }
        const wasSelected = CodeBlock.selectionStrength(this.oldSelection, x, y);
        if (isSelected === wasSelected) {
            return isSelected;
        }
        return map(wasSelected, isSelected, selectionProgress);
    }
    static selectionStrength(selection, x, y) {
        return selection.length > 0 &&
            !!selection.find(([[startLine, startColumn], [endLine, endColumn]]) => {
                return (((y === startLine && x >= startColumn) || y > startLine) &&
                    ((y === endLine && x < endColumn) || y < endLine));
            })
            ? 1
            : 0;
    }
}
CodeBlock.initialized = createComputedAsync(() => ready().then(() => true), false);
__decorate([
    initial('tsx'),
    signal()
], CodeBlock.prototype, "language", void 0);
__decorate([
    initial(''),
    parser(function (value) {
        return typeof value === 'string'
            ? {
                language: this.language(),
                spans: [value],
                nodes: [],
            }
            : value;
    }),
    signal()
], CodeBlock.prototype, "code", void 0);
__decorate([
    initial(undefined),
    signal()
], CodeBlock.prototype, "theme", void 0);
__decorate([
    initial(lines(0, Infinity)),
    signal()
], CodeBlock.prototype, "selection", void 0);
__decorate([
    initial(0.32),
    signal()
], CodeBlock.prototype, "unselectedOpacity", void 0);
__decorate([
    computed()
], CodeBlock.prototype, "parsed", null);
__decorate([
    computed()
], CodeBlock.prototype, "characterSize", null);
__decorate([
    threadable()
], CodeBlock.prototype, "tweenCode", null);
function isCodeModification(value) {
    return (value &&
        typeof value === 'object' &&
        value.from !== undefined &&
        value.to !== undefined);
}
/**
 * Create a code modification that inserts a piece of code.
 *
 * @remarks
 * Should be used in conjunction with {@link CodeBlock.edit}.
 *
 * @param content - The code to insert.
 */
export function insert(content) {
    return {
        from: '',
        to: content,
    };
}
/**
 * Create a code modification that removes a piece of code.
 *
 * @remarks
 * Should be used in conjunction with {@link CodeBlock.edit}.
 *
 * @param content - The code to remove.
 */
export function remove(content) {
    return {
        from: content,
        to: '',
    };
}
/**
 * Create a code modification that changes one piece of code into another.
 *
 * @remarks
 * Should be used in conjunction with {@link CodeBlock.edit}.
 *
 * @param from - The code to change from.
 * @param to - The code to change to.
 */
export function edit(from, to) {
    return { from, to };
}
/**
 * Create a selection range that highlights the given lines.
 *
 * @param from - The line from which the selection starts.
 * @param to - The line at which the selection ends. If omitted, the selection
 *             will cover only one line.
 */
export function lines(from, to) {
    return [
        [
            [from, 0],
            [to ?? from, Infinity],
        ],
    ];
}
/**
 * Create a selection range that highlights the given word.
 *
 * @param line - The line at which the word appears.
 * @param from - The column at which the word starts.
 * @param length - The length of the word. If omitted, the selection will cover
 *                 the rest of the line.
 */
export function word(line, from, length) {
    return [
        [
            [line, from],
            [line, from + (length ?? Infinity)],
        ],
    ];
}
/**
 * Create a custom selection range.
 *
 * @param startLine - The line at which the selection starts.
 * @param startColumn - The column at which the selection starts.
 * @param endLine - The line at which the selection ends.
 * @param endColumn - The column at which the selection ends.
 */
export function range(startLine, startColumn, endLine, endColumn) {
    return [
        [
            [startLine, startColumn],
            [endLine, endColumn],
        ],
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUJsb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbXBvbmVudHMvQ29kZUJsb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxTQUFTLENBQUM7QUFDMUMsT0FBTyxFQUVMLEtBQUssRUFDTCxJQUFJLEVBQ0osS0FBSyxHQUtOLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFDTCxVQUFVLEVBQ1YsYUFBYSxFQUNiLEdBQUcsRUFFSCxLQUFLLEdBQ04sTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFOUQsT0FBTyxFQUFvQixPQUFPLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLFlBQVksR0FJYixNQUFNLGlDQUFpQyxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxJQUFJLEVBQWtCLE1BQU0sbUNBQW1DLENBQUM7QUFDeEUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBa0JyRCxNQUFNLE9BQU8sU0FBVSxTQUFRLEtBQUs7SUErQnhCLENBQUMsY0FBYyxDQUN2QixLQUFrQixFQUNsQixRQUFnQixFQUNoQixjQUE4QjtRQUU5QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQVlTLE1BQU07UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzVCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsWUFBbUIsRUFBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLEVBQVk7UUFDL0MsS0FBSyxDQUFDO1lBQ0osVUFBVSxFQUFFLFdBQVc7WUFDdkIsR0FBRyxJQUFJO1NBQ1IsQ0FBQyxDQUFDO1FBbEJHLGlCQUFZLEdBQUcsWUFBWSxDQUFnQixJQUFJLENBQUMsQ0FBQztRQUNqRCxzQkFBaUIsR0FBRyxZQUFZLENBQWdCLElBQUksQ0FBQyxDQUFDO1FBQ3RELGlCQUFZLEdBQXVCLElBQUksQ0FBQztRQUN4QyxXQUFNLEdBQXdCLElBQUksQ0FBQztRQWdCekMsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUdTLGFBQWE7UUFDckIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3QyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFbEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRWtCLFdBQVc7UUFDNUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDckQsT0FBTztZQUNMLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDO1lBQzNCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDO1NBQzVCLENBQUM7SUFDSixDQUFDO0lBRVMsYUFBYSxDQUFDLE1BQWU7UUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUVkLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1lBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDMUIsSUFBSSxLQUFLLEdBQUcsUUFBUSxFQUFFO3dCQUNwQixRQUFRLEdBQUcsS0FBSyxDQUFDO3FCQUNsQjtvQkFDRCxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNWLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUN2QjtxQkFBTTtvQkFDTCxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDckI7YUFDRjtTQUNGO1FBRUQsSUFBSSxLQUFLLEdBQUcsUUFBUSxFQUFFO1lBQ3BCLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDbEI7UUFFRCxPQUFPLEVBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVrQixxQkFBcUI7UUFDdEMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDOUIsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTSxHQUFHLENBQUMsT0FBaUIsRUFBRSxHQUFHLElBQVc7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3pCLEtBQUssRUFBRSxPQUFPO1lBQ2QsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FzQkc7SUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsRUFBRSxrQkFBeUMsSUFBSTtRQUN2RSxRQUFRLENBQUMsQ0FBQyxTQUFTLENBRWpCLE9BQTZCLEVBQzdCLEdBQUcsSUFBaUM7WUFFcEMsTUFBTSxJQUFJLEdBQUc7Z0JBQ1gsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLEtBQUssRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO2dCQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUM3QixrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUNwRTthQUNGLENBQUM7WUFDRixNQUFNLEVBQUUsR0FBRztnQkFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDekIsS0FBSyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7Z0JBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQzdCLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQ2xFO2FBQ0YsQ0FBQztZQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFaEIsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzNDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFFMUMsTUFBTSxZQUFZLEdBQ2hCLGVBQWUsS0FBSyxJQUFJO29CQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7eUJBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUM7eUJBQ3pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO3dCQUNaLENBQUMsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixDQUFDLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztxQkFDakQsQ0FBQztvQkFDTixDQUFDLENBQUMsZUFBZSxDQUFDO2dCQUV0QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3BELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQjtpQkFBTTtnQkFDTCxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUNoQztRQUNILENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUdNLENBQUMsU0FBUyxDQUNmLElBQWMsRUFDZCxJQUFZLEVBQ1osY0FBOEI7UUFFOUIsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO1lBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQUUsT0FBTztRQUVyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUUsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUVuQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLENBQUMsQ0FBQztRQUNqRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQ1YsSUFBSSxFQUNKLEtBQUssQ0FBQyxFQUFFO1lBQ04sTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QixJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzRDtZQUNELElBQUksVUFBVSxFQUFFO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVEO1FBQ0gsQ0FBQyxFQUNELEdBQUcsRUFBRTtZQUNILElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNwQjtZQUNELElBQUksVUFBVSxFQUFFO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDckI7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVrQixJQUFJLENBQUMsT0FBaUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFBRSxPQUFPO1FBRXJDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxPQUFPLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUM3QixNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDbkQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUV4QyxNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFFLENBQ2pELEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFELE1BQU0sU0FBUyxHQUFHLENBQ2hCLElBQVksRUFDWixRQUEyQixFQUMzQixLQUFLLEdBQUcsQ0FBQyxFQUNULEVBQUU7WUFDRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO29CQUNqQixRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ2IsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2YsU0FBUztpQkFDVjtnQkFDRCxPQUFPLENBQUMsV0FBVztvQkFDakIsV0FBVyxHQUFHLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDeEQsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ2Q7UUFDSCxDQUFDLENBQUM7UUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtZQUNwQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0IsTUFBTSxRQUFRLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztZQUM5QixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDMUIsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7Z0JBQzdDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDbkI7U0FDRjthQUFNO1lBQ0wsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQztZQUM1QixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDdEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ25CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQztZQUNyQixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDMUIsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7Z0JBRTdDLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7b0JBQzVCLFNBQVMsQ0FDUCxLQUFLLENBQUMsSUFBSSxFQUNWLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFDdEMsVUFBVSxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQ25ELENBQUM7aUJBQ0g7cUJBQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtvQkFDbkMsU0FBUyxDQUNQLEtBQUssQ0FBQyxJQUFJLEVBQ1YsRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUNsQyxVQUFVLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FDaEQsQ0FBQztpQkFDSDtxQkFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO29CQUNuQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUMvRCxNQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxNQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxNQUFNLEtBQUssR0FBYyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFDO29CQUVsRSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQ2hCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMxQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFOzRCQUNqQixPQUFPLEVBQUUsQ0FBQzs0QkFDVixPQUFPLEdBQUcsQ0FBQyxDQUFDOzRCQUNaLFNBQVM7eUJBQ1Y7d0JBRUQsT0FBTyxDQUFDLFdBQVc7NEJBQ2pCLFdBQVc7Z0NBQ1gsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7d0JBRTVELE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDOUQsT0FBTyxFQUFFLENBQUM7cUJBQ1g7aUJBQ0Y7cUJBQU07b0JBQ0wsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDO3dCQUNmLE9BQU8sRUFBRSxlQUFlO3dCQUN4QixNQUFNLEVBQUUsS0FBSztxQkFDZCxDQUFDLENBQUM7aUJBQ0o7Z0JBQ0QsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ25CO1NBQ0Y7SUFDSCxDQUFDO0lBRVMsaUJBQWlCLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDOUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25DLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFbkQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7WUFDNUQsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksVUFBVSxLQUFLLFdBQVcsRUFBRTtZQUM5QixPQUFPLFVBQVUsQ0FBQztTQUNuQjtRQUVELE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRVMsTUFBTSxDQUFDLGlCQUFpQixDQUNoQyxTQUFzQixFQUN0QixDQUFTLEVBQ1QsQ0FBUztRQUVULE9BQU8sU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BFLE9BQU8sQ0FDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQztvQkFDeEQsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FDbEQsQ0FBQztZQUNKLENBQUMsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7O0FBN1hjLHFCQUFXLEdBQUcsbUJBQW1CLENBQzlDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFDOUIsS0FBSyxDQUNOLENBQUM7QUFJRjtJQUZDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDZCxNQUFNLEVBQUU7MkNBQ29EO0FBYTdEO0lBWEMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUNYLE1BQU0sQ0FBQyxVQUEyQixLQUFXO1FBQzVDLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUTtZQUM5QixDQUFDLENBQUM7Z0JBQ0UsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDZCxLQUFLLEVBQUUsRUFBRTthQUNWO1lBQ0gsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNaLENBQUMsQ0FBQztJQUNELE1BQU0sRUFBRTt1Q0FDa0Q7QUFJM0Q7SUFGQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2xCLE1BQU0sRUFBRTt3Q0FDZ0U7QUFJekU7SUFGQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQixNQUFNLEVBQUU7NENBQzBEO0FBaUJuRTtJQUZDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDYixNQUFNLEVBQUU7b0RBQzZEO0FBUXRFO0lBREMsUUFBUSxFQUFFO3VDQU9WO0FBYUQ7SUFEQyxRQUFRLEVBQUU7OENBV1Y7QUEwSEQ7SUFEQyxVQUFVLEVBQUU7MENBNENaO0FBeUlILFNBQVMsa0JBQWtCLENBQUMsS0FBVTtJQUNwQyxPQUFPLENBQ0wsS0FBSztRQUNMLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFDekIsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTO1FBQ3hCLEtBQUssQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUN2QixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLE9BQWE7SUFDbEMsT0FBTztRQUNMLElBQUksRUFBRSxFQUFFO1FBQ1IsRUFBRSxFQUFFLE9BQU87S0FDWixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLE9BQWE7SUFDbEMsT0FBTztRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsRUFBRSxFQUFFLEVBQUU7S0FDUCxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FBQyxJQUFVLEVBQUUsRUFBUTtJQUN2QyxPQUFPLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO0FBQ3BCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLElBQVksRUFBRSxFQUFXO0lBQzdDLE9BQU87UUFDTDtZQUNFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNULENBQUMsRUFBRSxJQUFJLElBQUksRUFBRSxRQUFRLENBQUM7U0FDdkI7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLElBQVksRUFBRSxJQUFZLEVBQUUsTUFBZTtJQUM5RCxPQUFPO1FBQ0w7WUFDRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7WUFDWixDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLENBQUM7U0FDcEM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUNuQixTQUFpQixFQUNqQixXQUFtQixFQUNuQixPQUFlLEVBQ2YsU0FBaUI7SUFFakIsT0FBTztRQUNMO1lBQ0UsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO1lBQ3hCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztTQUNyQjtLQUNGLENBQUM7QUFDSixDQUFDIn0=