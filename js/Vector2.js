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

        return this.point
    }

    multiply(value = 0 || new Point) {
        if(typeof value == 'number') return this.multiplyOnNumber(value)
        else if(value.x !== undefined) return this.multiplyOnPoint(value)

        return null
    }

    summarizeOnPoint({x, y} = new Point) {
        this.x += x
        this.y += y

        return this.point
    }

    summarizeOnNumber(number = 0) {
        return this.summarizeOnPoint(new Point(number))
    }

    summarize(value = 0 || new Point) {
        if(typeof value == 'number') return this.summarizeOnNumber(value)
        else if(value.x !== undefined) return this.summarizeOnPoint(value)

        return null
    }

    static clamp({x, y} = new Point, min = new Point, max = new Point) {
        let point = new Vector2(x, y)

        if(point.x > max.x) point.x = max.x
        else if(point.x < min.x) point.x = min.x

        if(point.y > max.y) point.y = max.y
        else if(point.y < min.y) point.y = min.y

        return point
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

    static toVectors(...objects) {
        let vectors = [new Vector2]
        vectors.pop()

        objects.forEach(({x, y}) => {
            vectors.push(new Vector2(x, y))
        })

        return vectors
    }
}