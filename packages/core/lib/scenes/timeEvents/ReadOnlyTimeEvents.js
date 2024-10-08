import { ValueDispatcher } from '../../events';
/**
 * Manages time events during rendering and presentation.
 */
export class ReadOnlyTimeEvents {
    get onChanged() {
        return this.events.subscribable;
    }
    constructor(scene) {
        this.scene = scene;
        this.events = new ValueDispatcher([]);
        this.lookup = new Map();
        /**
         * Called when the parent scene gets reloaded.
         */
        this.handleReload = () => {
            this.lookup.clear();
        };
        scene.onReloaded.subscribe(this.handleReload);
    }
    set() {
        // do nothing
    }
    register(name, initialTime) {
        let duration = this.lookup.get(name);
        if (duration === undefined) {
            const event = this.scene.meta.timeEvents
                .get()
                .find(event => event.name === name);
            duration = event ? event.targetTime - initialTime : 0;
            this.lookup.set(name, duration);
        }
        return duration;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhZE9ubHlUaW1lRXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NjZW5lcy90aW1lRXZlbnRzL1JlYWRPbmx5VGltZUV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTdDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUNsQyxDQUFDO0lBSUQsWUFBb0MsS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUFIL0IsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQXVCM0M7O1dBRUc7UUFDSyxpQkFBWSxHQUFHLEdBQUcsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQXpCQSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLEdBQUc7UUFDUixhQUFhO0lBQ2YsQ0FBQztJQUVNLFFBQVEsQ0FBQyxJQUFZLEVBQUUsV0FBbUI7UUFDL0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7aUJBQ3JDLEdBQUcsRUFBRTtpQkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ3RDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQVFGIn0=