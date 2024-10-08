import { join } from '../threading';
import { decorate, threadable } from '../decorators';
decorate(all, threadable());
/**
 * Run all tasks concurrently and wait for all of them to finish.
 *
 * @example
 * ```ts
 * // current time: 0s
 * yield* all(
 *   rect.fill('#ff0000', 2),
 *   rect.opacity(1, 1),
 * );
 * // current time: 2s
 * ```
 *
 * @param tasks - A list of tasks to run.
 */
export function* all(...tasks) {
    for (const task of tasks) {
        yield task;
    }
    yield* join(...tasks);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Zsb3cvYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQWtCLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRW5ELFFBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUM1Qjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBd0I7SUFDOUMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDeEIsTUFBTSxJQUFJLENBQUM7S0FDWjtJQUNELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLENBQUMifQ==