/**
 * Register a time event and get its duration in seconds.
 *
 * @remarks
 * This can be used to better specify when an animation should start
 * as well as how long this animation should take
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
 *   yield* circle().scale(2, useDuration('circleGrow'));
 * });
 * ```
 *
 * @param name - The name of the event.
 *
 * @returns The duration of the event in seconds.
 */
export declare function useDuration(name: string): number;
//# sourceMappingURL=useDuration.d.ts.map