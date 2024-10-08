import { MetaField } from './MetaField';
import { Vector2 } from '../types';
/**
 * Represents a two-dimensional vector stored in a meta file.
 */
export class Vector2MetaField extends MetaField {
    constructor() {
        super(...arguments);
        this.type = Vector2.symbol;
    }
    parse(value) {
        return new Vector2(value);
    }
    serialize() {
        return this.value.current.serialize();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVjdG9yMk1ldGFGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tZXRhL1ZlY3RvcjJNZXRhRmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN0QyxPQUFPLEVBQWtCLE9BQU8sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUVsRDs7R0FFRztBQUNILE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxTQUFtQztJQUF6RTs7UUFDa0IsU0FBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFTeEMsQ0FBQztJQVBpQixLQUFLLENBQUMsS0FBc0I7UUFDMUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRWUsU0FBUztRQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3hDLENBQUM7Q0FDRiJ9