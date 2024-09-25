import { ValueDispatcher } from '../../events';
/**
 * Manages time events during editing.
 */
export class EditableTimeEvents {
    get onChanged() {
        return this.events.subscribable;
    }
    constructor(scene) {
        this.scene = scene;
        this.events = new ValueDispatcher([]);
        this.registeredEvents = {};
        this.lookup = {};
        this.collisionLookup = new Set();
        this.previousReference = [];
        this.didEventsChange = false;
        this.preserveTiming = true;
        /**
         * Called when the parent scene gets reloaded.
         */
        this.handleReload = () => {
            this.registeredEvents = {};
            this.collisionLookup.clear();
        };
        /**
         * Called when the parent scene gets recalculated.
         */
        this.handleRecalculated = () => {
            this.preserveTiming = true;
            this.events.current = Object.values(this.registeredEvents);
            if (this.didEventsChange ||
                (this.previousReference?.length ?? 0) !== this.events.current.length) {
                this.didEventsChange = false;
                this.previousReference = Object.values(this.registeredEvents).map(event => ({
                    name: event.name,
                    targetTime: event.targetTime,
                }));
                this.scene.meta.timeEvents.set(this.previousReference);
            }
        };
        this.handleReset = () => {
            this.collisionLookup.clear();
        };
        /**
         * Called when the meta of the parent scene changes.
         */
        this.handleMetaChanged = (data) => {
            // Ignore the event if `timeEvents` hasn't changed.
            // This may happen when another part of metadata has changed triggering
            // this event.
            if (data === this.previousReference)
                return;
            this.previousReference = data;
            this.load(data);
            this.scene.reload();
        };
        this.previousReference = scene.meta.timeEvents.get();
        this.load(this.previousReference);
        scene.onReloaded.subscribe(this.handleReload);
        scene.onRecalculated.subscribe(this.handleRecalculated);
        scene.onReset.subscribe(this.handleReset);
        scene.meta.timeEvents.onChanged.subscribe(this.handleMetaChanged, false);
    }
    set(name, offset, preserve = true) {
        if (!this.lookup[name] || this.lookup[name].offset === offset) {
            return;
        }
        this.preserveTiming = preserve;
        this.lookup[name] = {
            ...this.lookup[name],
            targetTime: this.lookup[name].initialTime + offset,
            offset,
        };
        this.registeredEvents[name] = this.lookup[name];
        this.events.current = Object.values(this.registeredEvents);
        this.didEventsChange = true;
        this.scene.reload();
    }
    register(name, initialTime) {
        if (this.collisionLookup.has(name)) {
            this.scene.logger.error({
                message: `name "${name}" has already been used for another event name.`,
                stack: new Error().stack,
            });
            return 0;
        }
        this.collisionLookup.add(name);
        if (!this.lookup[name]) {
            this.didEventsChange = true;
            this.lookup[name] = {
                name,
                initialTime,
                targetTime: initialTime,
                offset: 0,
                stack: new Error().stack,
            };
        }
        else {
            let changed = false;
            const event = { ...this.lookup[name] };
            const stack = new Error().stack;
            if (event.stack !== stack) {
                event.stack = stack;
                changed = true;
            }
            if (event.initialTime !== initialTime) {
                event.initialTime = initialTime;
                changed = true;
            }
            const offset = Math.max(0, event.targetTime - event.initialTime);
            if (this.preserveTiming && event.offset !== offset) {
                event.offset = offset;
                changed = true;
            }
            const target = event.initialTime + event.offset;
            if (!this.preserveTiming && event.targetTime !== target) {
                this.didEventsChange = true;
                event.targetTime = target;
                changed = true;
            }
            if (changed) {
                this.lookup[name] = event;
            }
        }
        this.registeredEvents[name] = this.lookup[name];
        return this.lookup[name].offset;
    }
    load(events) {
        for (const event of events) {
            const previous = this.lookup[event.name] ?? {
                name: event.name,
                initialTime: 0,
                offset: 0,
            };
            this.lookup[event.name] = {
                ...previous,
                targetTime: event.targetTime,
            };
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRpdGFibGVUaW1lRXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NjZW5lcy90aW1lRXZlbnRzL0VkaXRhYmxlVGltZUV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTdDOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUNsQyxDQUFDO0lBVUQsWUFBb0MsS0FBWTtRQUFaLFVBQUssR0FBTCxLQUFLLENBQU87UUFUL0IsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFjLEVBQUUsQ0FBQyxDQUFDO1FBRXZELHFCQUFnQixHQUE4QixFQUFFLENBQUM7UUFDakQsV0FBTSxHQUE4QixFQUFFLENBQUM7UUFDdkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ3BDLHNCQUFpQixHQUEwQixFQUFFLENBQUM7UUFDOUMsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFxRjlCOztXQUVHO1FBQ0ssaUJBQVksR0FBRyxHQUFHLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQztRQUVGOztXQUVHO1FBQ0ssdUJBQWtCLEdBQUcsR0FBRyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFM0QsSUFDRSxJQUFJLENBQUMsZUFBZTtnQkFDcEIsQ0FBQyxJQUFJLENBQUMsaUJBQWlC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