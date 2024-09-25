import { useScene } from '../utils';
/**
 * Transition to the current scene by altering the Context2D before scenes are rendered.
 *
 * @param current - The callback to use before the current scene is rendered.
 * @param previous - The callback to use before the previous scene is rendered.
 */
export function useTransition(current, previous) {
    if (previous == null) {
        previous = () => {
            // do nothing
        };
    }
    const scene = useScene();
    const prior = scene.previous;
    const unsubPrev = prior?.lifecycleEvents.onBeforeRender.subscribe(previous);
    const unsubNext = scene.lifecycleEvents.onBeforeRender.subscribe(current);
    scene.enterInitial();
    return () => {
        scene.enterAfterTransitionIn();
        unsubPrev?.();
        unsubNext();
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlVHJhbnNpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2l0aW9ucy91c2VUcmFuc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbEM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsYUFBYSxDQUMzQixPQUFnRCxFQUNoRCxRQUFrRDtJQUVsRCxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7UUFDcEIsUUFBUSxHQUFHLEdBQUcsRUFBRTtZQUNkLGFBQWE7UUFDZixDQUFDLENBQUM7S0FDSDtJQUVELE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFFN0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLGVBQWUsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUUxRSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFckIsT0FBTyxHQUFHLEVBQUU7UUFDVixLQUFLLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUMvQixTQUFTLEVBQUUsRUFBRSxDQUFDO1FBQ2QsU0FBUyxFQUFFLENBQUM7SUFDZCxDQUFDLENBQUM7QUFDSixDQUFDIn0=