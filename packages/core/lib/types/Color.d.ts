import { Color } from 'chroma-js';
import type { Type } from './Type';
import type { InterpolationFunction } from '../tweening';
import { Signal, SignalValue } from '../signals';
export type SerializedColor = string;
export type PossibleColor = SerializedColor | number | Color | {
    r: number;
    g: number;
    b: number;
    a: number;
};
export type ColorSignal<T> = Signal<PossibleColor, Color, T>;
declare module 'chroma-js' {
    interface Color extends Type {
        serialize(): string;
        lerp(to: ColorInterface | string, value: number, colorSpace?: ColorSpace): ColorInterface;
    }
    type ColorInterface = import('chroma-js').Color;
    type ColorSpace = import('chroma-js').InterpolationMode;
    interface ColorStatic {
        symbol: symbol;
        lerp(from: ColorInterface | string | null, to: ColorInterface | string | null, value: number, colorSpace?: ColorSpace): ColorInterface;
        createLerp(colorSpace: ColorSpace): InterpolationFunction<ColorInterface>;
        createSignal(initial?: SignalValue<PossibleColor>, interpolation?: InterpolationFunction<ColorInterface>): ColorSignal<void>;
    }
    interface ChromaStatic {
        Color: ColorStatic & (new (color: PossibleColor) => ColorInterface);
    }
}
type ExtendedColor = Color;
declare const ExtendedColor: typeof Color;
export { ExtendedColor as Color };
//# sourceMappingURL=Color.d.ts.map