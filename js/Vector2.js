import Point from "./Point.js"

export default class Vector2 extends Point {
    constructor(x, y) {
        super(x, y)
    }

    getNegative() {
        return new Vector2(-this.x, -this.y)
    }

    multiplyOnNumber(number = 0) {
        return this.multiplyOnPoint(new Point(number))
    }

    multiplyOnPoint({x, y} = new Point) {
        this.x *= x
        this.y *= y

        return new Vector2(this.x, this.y)
    }

    multiply(value = 0 || new Point) {
        if(typeof value == 'number') return this.multiplyOnNumber(value)
        else if(value.x !== undefined) return this.multiplyOnPoint(value)

        return null
    }

    summarizeOnPoint({x, y} = new Point) {
        this.x += x
        this.y += y

        return new Vector2(this.x, this.y)
    }

    summarizeOnNumber(number = 0) {
        return this.summarizeOnPoint(new Point(number))
    }

    summarize(value = 0 || new Point) {
        if(typeof value == 'number') return this.summarizeOnNumber(value)
        else if(value.x !== undefined) return this.summarizeOnPoint(value)

        return null
    }

    clamp(min = new Point, max = new Point) {
        let point = this.point

        if(point.x > max.x) point.x = max.x
        else if(point.x < min.x) point.x = min.x

        if(point.y > max.y) point.y = max.y
        else if(point.y < min.y) point.y = min.y

        return new Vector2(point.x, point.y)
    }

    normalize() {
        const length = this.magnitude()
        return new Vector2(this.x / length, this.y / length)
    }

    calcNormal({x, y} = new Point) {
        return new Vector2(x - this.x, y - this.y)
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    getScalarMultiplier({x, y} = new Point) {
        return this.x * x + this.y * y
    }

    static toVector(obj = new Point) {
        return new Vector2(obj.x, obj.y)
    }

    static toVectors(...objects) {
        let vectors = []

        objects.forEach(obj => {
            vectors.push(Vector2.toVector(obj))
        })

        return vectors
    }
}