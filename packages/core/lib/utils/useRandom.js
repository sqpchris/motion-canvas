import { useScene } from './useScene';
import { Random } from '../scenes';
export function useRandom(seed, fixed = true) {
    return typeof seed === 'number'
        ? new Random(fixed ? seed : seed + useScene().meta.seed.get())
        : useScene().random;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlUmFuZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3VzZVJhbmRvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFjakMsTUFBTSxVQUFVLFNBQVMsQ0FBQyxJQUFhLEVBQUUsS0FBSyxHQUFHLElBQUk7SUFDbkQsT0FBTyxPQUFPLElBQUksS0FBSyxRQUFRO1FBQzdCLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUQsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUN4QixDQUFDIn0=