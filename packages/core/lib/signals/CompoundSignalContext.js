import { map } from '../tweening';
import { SignalContext } from './SignalContext';
import { isReactive, modify } from './utils';
export class CompoundSignalContext extends SignalContext {
    constructor(entries, parser, initial, interpolation, owner = undefined, extensions = {}) {
        var _a;
        super(undefined, interpolation, owner, parser, extensions);
        this.entries = entries;
        this.signals = [];
        this.parser = parser;
        for (const entry of entries) {
            let key;
            let signal;
            if (Array.isArray(entry)) {
                [key, signal] = entry;
                (_a = signal.context).owner ?? (_a.owner = this);
            }
            else {
                key = entry;
                signal = new SignalContext(modify(initial, value => parser(value)[entry]), map, owner ?? this.invokable).toSignal();
            }
            this.signals.push([key, signal]);
            Object.defineProperty(this.invokable, key, { value: signal });
        }
    }
    toSignal() {
        return this.invokable;
    }
    parse(value) {
        return this.parser(value);
    }
    getter() {
        return this.parse((Object.fromEntries(this.signals.map(([key, property]) => [key, property()]))));
    }
    setter(value) {
        if (isReactive(value)) {
            for (const [key, property] of this.signals) {
                property(() => this.parser(value())[key]);
            }
        }
        else {
            const parsed = this.parse(value);
            for (const [key, property] of this.signals) {
                property(parsed[key]);
            }
        }
        return this.owner;
    }
    reset() {
        for (const [, signal] of this.signals) {
            signal.reset();
        }
        return this.owner;
    }
    save() {
        for (const [, signal] of this.signals) {
            signal.save();
        }
        return this.owner;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG91bmRTaWduYWxDb250ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NpZ25hbHMvQ29tcG91bmRTaWduYWxDb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBd0IsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3ZELE9BQU8sRUFBUyxhQUFhLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLFNBQVMsQ0FBQztBQWtCM0MsTUFBTSxPQUFPLHFCQUtYLFNBQVEsYUFBMkM7SUFHbkQsWUFDbUIsT0FHZCxFQUNILE1BQXVDLEVBQ3ZDLE9BQWtDLEVBQ2xDLGFBQTRDLEVBQzVDLFFBQWtDLFNBQVUsRUFDNUMsYUFBOEQsRUFBRTs7UUFFaEUsS0FBSyxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQVYxQyxZQUFPLEdBQVAsT0FBTyxDQUdyQjtRQU5XLFlBQU8sR0FBK0MsRUFBRSxDQUFDO1FBY3ZFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLEtBQUssTUFBTSxLQUFLLElBQUksT0FBTyxFQUFFO1lBQzNCLElBQUksR0FBaUIsQ0FBQztZQUN0QixJQUFJLE1BQWdDLENBQUM7WUFDckMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLE1BQUMsTUFBTSxDQUFDLE9BQWUsRUFBQyxLQUFLLFFBQUwsS0FBSyxHQUFLLElBQUksRUFBQzthQUN4QztpQkFBTTtnQkFDTCxHQUFHLEdBQUcsS0FBSyxDQUFDO2dCQUNaLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FDeEIsTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN6QyxHQUFHLEVBQ1IsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQ3hCLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDZDtZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1NBQzdEO0lBQ0gsQ0FBQztJQUVlLFFBQVE7UUFNdEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFZSxLQUFLLENBQUMsS0FBbUI7UUFDdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFZSxNQUFNO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FDRCxDQUNaLE1BQU0sQ0FBQyxXQUFXLENBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FDekQsQ0FDRixDQUNGLENBQUM7SUFDSixDQUFDO0lBRWUsTUFBTSxDQUFDLEtBQTBCO1FBQy9DLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUMxQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDM0M7U0FDRjthQUFNO1lBQ0wsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDMUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVlLEtBQUs7UUFDbkIsS0FBSyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3JDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNoQjtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRWUsSUFBSTtRQUNsQixLQUFLLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDckMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztDQUNGIn0=