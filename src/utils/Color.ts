import CustomObject from "../objects/core/CustomObject"
import Bounds from "./bounds/Bounds"
import MathUtils from './static/MathUtils'
import Random from "./static/Random"

export default class Color extends CustomObject {
    static componentBounds = new Bounds(0, 255)

    private _r: number
    private _g: number
    private _b: number
    private _a: number

    constructor() {
        super()
        
        this._r = 0
        this._g = 0
        this._b = 0
        this._a = 1
    }

    setRGBA(r: number, g: number, b: number, a: number = 255): this {
        if(a == 0) {
            r = 0
            g = 0
            b = 0
            a = 0
        }

        this._r = Color.componentBounds.get(r)
        this._g = Color.componentBounds.get(g)
        this._b = Color.componentBounds.get(b)
        this._a = Color.componentBounds.get(a) / 255

        return this
    }

    toString(): string {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`
    }

    simplify() {
        return {
            r: this._r,
            g: this._g,
            b: this._b,
            a: this._a * 255
        }
    }

    static interpolate(first: Color, second: Color, factor: number): Color {
        const {r, g, b, a} = first.simplify()
        const {r: r1, g: g1, b: b1, a: a1} = second.simplify()

        return Color.from(
            MathUtils.lerp(r, r1, factor),
            MathUtils.lerp(g, g1, factor),
            MathUtils.lerp(b, b1, factor),
            MathUtils.lerp(a, a1, factor)
        )
    }

    static from(r: number, g: number, b: number, a: number = 255): Color {
        let color = new Color
        return color.setRGBA(r, g, b, a)
    }

    static fromSimple({r, g, b, a}: {r: number, g: number, b: number, a: number}): Color {
        return Color.from(r, g, b, a)
    }

    static random(a: number = 255): Color {
        return Color.from(
            Random.number(255),
            Random.number(255),
            Random.number(255),
            Color.componentBounds.get(a) || Random.number(255)
        )
    }

    static get Transparent(): Color {
        return Color.from(0, 0, 0, 0)
    }

    static get Black(): Color {
        return new Color
    }
    
    static get White(): Color {
        return Color.from(255, 255, 255, 255)
    }
    
    static get Red(): Color {
        return Color.from(255, 0, 0, 255)
    }
    
    static get Blue(): Color {
        return Color.from(0, 0, 255, 255)
    }
    
    static get Green(): Color {
        return Color.from(0, 255, 0, 255)
    }
}