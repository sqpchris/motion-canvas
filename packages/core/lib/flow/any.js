import { join } from '../threading';
import { decorate, threadable } from '../decorators';
decorate(any, threadable());
/**
 * Run all tasks concurrently and wait for any of them to finish.
 *
 * @example
 * ```ts
 * // current time: 0s
 * yield* any(
 *   rect.fill('#ff0000', 2),
 *   rect.opacity(1, 1),
 * );
 * // current time: 1s
 * ```
 *
 * @param tasks - A list of tasks to run.
 */
export function* any(...tasks) {
    for (const task of tasks) {
        yield task;
    }
    yield* join(false, ...tasks);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW55LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zsb3cvYW55LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQWtCLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRW5ELFFBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUM1Qjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBd0I7SUFDOUMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDeEIsTUFBTSxJQUFJLENBQUM7S0FDWjtJQUNELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDIn0=