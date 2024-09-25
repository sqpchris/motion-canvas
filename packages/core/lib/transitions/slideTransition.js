import { Direction, Vector2 } from '../types';
import { useScene } from '../utils';
import { useTransition } from './useTransition';
import { all } from '../flow';
/**
 * Perform a transition that slides the scene in a given direction.
 *
 * @param direction - The direction in which to slide.
 * @param duration - The duration of the transition.
 */
export function* slideTransition(direction = Direction.Top, duration = 0.6) {
    const size = useScene().getSize();
    const position = size.getOriginOffset(direction).scale(2);
    const previousPosition = Vector2.createSignal();
    const currentPosition = Vector2.createSignal(position);
    const endTransition = useTransition(ctx => ctx.translate(currentPosition.x(), currentPosition.y()), ctx => ctx.translate(previousPosition.x(), previousPosition.y()));
    yield* all(previousPosition(position.scale(-1), duration), currentPosition(Vector2.zero, duration));
    endTransition();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVUcmFuc2l0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zaXRpb25zL3NsaWRlVHJhbnNpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM5QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRzVCOzs7OztHQUtHO0FBQ0gsTUFBTSxTQUFTLENBQUMsQ0FBQyxlQUFlLENBQzlCLFlBQXVCLFNBQVMsQ0FBQyxHQUFHLEVBQ3BDLFFBQVEsR0FBRyxHQUFHO0lBRWQsTUFBTSxJQUFJLEdBQUcsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDaEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQ2pDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzlELEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNqRSxDQUFDO0lBRUYsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUNSLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFDOUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQ3hDLENBQUM7SUFDRixhQUFhLEVBQUUsQ0FBQztBQUNsQixDQUFDIn0=