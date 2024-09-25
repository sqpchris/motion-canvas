/**
 * Transition to the current scene by altering the Context2D before scenes are rendered.
 *
 * @param current - The callback to use before the current scene is rendered.
 * @param previous - The callback to use before the previous scene is rendered.
 */
export declare function useTransition(current: (ctx: CanvasRenderingContext2D) => void, previous?: (ctx: CanvasRenderingContext2D) => void): () => void;
//# sourceMappingURL=useTransition.d.ts.map