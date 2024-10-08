import { useTransition } from './useTransition';
import { createSignal } from '../signals';
/**
 * Perform a transition that fades between the scenes.
 *
 * @param duration - The duration of the transition.
 */
export function* fadeTransition(duration = 0.6) {
    const progress = createSignal(0);
    const endTransition = useTransition(ctx => {
        ctx.globalAlpha = progress();
    });
    yield* progress(1, duration);
    endTransition();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFkZVRyYW5zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNpdGlvbnMvZmFkZVRyYW5zaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTlDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFeEM7Ozs7R0FJRztBQUNILE1BQU0sU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsR0FBRyxHQUFHO0lBQzVDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEMsR0FBRyxDQUFDLFdBQVcsR0FBRyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0IsYUFBYSxFQUFFLENBQUM7QUFDbEIsQ0FBQyJ9