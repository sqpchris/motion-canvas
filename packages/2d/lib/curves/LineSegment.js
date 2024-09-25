import { lineTo, moveTo } from '../utils';
import { Segment } from './Segment';
export class LineSegment extends Segment {
    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
        this.vector = to.sub(from);
        this.length = this.vector.magnitude;
        this.normal = this.vector.perpendicular.normalized.safe;
    }
    get arcLength() {
        return this.length;
    }
    draw(context, start = 0, end = 1, move = false) {
        const from = this.from.add(this.vector.scale(start));
        const to = this.from.add(this.vector.scale(end));
        if (move) {
            moveTo(context, from);
        }
        lineTo(context, to);
        return [
            {
                position: from,
                tangent: this.normal.flipped,
                normal: this.normal,
            },
            {
                position: to,
                tangent: this.normal,
                normal: this.normal,
            },
        ];
    }
    getPoint(distance) {
        const point = this.from.add(this.vector.scale(distance));
        return {
            position: point,
            tangent: this.normal.flipped,
            normal: this.normal,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZVNlZ21lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3VydmVzL0xpbmVTZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFHbEMsTUFBTSxPQUFPLFdBQVksU0FBUSxPQUFPO0lBS3RDLFlBQTJCLElBQWEsRUFBVSxFQUFXO1FBQzNELEtBQUssRUFBRSxDQUFDO1FBRGlCLFNBQUksR0FBSixJQUFJLENBQVM7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFTO1FBRTNELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRU0sSUFBSSxDQUNULE9BQTBDLEVBQzFDLEtBQUssR0FBRyxDQUFDLEVBQ1QsR0FBRyxHQUFHLENBQUMsRUFDUCxJQUFJLEdBQUcsS0FBSztRQUVaLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLElBQUksRUFBRTtZQUNSLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdkI7UUFDRCxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXBCLE9BQU87WUFDTDtnQkFDRSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEI7WUFDRDtnQkFDRSxRQUFRLEVBQUUsRUFBRTtnQkFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUNwQjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sUUFBUSxDQUFDLFFBQWdCO1FBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDekQsT0FBTztZQUNMLFFBQVEsRUFBRSxLQUFLO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztZQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztJQUNKLENBQUM7Q0FDRiJ9