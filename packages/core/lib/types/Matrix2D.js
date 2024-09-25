import { EPSILON } from './Type';
import { Vector2 } from './Vector';
import { DEG2RAD } from '../utils';
/**
 * A specialized 2x3 Matrix representing a 2D transformation.
 *
 * A Matrix2D contains six elements defined as
 * [a, b,
 *  c, d,
 *  tx, ty]
 *
 * This is a shortcut for a 3x3 matrix of the form
 * [a, b, 0,
 *  c, d, 0
 *  tx, ty, 1]
 *
 * Note that because a Matrix2D ignores the z-values of each component vectors,
 * it does not satisfy all properties of a "real" 3x3 matrix.
 *
 *   - A Matrix2D has no transpose
 *   - A(B + C) = AB + AC does not hold for a Matrix2D
 *   - (rA)^-1 = r^-1 A^-1, r != 0 does not hold for a Matrix2D
 *   - r(AB) = (rA)B = A(rB) does not hold for a Matrix2D
 */
export class Matrix2D {
    static fromRotation(angle) {
        return Matrix2D.identity.rotate(angle);
    }
    static fromTranslation(translation) {
        return Matrix2D.identity.translate(new Vector2(translation));
    }
    static fromScaling(scale) {
        return Matrix2D.identity.scale(new Vector2(scale));
    }
    get x() {
        return new Vector2(this.values[0], this.values[1]);
    }
    get y() {
        return new Vector2(this.values[2], this.values[3]);
    }
    get scaleX() {
        return this.values[0];
    }
    set scaleX(value) {
        this.values[0] = this.x.normalized.scale(value).x;
    }
    set scaleY(value) {
        this.values[3] = this.y.normalized.scale(value).y;
    }
    get scaleY() {
        return this.values[3];
    }
    set translateX(value) {
        this.values[4] = value;
    }
    get translateX() {
        return this.values[4];
    }
    set translateY(value) {
        this.values[5] = value;
    }
    get translateY() {
        return this.values[5];
    }
    set rotation(angle) {
        const result = this.rotate(angle - this.rotation);
        this.values[0] = result.values[0];
        this.values[1] = result.values[1];
        this.values[2] = result.values[2];
        this.values[3] = result.values[3];
    }
    get rotation() {
        return Vector2.degrees(this.values[0], this.values[1]);
    }
    set translation(translation) {
        const vec = new Vector2(translation);
        this.values[4] = vec.x;
        this.values[5] = vec.y;
    }
    get translation() {
        return new Vector2(this.values[4], this.values[5]);
    }
    set scaling(value) {
        const scale = new Vector2(value);
        const x = new Vector2(this.values[0], this.values[1]).normalized;
        const y = new Vector2(this.values[2], this.values[3]).normalized;
        this.values[0] = x.x * scale.x;
        this.values[1] = x.y * scale.y;
        this.values[2] = y.x * scale.x;
        this.values[3] = y.y * scale.y;
    }
    get scaling() {
        return new Vector2(this.values[0], this.values[3]);
    }
    /**
     * Get the inverse of the matrix.
     *
     * @remarks
     * If the matrix is not invertible, i.e. its determinant is `0`, this will
     * return `null`, instead.
     *
     * @example
     * ```ts
     * const matrix = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     *
     * const inverse = matrix.inverse;
     * // => Matrix2D(
     * //      [-2, 1],
     * //      [1.5, -0.5],
     * //      [1, -2],
     * //   )
     * ```
     */
    get inverse() {
        const aa = this.values[0], ab = this.values[1], ac = this.values[2], ad = this.values[3];
        const atx = this.values[4], aty = this.values[5];
        let det = aa * ad - ab * ac;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        return new Matrix2D(ad * det, -ab * det, -ac * det, aa * det, (ac * aty - ad * atx) * det, (ab * atx - aa * aty) * det);
    }
    /**
     * Get the determinant of the matrix.
     */
    get determinant() {
        return this.values[0] * this.values[3] - this.values[1] * this.values[2];
    }
    get domMatrix() {
        return new DOMMatrix([
            this.values[0],
            this.values[1],
            this.values[2],
            this.values[3],
            this.values[4],
            this.values[5],
        ]);
    }
    constructor(a, b, c, d, tx, ty) {
        this.values = new Float32Array(6);
        if (arguments.length === 0) {
            this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
            return;
        }
        if (arguments.length === 6) {
            this.values[0] = a;
            this.values[1] = b;
            this.values[2] = c;
            this.values[3] = d;
            this.values[4] = tx;
            this.values[5] = ty;
            return;
        }
        if (a instanceof Matrix2D) {
            this.values = a.values;
            return;
        }
        if (Array.isArray(a)) {
            if (a.length === 2) {
                this.values[0] = a[0];
                this.values[1] = a[1];
                this.values[2] = b[0];
                this.values[3] = b[1];
                this.values[4] = c[0];
                this.values[5] = c[1];
                return;
            }
            if (a.length === 3) {
                const x = new Vector2(a[0]);
                const y = new Vector2(a[1]);
                const z = new Vector2(a[2]);
                this.values[0] = x.x;
                this.values[1] = x.y;
                this.values[2] = y.x;
                this.values[3] = y.y;
                this.values[4] = z.x;
                this.values[5] = z.y;
                return;
            }
            this.values[0] = a[0];
            this.values[1] = a[1];
            this.values[2] = a[2];
            this.values[3] = a[3];
            this.values[4] = a[4];
            this.values[5] = a[5];
            return;
        }
        const x = new Vector2(a);
        const y = new Vector2(b);
        const z = new Vector2(c);
        this.values[0] = x.x;
        this.values[1] = x.y;
        this.values[2] = y.x;
        this.values[3] = y.y;
        this.values[4] = z.x;
        this.values[5] = z.y;
    }
    /**
     * Get the nth component vector of the matrix. Only defined for 0, 1, and 2.
     *
     * @example
     * ```ts
     * const matrix = new Matrix2D(
     *   [1, 0],
     *   [0, 0],
     *   [1, 0],
     * );
     *
     * const x = matrix.column(0);
     * // Vector2(1, 0)
     *
     * const y = matrix.column(1);
     * // Vector2(0, 0)
     *
     * const z = matrix.column(1);
     * // Vector2(1, 0)
     * ```
     *
     * @param index - The index of the component vector to retrieve.
     */
    column(index) {
        return new Vector2(this.values[index * 2], this.values[index * 2 + 1]);
    }
    /**
     * Returns the nth row of the matrix. Only defined for 0 and 1.
     *
     * @example
     * ```ts
     * const matrix = new Matrix2D(
     *   [1, 0],
     *   [0, 0],
     *   [1, 0],
     * );
     *
     * const firstRow = matrix.column(0);
     * // [1, 0, 1]
     *
     * const secondRow = matrix.column(1);
     * // [0, 0, 0]
     * ```
     *
     * @param index - The index of the row to retrieve.
     */
    row(index) {
        return [this.values[index], this.values[index + 2], this.values[index + 4]];
    }
    /**
     * Returns the matrix product of this matrix with the provided matrix.
     *
     * @remarks
     * This method returns a new matrix representing the result of the
     * computation. It will not modify the source matrix.
     *
     * @example
     * ```ts
     * const a = new Matrix2D(
     *   [1, 2],
     *   [0, 1],
     *   [1, 1],
     * );
     * const b = new Matrix2D(
     *   [2, 1],
     *   [1, 1],
     *   [1, 1],
     * );
     *
     * const result = a.mul(b);
     * // => Matrix2D(
     * //     [2, 5],
     * //     [1, 3],
     * //     [2, 4],
     * //   )
     * ```
     *
     * @param other - The matrix to multiply with
     */
    mul(other) {
        const a0 = this.values[0], a1 = this.values[1], a2 = this.values[2], a3 = this.values[3], a4 = this.values[4], a5 = this.values[5];
        const b0 = other.values[0], b1 = other.values[1], b2 = other.values[2], b3 = other.values[3], b4 = other.values[4], b5 = other.values[5];
        return new Matrix2D(a0 * b0 + a2 * b1, a1 * b0 + a3 * b1, a0 * b2 + a2 * b3, a1 * b2 + a3 * b3, a0 * b4 + a2 * b5 + a4, a1 * b4 + a3 * b5 + a5);
    }
    /**
     * Rotate the matrix by the provided angle. By default, the angle is
     * provided in degrees.
     *
     * @remarks
     * This method returns a new matrix representing the result of the
     * computation. It will not modify the source matrix.
     *
     * @example
     * ```ts
     * const a = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     *
     * const result = a.rotate(90);
     * // => Matrix2D(
     * //     [3, 4],
     * //     [-1, -2],
     * //     [5, 6],
     * //   )
     *
     * // Provide the angle in radians
     * const result = a.rotate(Math.PI * 0.5, true);
     * // => Matrix2D(
     * //     [3, 4],
     * //     [-1, -2],
     * //     [5, 6],
     * //   )
     * ```
     *
     * @param angle - The angle by which to rotate the matrix.
     * @param degrees - Whether the angle is provided in degrees.
     */
    rotate(angle, degrees = true) {
        if (degrees) {
            angle *= DEG2RAD;
        }
        const a0 = this.values[0], a1 = this.values[1], a2 = this.values[2], a3 = this.values[3], a4 = this.values[4], a5 = this.values[5];
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Matrix2D(a0 * c + a2 * s, a1 * c + a3 * s, a0 * -s + a2 * c, a1 * -s + a3 * c, a4, a5);
    }
    /**
     * Scale the x and y component vectors of the matrix.
     *
     * @remarks
     * If `vec` is provided as a vector, the x and y component vectors of the
     * matrix will be scaled by the x and y parts of the vector, respectively.
     *
     * If `vec` is provided as a scalar, the x and y component vectors will be
     * scaled uniformly by this factor.
     *
     * This method returns a new matrix representing the result of the
     * computation. It will not modify the source matrix.
     *
     * @example
     * ```ts
     * const matrix = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     *
     * const result1 = matrix.scale([2, 3]);
     * // => new Matrix2D(
     * //      [2, 4],
     * //      [9, 12],
     * //      [5, 6],
     * //    )
     *
     * const result2 = matrix.scale(2);
     * // => new Matrix2D(
     * //      [2, 4],
     * //      [6, 8],
     * //      [5, 6],
     * //    )
     * ```
     *
     * @param vec - The factor by which to scale the matrix
     */
    scale(vec) {
        const v = new Vector2(vec);
        return new Matrix2D(this.values[0] * v.x, this.values[1] * v.x, this.values[2] * v.y, this.values[3] * v.y, this.values[4], this.values[5]);
    }
    /**
     * Multiply each value of the matrix by a scalar.
     *
     * * @example
     * ```ts
     * const matrix = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     *
     * const result1 = matrix.mulScalar(2);
     * // => new Matrix2D(
     * //      [2, 4],
     * //      [6, 8],
     * //      [10, 12],
     * //    )
     * ```
     *
     * @param s - The value by which to scale each term
     */
    mulScalar(s) {
        return new Matrix2D(this.values[0] * s, this.values[1] * s, this.values[2] * s, this.values[3] * s, this.values[4] * s, this.values[5] * s);
    }
    /**
     * Translate the matrix by the dimensions of the provided vector.
     *
     * @remarks
     * If `vec` is provided as a scalar, matrix will be translated uniformly
     * by this factor.
     *
     * This method returns a new matrix representing the result of the
     * computation. It will not modify the source matrix.
     *
     * @example
     * ```ts
     * const matrix = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     *
     * const result1 = matrix.translate([2, 3]);
     * // => new Matrix2D(
     * //      [1, 2],
     * //      [3, 4],
     * //      [16, 22],
     * //    )
     *
     * const result2 = matrix.translate(2);
     * // => new Matrix2D(
     * //      [1, 2],
     * //      [3, 4],
     * //      [13, 18],
     * //    )
     * ```
     *
     * @param vec - The vector by which to translate the matrix
     */
    translate(vec) {
        const v = new Vector2(vec);
        return new Matrix2D(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * v.x + this.values[2] * v.y + this.values[4], this.values[1] * v.x + this.values[3] * v.y + this.values[5]);
    }
    /**
     * Add the provided matrix to this matrix.
     *
     * @remarks
     * This method returns a new matrix representing the result of the
     * computation. It will not modify the source matrix.
     *
     * @example
     * ```ts
     * const a = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     * const a = new Matrix2D(
     *   [7, 8],
     *   [9, 10],
     *   [11, 12],
     * );
     *
     * const result = a.add(b);
     * // => Matrix2D(
     * //      [8, 10],
     * //      [12, 14],
     * //      [16, 18],
     * //    )
     * ```
     *
     * @param other - The matrix to add
     */
    add(other) {
        return new Matrix2D(this.values[0] + other.values[0], this.values[1] + other.values[1], this.values[2] + other.values[2], this.values[3] + other.values[3], this.values[4] + other.values[4], this.values[5] + other.values[5]);
    }
    /**
     * Subtract the provided matrix from this matrix.
     *
     * @remarks
     * This method returns a new matrix representing the result of the
     * computation. It will not modify the source matrix.
     *
     * @example
     * ```ts
     * const a = new Matrix2D(
     *   [1, 2],
     *   [3, 4],
     *   [5, 6],
     * );
     * const a = new Matrix2D(
     *   [7, 8],
     *   [9, 10],
     *   [11, 12],
     * );
     *
     * const result = a.sub(b);
     * // => Matrix2D(
     * //      [-6, -6],
     * //      [-6, -6],
     * //      [-6, -6],
     * //    )
     * ```
     *
     * @param other - The matrix to subract
     */
    sub(other) {
        return new Matrix2D(this.values[0] - other.values[0], this.values[1] - other.values[1], this.values[2] - other.values[2], this.values[3] - other.values[3], this.values[4] - other.values[4], this.values[5] - other.values[5]);
    }
    toSymbol() {
        return Matrix2D.symbol;
    }
    equals(other, threshold = EPSILON) {
        return (Math.abs(this.values[0] - other.values[0]) <=
            threshold + Number.EPSILON &&
            Math.abs(this.values[1] - other.values[1]) <=
                threshold + Number.EPSILON &&
            Math.abs(this.values[2] - other.values[2]) <=
                threshold + Number.EPSILON &&
            Math.abs(this.values[3] - other.values[3]) <=
                threshold + Number.EPSILON &&
            Math.abs(this.values[4] - other.values[4]) <=
                threshold + Number.EPSILON &&
            Math.abs(this.values[5] - other.values[5]) <= threshold + Number.EPSILON);
    }
    exactlyEquals(other) {
        return (this.values[0] === other.values[0] &&
            this.values[1] === other.values[1] &&
            this.values[2] === other.values[2] &&
            this.values[3] === other.values[3] &&
            this.values[4] === other.values[4] &&
            this.values[5] === other.values[5]);
    }
}
Matrix2D.symbol = Symbol.for('@motion-canvas/core/types/Matrix2D');
Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
Matrix2D.zero = new Matrix2D(0, 0, 0, 0, 0, 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF0cml4MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHlwZXMvTWF0cml4MkQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFPLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNyQyxPQUFPLEVBQWtCLE9BQU8sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNsRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBUWpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUNILE1BQU0sT0FBTyxRQUFRO0lBU1osTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFhO1FBQ3RDLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlLENBQzNCLFdBQW9DO1FBRXBDLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUE4QjtRQUN0RCxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQVcsQ0FBQztRQUNWLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQVcsQ0FBQztRQUNWLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNmLE9BQU8s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Q3JCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsT0FBTzthQUNSO1lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsT0FBTztTQUNSO1FBRUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBNEIsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMs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