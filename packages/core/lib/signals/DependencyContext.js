import { FlagDispatcher } from '../events';
import { DetailedError } from '../utils';
export class DependencyContext {
    static collectPromise(promise, initialValue = null) {
        const handle = {
            promise,
            value: initialValue,
            stack: new Error().stack,
        };
        const context = this.collectionStack.at(-1);
        if (context) {
            handle.owner = context.owner;
        }
        promise.then(value => {
            handle.value = value;
            context?.markDirty();
        });
        this.promises.push(handle);
        return handle;
    }
    static hasPromises() {
        return this.promises.length > 0;
    }
    static async consumePromises() {
        const promises = [...this.promises];
        await Promise.all(promises.map(handle => handle.promise));
        this.promises = this.promises.filter(v => !promises.includes(v));
        return promises;
    }
    constructor(owner) {
        this.owner = owner;
        this.dependencies = new Set();
        this.event = new FlagDispatcher();
        this.markDirty = () => this.event.raise();
        this.invokable = this.invoke.bind(this);
        Object.defineProperty(this.invokable, 'context', {
            value: this,
        });
        Object.defineProperty(this.invokable, 'toPromise', {
            value: this.toPromise.bind(this),
        });
    }
    invoke() {
        // do nothing
    }
    startCollecting() {
        if (DependencyContext.collectionSet.has(this)) {
            throw new DetailedError('A circular dependency occurred between signals.', `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
        }
        DependencyContext.collectionSet.add(this);
        DependencyContext.collectionStack.push(this);
    }
    finishCollecting() {
        DependencyContext.collectionSet.delete(this);
        if (DependencyContext.collectionStack.pop() !== this) {
            throw new Error('collectStart/collectEnd was called out of order.');
        }
    }
    clearDependencies() {
        this.dependencies.forEach(dep => dep.unsubscribe(this.markDirty));
        this.dependencies.clear();
    }
    collect() {
        const signal = DependencyContext.collectionStack.at(-1);
        if (signal) {
            signal.dependencies.add(this.event.subscribable);
            this.event.subscribe(signal.markDirty);
        }
    }
    dispose() {
        this.clearDependencies();
        this.event.clear();
        this.owner = null;
    }
    async toPromise() {
        do {
            await DependencyContext.consumePromises();
            this.invokable();
        } while (DependencyContext.hasPromises());
        return this.invokable;
    }
}
DependencyContext.collectionSet = new Set();
DependencyContext.collectionStack = [];
DependencyContext.promises = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVwZW5kZW5jeUNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2lnbmFscy9EZXBlbmRlbmN5Q29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sV0FBVyxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFVdkMsTUFBTSxPQUFPLGlCQUFpQjtJQVlyQixNQUFNLENBQUMsY0FBYyxDQUMxQixPQUFtQixFQUNuQixlQUF5QixJQUFJO1FBRTdCLE1BQU0sTUFBTSxHQUE0QjtZQUN0QyxPQUFPO1lBQ1AsS0FBSyxFQUFFLFlBQVk7WUFDbkIsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSztTQUN6QixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztTQUM5QjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDckIsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWU7UUFDakMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxR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