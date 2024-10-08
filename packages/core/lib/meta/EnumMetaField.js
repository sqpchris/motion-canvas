import { MetaField } from './MetaField';
/**
 * Represents an enum value stored in a meta file.
 */
export class EnumMetaField extends MetaField {
    constructor(name, options, initial = options[0].value) {
        super(name, initial);
        this.options = options;
        this.type = EnumMetaField.symbol;
    }
    set(value) {
        super.set(this.getOption(value).value);
    }
    parse(value) {
        return this.getOption(value).value;
    }
    getOption(value) {
        return (this.options.find(option => option.value === value) ?? this.options[0]);
    }
}
EnumMetaField.symbol = Symbol.for('@motion-canvas/core/meta/EnumMetaField');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW51bU1ldGFGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tZXRhL0VudW1NZXRhRmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUd0Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFpQixTQUFRLFNBQVk7SUFNaEQsWUFDRSxJQUFZLEVBQ0ksT0FBd0IsRUFDeEMsVUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztRQUU3QixLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBSEwsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFKMUIsU0FBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFRNUMsQ0FBQztJQUVNLEdBQUcsQ0FBQyxLQUFRO1FBQ2pCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQVE7UUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNyQyxDQUFDO0lBRU0sU0FBUyxDQUFDLEtBQVE7UUFDdkIsT0FBTyxDQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUN2RSxDQUFDO0lBQ0osQ0FBQzs7QUF6QnNCLG9CQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FDeEMsd0NBQXdDLENBQ3pDLENBQUMifQ==