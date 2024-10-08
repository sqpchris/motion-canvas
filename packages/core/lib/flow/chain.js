import { decorate, threadable } from '../decorators';
import { isThreadGenerator } from '../threading';
decorate(chain, threadable());
/**
 * Run tasks one after another.
 *
 * @example
 * ```ts
 * // current time: 0s
 * yield* chain(
 *   rect.fill('#ff0000', 2),
 *   rect.opacity(1, 1),
 * );
 * // current time: 3s
 * ```
 *
 * Note that the same animation can be written as:
 * ```ts
 * yield* rect.fill('#ff0000', 2),
 * yield* rect.opacity(1, 1),
 * ```
 *
 * The reason `chain` exists is to make it easier to pass it to other flow
 * functions. For example:
 * ```ts
 * yield* all(
 *   rect.radius(20, 3),
 *   chain(
 *     rect.fill('#ff0000', 2),
 *     rect.opacity(1, 1),
 *   ),
 * );
 * ```
 *
 * @param tasks - A list of tasks to run.
 */
export function* chain(...tasks) {
    for (const generator of tasks) {
        if (isThreadGenerator(generator)) {
            yield* generator;
        }
        else {
            generator();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxvdy9jaGFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUMsaUJBQWlCLEVBQWtCLE1BQU0sY0FBYyxDQUFDO0FBRWhFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUM5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxNQUFNLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FDcEIsR0FBRyxLQUFxQztJQUV4QyxLQUFLLE1BQU0sU0FBUyxJQUFJLEtBQUssRUFBRTtRQUM3QixJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQztTQUNsQjthQUFNO1lBQ0wsU0FBUyxFQUFFLENBQUM7U0FDYjtLQUNGO0FBQ0gsQ0FBQyJ9