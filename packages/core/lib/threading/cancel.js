import { useThread } from '../utils';
/**
 * Cancel all listed tasks.
 *
 * Example:
 * ```ts
 * const task = yield generatorFunction();
 *
 * // do something concurrently
 *
 * yield* cancel(task);
 * ```
 *
 * @param tasks - A list of tasks to cancel.
 */
export function cancel(...tasks) {
    const thread = useThread();
    for (const task of tasks) {
        const child = thread.children.find(thread => thread.runner === task);
        if (child && !child.canceled) {
            child.cancel();
            child.time(thread.time());
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuY2VsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RocmVhZGluZy9jYW5jZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUVuQzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFHLEtBQXdCO0lBQ2hELE1BQU0sTUFBTSxHQUFHLFNBQVMsRUFBRSxDQUFDO0lBQzNCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQztRQUNyRSxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDNUIsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMzQjtLQUNGO0FBQ0gsQ0FBQyJ9