import { usePlayback, useThread } from '../utils';
import { decorate, threadable } from '../decorators';
decorate(loopFor, threadable());
/**
 * Run a generator in a loop for the given amount of time.
 *
 * @remarks
 * Generators are executed completely before the next iteration starts.
 * An iteration is allowed to finish even when the time is up. This means that
 * the actual duration of the loop may be longer than the given duration.
 *
 * @example
 * ```ts
 * yield* loopFor(
 *   3,
 *   () => circle().position.x(-10, 0.1).to(10, 0.1)
 * );
 * ```
 *
 * @param seconds - The duration in seconds.
 * @param factory - A function creating the generator to run. Because generators
 *                  can't be reset, a new generator is created on each
 *                  iteration.
 */
export function* loopFor(seconds, factory) {
    const thread = useThread();
    const step = usePlayback().framesToSeconds(1);
    const targetTime = thread.time() + seconds;
    let iteration = 0;
    while (targetTime - step > thread.fixed) {
        const generator = factory(iteration);
        if (generator) {
            yield* generator;
        }
        else {
            yield;
        }
        iteration += 1;
    }
    thread.time(targetTime);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9vcEZvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mbG93L2xvb3BGb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEQsT0FBTyxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJbkQsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILE1BQU0sU0FBUyxDQUFDLENBQUMsT0FBTyxDQUN0QixPQUFlLEVBQ2YsT0FBcUI7SUFFckIsTUFBTSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7SUFDM0IsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFM0MsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sVUFBVSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ3ZDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFJLFNBQVMsRUFBRTtZQUNiLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQztTQUNsQjthQUFNO1lBQ0wsS0FBSyxDQUFDO1NBQ1A7UUFDRCxTQUFTLElBQUksQ0FBQyxDQUFDO0tBQ2hCO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQixDQUFDIn0=