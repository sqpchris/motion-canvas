import { MetaField } from './MetaField';
import { EPSILON } from '../types';
import { clamp } from '../tweening';
/**
 * Represents a range stored in a meta file.
 *
 * @remarks
 * Range is an array with two elements denoting the beginning and end of a
 * range, respectively.
 */
export class RangeMetaField extends MetaField {
    constructor() {
        super(...arguments);
        this.type = RangeMetaField.symbol;
    }
    parse(value) {
        return this.parseRange(Infinity, value[0], value[1] ?? Infinity);
    }
    /**
     * Convert the given range from frames to seconds and update this field.
     *
     * @remarks
     * This helper method applies additional validation to the range, preventing
     * it from overflowing the timeline.
     *
     * @param startFrame - The beginning of the range.
     * @param endFrame - The end of the range.
     * @param duration - The current duration in frames.
     * @param fps - The current framerate.
     */
    update(startFrame, endFrame, duration, fps) {
        this.value.current = this.parseRange(duration / fps - EPSILON, startFrame / fps - EPSILON, endFrame / fps - EPSILON);
    }
    parseRange(duration, startFrame = this.value.current[0], endFrame = this.value.current[1]) {
        startFrame = clamp(0, duration, startFrame);
        endFrame = clamp(0, duration, endFrame ?? Infinity);
        if (startFrame > endFrame) {
            [startFrame, endFrame] = [endFrame, startFrame];
        }
        if (endFrame >= duration) {
            endFrame = Infinity;
        }
        return [startFrame, endFrame];
    }
}
RangeMetaField.symbol = Symbol.for('@motion-canvas/core/meta/RangeMetaField');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFuZ2VNZXRhRmllbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWV0YS9SYW5nZU1ldGFGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDakMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQU8sY0FBZSxTQUFRLFNBR25DO0lBSEQ7O1FBT2tCLFNBQUksR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBaUQvQyxDQUFDO0lBL0NpQixLQUFLLENBQUMsS0FBOEI7UUFDbEQsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNJLE1BQU0sQ0FDWCxVQUFrQixFQUNsQixRQUFnQixFQUNoQixRQUFnQixFQUNoQixHQUFXO1FBRVgsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FDbEMsUUFBUSxHQUFHLEdBQUcsR0FBRyxPQUFPLEVBQ3hCLFVBQVUsR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUMxQixRQUFRLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FDekIsQ0FBQztJQUNKLENBQUM7SUFFUyxVQUFVLENBQ2xCLFFBQWdCLEVBQ2hCLGFBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUMxQyxXQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFeEMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLElBQUksUUFBUSxDQUFDLENBQUM7UUFFcEQsSUFBSSxVQUFVLEdBQUcsUUFBUSxFQUFFO1lBQ3pCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsSUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO1lBQ3hCLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDckI7UUFFRCxPQUFPLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7O0FBbkRzQixxQkFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQ3hDLHlDQUF5QyxDQUMxQyxDQUFDIn0=