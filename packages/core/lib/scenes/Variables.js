import { createSignal } from '../signals';
export class Variables {
    constructor(scene) {
        this.scene = scene;
        this.signals = {};
        this.variables = {};
        /**
         * Reset all stored signals.
         */
        this.handleReset = () => {
            this.signals = {};
        };
        scene.onReset.subscribe(this.handleReset);
    }
    /**
     * Get variable signal if exists or create signal if not
     *
     * @param name - The name of the variable.
     * @param initial - The initial value of the variable. It will be used if the
     *                  variable was not configured from the outside.
     */
    get(name, initial) {
        var _a;
        (_a = this.signals)[name] ?? (_a[name] = createSignal(this.variables[name] ?? initial));
        return () => this.signals[name]();
    }
    /**
     * Update all signals with new project variable values.
     */
    updateSignals(variables) {
        this.variables = variables;
        Object.keys(variables).map(variableName => {
            if (variableName in this.signals) {
                this.signals[variableName](variables[variableName]);
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFyaWFibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NjZW5lcy9WYXJpYWJsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFlBQVksRUFBZSxNQUFNLFlBQVksQ0FBQztBQUV0RCxNQUFNLE9BQU8sU0FBUztJQUlwQixZQUFvQyxLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQUh4QyxZQUFPLEdBQXVDLEVBQUUsQ0FBQztRQUNqRCxjQUFTLEdBQTRCLEVBQUUsQ0FBQztRQThCaEQ7O1dBRUc7UUFDSSxnQkFBVyxHQUFHLEdBQUcsRUFBRTtZQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUM7UUFoQ0EsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxHQUFHLENBQUksSUFBWSxFQUFFLE9BQVU7O1FBQ3BDLE1BQUEsSUFBSSxDQUFDLE9BQU8sRUFBQyxJQUFJLFNBQUosSUFBSSxJQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFDO1FBQ3JFLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxTQUFrQztRQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN4QyxJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBUUYifQ==