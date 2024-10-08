import { waitFor } from './scheduling';
import { decorate, threadable } from '../decorators';
import { isThreadGenerator } from '../threading';
decorate(delay, threadable());
/**
 * Run the given generator or callback after a specific amount of time.
 *
 * @example
 * ```ts
 * yield* delay(1, rect.fill('#ff0000', 2));
 * ```
 *
 * Note that the same animation can be written as:
 * ```ts
 * yield* waitFor(1),
 * yield* rect.fill('#ff0000', 2),
 * ```
 *
 * The reason `delay` exists is to make it easier to pass it to other flow
 * functions. For example:
 * ```ts
 * yield* all(
 *   rect.opacity(1, 3),
 *   delay(1, rect.fill('#ff0000', 2));
 * );
 * ```
 *
 * @param time - The delay in seconds
 * @param task - The task or callback to run after the delay.
 */
export function* delay(time, task) {
    yield* waitFor(time);
    if (isThreadGenerator(task)) {
        yield* task;
    }
    else {
        task();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxvdy9kZWxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBQyxpQkFBaUIsRUFBa0IsTUFBTSxjQUFjLENBQUM7QUFFaEUsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJHO0FBQ0gsTUFBTSxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQ3BCLElBQVksRUFDWixJQUFnQztJQUVoQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDYjtTQUFNO1FBQ0wsSUFBSSxFQUFFLENBQUM7S0FDUjtBQUNILENBQUMifQ==