import Point from "./Point.js"

/**
 * Represents a two-dimensional vector.
 * Extends the Point class to provide vector-specific operations.
 * @extends Point
 */

export default class Vector2 extends Point {

    /**
     * Creates an instance of Vector2 with specified x and y coordinates.
     * 
     * @param {number} x - The x-coordinate of the vector.
     * @param {number} y - The y-coordinate of the vector.
     */

    constructor(x, y) {
        super(x, y)
    }

    /**
     * Returns a new Vector2 that is the negative of the current vector.
     * 
     * @returns {Vector2} A new vector with negated coordinates.
     */

    getNegative() {
        return new Vector2(-this.x, -this.y)
    }

    /**
     * Multiplies the vector by a scalar number.
     * 
     * @param {number} [number=0] - The scalar number to multiply the vector by.
     * @returns {Vector2} A new vector resulting from the multiplication.
     */

    multiplyOnNumber(number = 0) {
        return this.multiplyOnPoint(new Point(number))
    }

    /**
     * Multiplies the vector by another point vector.
     * 
     * @param {Point} [{x, y}=new Point] - The point to multiply by.
     * @returns {Vector2} A new vector resulting from the multiplication.
     */

    multiplyOnPoint({x, y} = new Point) {
        this.x *= x
        this.y *= y

        return new Vector2(this.x, this.y)
    }

    /**
     * Multiplies the vector by either a number or another point.
     * 
     * @param {number|Point} [value=0] - The value to multiply by (can be a number or Point).
     * @returns {Vector2|null} A new vector resulting from the multiplication or null if invalid.
     */

    multiply(value = 0 || new Point) {
        if(typeof value == 'number') return this.multiplyOnNumber(value)
        else if(value.x !== undefined) return this.multiplyOnPoint(value)

        return null
    }

    /**
     * Summarizes the vector with another point vector.
     * 
     * @param {Point} [{x, y}=new Point] - The point to summarize with.
     * @returns {Vector2} A new vector resulting from the summary operation.
     */

    summarizeOnPoint({x, y} = new Point) {
        this.x += x
        this.y += y

        return new Vector2(this.x, this.y)
    }

    /**
     * Summarizes the vector by a scalar number.
     * 
     * @param {number} [number=0] - The scalar number to summarize with.
     * @returns {Vector2} A new vector resulting from the summary operation.
     */

    summarizeOnNumber(number = 0) {
        return this.summarizeOnPoint(new Point(number))
    }

    /**
     * Summarizes the vector with either a number or another point.
     * 
     * @param {number|Point} [value=0] - The value to summarize with (can be a number or Point).
     * @returns {Vector2|null} A new vector resulting from the summary operation or null if invalid.
     */

    summarize(value = 0 || new Point) {
        if(typeof value == 'number') return this.summarizeOnNumber(value)
        else if(value.x !== undefined) return this.summarizeOnPoint(value)

        return null
    }

    /**
     * Clamps the vector within the specified minimum and maximum points.
     * 
     * @param {Point} [min=new Point] - The minimum point to clamp to.
     * @param {Point} [max=new Point] - The maximum point to clamp to.
     * @returns {Vector2} A new clamped vector.
     */

    clamp(min = new Point, max = new Point) {
        let point = this.point

        if(point.x > max.x) point.x = max.x
        else if(point.x < min.x) point.x = min.x

        if(point.y > max.y) point.y = max.y
        else if(point.y < min.y) point.y = min.y

        return new Vector2(point.x, point.y)
    }

    /**
     * Normalizes the vector to make its magnitude equal to 1.
     * 
     * @returns {Vector2} A new normalized vector.
     */

    normalize() {
        const length = this.magnitude()
        return new Vector2(this.x / length, this.y / length)
    }

    /**
     * Calculates the normal vector from the current vector to a specified point.
     * 
     * @param {Point} [{x, y}=new Point] - The point to calculate the normal to.
     * @returns {Vector2} A new vector representing the normal.
     */

    calcNormal({x, y} = new Point) {
        return new Vector2(x - this.x, y - this.y)
    }

    /**
     * Calculates the magnitude (length) of the vector.
     * 
     * @returns {number} The magnitude of the vector.
     */

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    /**
     * Calculates the scalar (dot) product with another point vector.
     * 
     * @param {Point} [{x, y}=new Point] - The point to calculate the scalar product with.
     * @returns {number} The scalar product of the two vectors.
     */

    getScalarMultiplier({x, y} = new Point) {
        return this.x * x + this.y * y
    }

    /**
     * Converts a point object to a Vector2.
     * 
     * @param {Point} [obj=new Point] - The point object to convert.
     * @returns {Vector2} A new Vector2 representation of the point.
     */

    static toVector(obj = new Point) {
        return new Vector2(obj.x, obj.y)
    }

    /**
     * Converts multiple point objects to an array of Vector2 instances.
     * 
     * @param {...Point} [objects] - The point objects to convert.
     * @returns {Vector2[]} An array of Vector2 instances.
     */

    static toVectors(...objects) {
        let vectors = []

        objects.forEach(obj => {
            vectors.push(Vector2.toVector(obj))
        })

        return vectors
    }
}