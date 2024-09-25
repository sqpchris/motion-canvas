import { Img, ImgProps } from './Img';
import { SignalValue, SimpleSignal } from '@motion-canvas/core/lib/signals';
import { OptionList } from 'mathjax-full/js/util/Options';
export interface LatexProps extends ImgProps {
    tex?: SignalValue<string>;
    renderProps?: SignalValue<OptionList>;
}
export declare class Latex extends Img {
    private static svgContentsPool;
    private readonly imageElement;
    readonly options: SimpleSignal<OptionList, this>;
    readonly tex: SimpleSignal<string, this>;
    constructor(props: LatexProps);
    protected image(): HTMLImageElement;
}
//# sourceMappingURL=Latex.d.ts.map