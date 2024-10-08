import { MetaField } from './MetaField';
import { PossibleVector2, Vector2 } from '../types';
/**
 * Represents a two-dimensional vector stored in a meta file.
 */
export declare class Vector2MetaField extends MetaField<PossibleVector2, Vector2> {
    readonly type: symbol;
    parse(value: PossibleVector2): Vector2;
    serialize(): PossibleVector2;
}
//# sourceMappingURL=Vector2MetaField.d.ts.map