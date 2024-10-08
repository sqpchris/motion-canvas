import { MetaField } from './MetaField';
/**
 * Represents a number stored in a meta file.
 */
export class NumberMetaField extends MetaField {
    constructor() {
        super(...arguments);
        this.type = Number;
        this.presets = [];
    }
    parse(value) {
        let parsed = parseFloat(value);
        if (this.min !== undefined && parsed < this.min) {
            parsed = this.min;
        }
        if (this.max !== undefined && parsed > this.max) {
            parsed = this.max;
        }
        return parsed;
    }
    getPresets() {
        return this.presets;
    }
    setPresets(options) {
        this.presets = options;
        return this;
    }
    setRange(min, max) {
        this.min = min;
        this.max = max;
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnVtYmVyTWV0YUZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21ldGEvTnVtYmVyTWV0YUZpZWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFHdEM7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxTQUFzQjtJQUEzRDs7UUFDa0IsU0FBSSxHQUFHLE1BQU0sQ0FBQztRQUNwQixZQUFPLEdBQXlCLEVBQUUsQ0FBQztJQThCL0MsQ0FBQztJQTFCUSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMvQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNuQjtRQUNELElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDL0MsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDbkI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sVUFBVTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRU0sVUFBVSxDQUFDLE9BQTZCO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFFBQVEsQ0FBQyxHQUFZLEVBQUUsR0FBWTtRQUN4QyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0YifQ==