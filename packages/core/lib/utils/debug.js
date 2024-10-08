import { useLogger } from './useScene';
function stringify(value) {
    switch (typeof value) {
        case 'string':
            // Prevent strings from getting quoted again
            return value;
        case 'undefined':
            // Prevent `undefined` from being turned into `null`
            return 'undefined';
        default:
            // Prevent `NaN` from being turned into `null`
            if (Number.isNaN(value)) {
                return 'NaN';
            }
            return JSON.stringify(value);
    }
}
/**
 * Logs a debug message with an arbitrary payload.
 *
 * @remarks
 * This method is a shortcut for calling `useLogger().debug()` which allows
 * you to more easily log non-string values as well.
 *
 * @example
 * ```ts
 * export default makeScene2D(function* (view) {
 *   const circle = createRef<Circle>();
 *
 *   view.add(
 *     <Circle ref={circle} width={320} height={320} fill={'lightseagreen'} />,
 *   );
 *
 *   debug(circle().position());
 * });
 * ```
 *
 * @param payload - The payload to log
 */
export function debug(payload) {
    const result = { message: stringify(payload) };
    if (payload && typeof payload === 'object') {
        result.object = payload;
    }
    useLogger().debug(result);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZGVidWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUdyQyxTQUFTLFNBQVMsQ0FBQyxLQUFVO0lBQzNCLFFBQVEsT0FBTyxLQUFLLEVBQUU7UUFDcEIsS0FBSyxRQUFRO1lBQ1gsNENBQTRDO1lBQzVDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsS0FBSyxXQUFXO1lBQ2Qsb0RBQW9EO1lBQ3BELE9BQU8sV0FBVyxDQUFDO1FBQ3JCO1lBQ0UsOENBQThDO1lBQzlDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDdkIsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBQ0gsTUFBTSxVQUFVLEtBQUssQ0FBQyxPQUFZO0lBQ2hDLE1BQU0sTUFBTSxHQUFlLEVBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDO0lBRXpELElBQUksT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUMxQyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztLQUN6QjtJQUVELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixDQUFDIn0=