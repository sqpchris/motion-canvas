var _a;
import { BoolMetaField, EnumMetaField, NumberMetaField, ObjectMetaField, } from '../meta';
import { clamp } from '../tweening';
import { FileTypes } from './presets';
import { EventDispatcher } from '../events';
const EXPORT_FRAME_LIMIT = 256;
const EXPORT_RETRY_DELAY = 1000;
/**
 * Image sequence exporter.
 *
 * @internal
 */
export class ImageExporter {
    static meta() {
        const meta = new ObjectMetaField(this.name, {
            fileType: new EnumMetaField('file type', FileTypes),
            quality: new NumberMetaField('quality', 100)
                .setRange(0, 100)
                .describe('A number between 0 and 100 indicating the image quality.'),
            groupByScene: new BoolMetaField('group by scene', false).describe('Group exported images by scene. When checked, separates the sequence into subdirectories for each scene in the project.'),
        });
        meta.fileType.onChanged.subscribe(value => {
            meta.quality.disable(value === 'image/png');
        });
        return meta;
    }
    static async create(project, settings) {
        return new ImageExporter(project.logger, settings);
    }
    constructor(logger, settings) {
        this.logger = logger;
        this.settings = settings;
        this.frameLookup = new Set();
        this.handleResponse = ({ frame }) => {
            this.frameLookup.delete(frame);
        };
        const options = settings.exporter.options;
        this.projectName = settings.name;
        this.quality = clamp(0, 1, options.quality / 100);
        this.fileType = options.fileType;
        this.groupByScene = options.groupByScene;
    }
    async start() {
        ImageExporter.response.subscribe(this.handleResponse);
    }
    async handleFrame(canvas, frame, sceneFrame, sceneName, signal) {
        if (this.frameLookup.has(frame)) {
            this.logger.warn(`Frame no. ${frame} is already being exported.`);
            return;
        }
        if (import.meta.hot) {
            while (this.frameLookup.size > EXPORT_FRAME_LIMIT) {
                await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
                if (signal.aborted) {
                    return;
                }
            }
            this.frameLookup.add(frame);
            import.meta.hot.send('motion-canvas:export', {
                frame,
                sceneFrame,
                data: canvas.toDataURL(this.fileType, this.quality),
                mimeType: this.fileType,
                subDirectories: this.groupByScene
                    ? [this.projectName, sceneName]
                    : [this.projectName],
                groupByScene: this.groupByScene,
            });
        }
    }
    async stop() {
        while (this.frameLookup.size > 0) {
            await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
        }
        ImageExporter.response.unsubscribe(this.handleResponse);
    }
}
_a = ImageExporter;
ImageExporter.id = '@motion-canvas/core/image-sequence';
ImageExporter.displayName = 'Image sequence';
ImageExporter.response = new EventDispatcher();
(() => {
    if (import.meta.hot) {
        import.meta.hot.on('motion-canvas:export-ack', response => {
            _a.response.dispatch(response);
        });
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1hZ2VFeHBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAvSW1hZ2VFeHBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBS0EsT0FBTyxFQUNMLGFBQWEsRUFDYixhQUFhLEVBQ2IsZUFBZSxFQUNmLGVBQWUsR0FFaEIsTUFBTSxTQUFTLENBQUM7QUFDakIsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFMUMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDL0IsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUM7QUFRaEM7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBSWpCLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDMUMsUUFBUSxFQUFFLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUM7WUFDbkQsT0FBTyxFQUFFLElBQUksZUFBZSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7aUJBQ3pDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO2lCQUNoQixRQUFRLENBQUMsMERBQTBELENBQUM7WUFDdkUsWUFBWSxFQUFFLElBQUksYUFBYSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FDL0QseUhBQXlILENBQzFIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FB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