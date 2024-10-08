import { decorate, threadable } from '../decorators';
import { usePlayback } from '../utils';
/**
 * Call the given callback every N seconds.
 *
 * @example
 * ```ts
 * const timer = every(2, time => console.log(time));
 * yield timer.runner;
 *
 * // current time: 0s
 * yield* waitFor(5);
 * // current time: 5s
 * yield* timer.sync();
 * // current time: 6s
 * ```
 *
 * @param interval - The interval between subsequent calls.
 * @param callback - The callback to be called.
 */
export function every(interval, callback) {
    let changed = false;
    decorate(everyRunner, threadable('every'));
    function* everyRunner() {
        const project = usePlayback();
        let acc = 0;
        let tick = 0;
        callback(tick);
        changed = true;
        while (true) {
            if (acc >= project.secondsToFrames(interval)) {
                acc = 0;
                tick++;
                callback(tick);
                changed = true;
            }
            else {
                changed = false;
            }
            acc++;
            yield;
        }
    }
    return {
        runner: everyRunner(),
        setInterval(value) {
            interval = value;
            changed = false;
        },
        setCallback(value) {
            callback = value;
            changed = false;
        },
        *sync() {
            while (!changed) {
                yield;
            }
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmxvdy9ldmVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBMEJyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLFFBQWdCLEVBQUUsUUFBdUI7SUFDN0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDM0MsUUFBUSxDQUFDLENBQUMsV0FBVztRQUNuQixNQUFNLE9BQU8sR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUM5QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7UUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZixPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRWYsT0FBTyxJQUFJLEVBQUU7WUFDWCxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUM1QyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLElBQUksRUFBRSxDQUFDO2dCQUNQLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZixPQUFPLEdBQUcsSUFBSSxDQUFDO2FBQ2hCO2lCQUFNO2dCQUNMLE9BQU8sR0FBRyxLQUFLLENBQUM7YUFDakI7WUFDRCxHQUFHLEVBQUUsQ0FBQztZQUNOLEtBQUssQ0FBQztTQUNQO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLEVBQUUsV0FBVyxFQUFFO1FBQ3JCLFdBQVcsQ0FBQyxLQUFLO1lBQ2YsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUNqQixPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLENBQUM7UUFDRCxXQUFXLENBQUMsS0FBSztZQUNmLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDakIsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNsQixDQUFDO1FBQ0QsQ0FBQyxJQUFJO1lBQ0gsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDZixLQUFLLENBQUM7YUFDUDtRQUNILENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyJ9