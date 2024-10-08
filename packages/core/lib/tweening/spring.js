import { decorate, threadable } from '../decorators';
import { useThread, useLogger } from '../utils';
decorate(spring, threadable());
export function* spring(spring, from, to, settleToleranceOrOnProgress, onProgressOrOnEnd, onEnd) {
    const settleTolerance = typeof settleToleranceOrOnProgress === 'number'
        ? settleToleranceOrOnProgress
        : 0.001;
    onEnd =
        typeof settleToleranceOrOnProgress === 'number' ? onEnd : onProgressOrOnEnd;
    const onProgress = (value, time) => {
        if (typeof settleToleranceOrOnProgress === 'function') {
            settleToleranceOrOnProgress(value, time);
        }
        else if (typeof onProgressOrOnEnd === 'function') {
            onProgressOrOnEnd(value, time);
        }
    };
    spring = spring ?? {
        mass: 0.05,
        stiffness: 10,
        damping: 0.5,
    };
    if (spring.mass <= 0) {
        useLogger().error(new Error('Spring mass must be greater than 0.'));
        return;
    }
    if (spring.stiffness < 0) {
        useLogger().error(new Error('Spring stiffness must be greater or equal to 0.'));
        return;
    }
    if (spring.damping < 0) {
        useLogger().error(new Error('Spring damping must be greater or equal to 0.'));
        return;
    }
    const thread = useThread();
    let position = from;
    let velocity = spring.initialVelocity ?? 0;
    const update = (dt) => {
        if (spring === null) {
            return;
        }
        const positionDelta = position - to;
        // Using hooks law: F=-kx; with k being the spring constant and x the offset
        // to the settling position
        const force = -spring.stiffness * positionDelta - spring.damping * velocity;
        // Update the velocity based on the given timestep
        velocity += (force / spring.mass) * dt;
        position += velocity * dt;
    };
    // Set simulation constant framerate
    const simulationFrames = 120;
    // Calculate a timestep based on on the simulation framerate
    const timeStep = 1 / simulationFrames;
    onProgress(from, 0);
    const startTime = thread.time();
    let simulationTime = startTime;
    let settled = false;
    while (!settled) {
        while (simulationTime < thread.fixed) {
            const difference = thread.fixed - simulationTime;
            if (timeStep > difference) {
                update(difference);
                simulationTime = thread.fixed;
            }
            else {
                update(timeStep);
                simulationTime += timeStep;
            }
            // Perform the check during every iteration:
            if (Math.abs(to - position) < settleTolerance &&
                Math.abs(velocity) < settleTolerance) {
                // Set the thread time to simulation time:
                thread.time(simulationTime);
                settled = true;
                // Break out when settled
                break;
            }
        }
        // Only yield if we haven't settled yet.
        if (!settled) {
            onProgress(position, thread.fixed - startTime);
            yield;
        }
    }
    onProgress(to, thread.fixed - startTime);
    onEnd?.(to, thread.fixed - startTime);
}
export function makeSpring(mass, stiffness, damping, initialVelocity) {
    return {
        mass,
        stiffness,
        damping,
        initialVelocity,
    };
}
export const BeatSpring = makeSpring(0.13, 5.7, 1.2, 10.0);
export const PlopSpring = makeSpring(0.2, 20.0, 0.68, 0.0);
export const BounceSpring = makeSpring(0.08, 4.75, 0.05, 0.0);
export const SwingSpring = makeSpring(0.39, 19.85, 2.82, 0.0);
export const JumpSpring = makeSpring(0.04, 10.0, 0.7, 8.0);
export const StrikeSpring = makeSpring(0.03, 20.0, 0.9, 4.8);
export const SmoothSpring = makeSpring(0.16, 15.35, 1.88, 0.0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ByaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R3ZWVuaW5nL3NwcmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUk5QyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFrQi9CLE1BQU0sU0FBUyxDQUFDLENBQUMsTUFBTSxDQUNyQixNQUFxQixFQUNyQixJQUFZLEVBQ1osRUFBVSxFQUNWLDJCQUFzRCxFQUN0RCxpQkFBb0MsRUFDcEMsS0FBd0I7SUFFeEIsTUFBTSxlQUFlLEdBQ25CLE9BQU8sMkJBQTJCLEtBQUssUUFBUTtRQUM3QyxDQUFDLENBQUMsMkJBQTJCO1FBQzdCLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFFWixLQUFLO1FBQ0gsT0FBTywyQkFBMkIsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7SUFFOUUsTUFBTSxVQUFVLEdBQXFCLENBQUMsS0FBYSxFQUFFLElBQVksRUFBRSxFQUFFO1FBQ25FLElBQUksT0FBTywyQkFBMkIsS0FBSyxVQUFVLEVBQUU7WUFDckQsMkJBQTJCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxPQUFPLGlCQUFpQixLQUFLLFVBQVUsRUFBRTtZQUNsRCxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDaEM7SUFDSCxDQUFDLENBQUM7SUFFRixNQUFNLEdBQUcsTUFBTSxJQUFJO1FBQ2pCLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsR0FBRztLQUNiLENBQUM7SUFFRixJQUFJLE1BQU0sQ0FBQyxJQUFJ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