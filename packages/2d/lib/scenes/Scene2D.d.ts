import { FullSceneDescription, GeneratorScene, Inspectable, InspectedAttributes, InspectedElement, Scene, ThreadGeneratorFactory } from '@motion-canvas/core/lib/scenes';
import { Node, View2D } from '../components';
export declare class Scene2D extends GeneratorScene<View2D> implements Inspectable {
    private view;
    private registeredNodes;
    private nodeCounters;
    private assetHash;
    constructor(description: FullSceneDescription<ThreadGeneratorFactory<View2D>>);
    getView(): View2D;
    next(): Promise<void>;
    draw(context: CanvasRenderingContext2D): void;
    reset(previousScene?: Scene): Promise<void>;
    inspectPosition(x: number, y: number): InspectedElement | null;
    validateInspection(element: InspectedElement | null): InspectedElement | null;
    inspectAttributes(element: InspectedElement): InspectedAttributes | null;
    drawOverlay(element: InspectedElement, matrix: DOMMatrix, context: CanvasRenderingContext2D): void;
    registerNode(node: Node, key?: string): string;
    getNode(key: any): Node | null;
    protected recreateView(): void;
}
//# sourceMappingURL=Scene2D.d.ts.map