import { MetaField, ObjectMetaField } from '../meta';
import { Random } from './Random';
/**
 * Create a runtime representation of the scene metadata.
 */
export function createSceneMetadata() {
    return new ObjectMetaField('scene', {
        version: new MetaField('version', 1),
        timeEvents: new MetaField('time events', []),
        seed: new MetaField('seed', Random.createSeed()),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NlbmVNZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2VuZXMvU2NlbmVNZXRhZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLGVBQWUsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUVuRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWhDOztHQUVHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQjtJQUNqQyxPQUFPLElBQUksZUFBZSxDQUFDLE9BQU8sRUFBRTtRQUNsQyxPQUFPLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNwQyxVQUFVLEVBQUUsSUFBSSxTQUFTLENBQXdCLGFBQWEsRUFBRSxFQUFFLENBQUM7UUFDbkUsSUFBSSxFQUFFLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDakQsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9