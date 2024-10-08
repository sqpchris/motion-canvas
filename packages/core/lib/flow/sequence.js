import { waitFor } from './scheduling';
import { decorate, threadable } from '../decorators';
import { join } from '../threading';
decorate(sequence, threadable());
/**
 * Start all tasks one after another with a constant delay between.
 *
 * @remarks
 * The function doesn't wait until the previous task in the sequence has
 * finished. Once the delay has passed, the next task will start even if
 * the previous is still running.
 *
 * @example
 * ```ts
 * yield* sequence(
 *   0.1,
 *   ...rects.map(rect => rect.x(100, 1))
 * );
 * ```
 *
 * @param delay - The delay between each of the tasks.
 * @param tasks - A list of tasks to be run in a sequence.
 */
export function* sequence(delay, ...tasks) {
    for (const task of tasks) {
        yield task;
        yield* waitFor(delay);
    }
    yield* join(...tasks);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxvdy9zZXF1ZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBQyxJQUFJLEVBQWtCLE1BQU0sY0FBYyxDQUFDO0FBRW5ELFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUNqQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQ3ZCLEtBQWEsRUFDYixHQUFHLEtBQXdCO0lBRTNCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxDQUFDO1FBQ1gsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZCO0lBRUQsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDeEIsQ0FBQyJ9