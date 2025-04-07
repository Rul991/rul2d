import CustomObject from "../objects/CustomObject"
import MathUtils from "./MathUtils"

export default class Angle extends CustomObject {
    static Pi = Math.PI
    static Pi2 = Angle.Pi * 2
    static Rad_1 = Angle.degToRad(1)

    private _radians: number

    static degToRad(deg: number): number {
        return deg / 180 * Angle.Pi
    }

    static radToDeg(rad: number): number {
        return rad / Angle.Pi * 180
    }

    static from(rad: number): Angle {
        let angle: Angle = new Angle
        angle.radians = rad

        return angle
    }

    constructor() {
        super()

        this._radians = 0
    }

    set radians(rad: number) {
        this._radians = rad % Angle.Pi2
        if(this._radians < 0) this._radians += Angle.Pi2
    }

    get radians(): number {
        return this._radians
    }

    set degrees(deg: number) {
        this.radians = Angle.degToRad(deg)
    }

    get degrees(): number {
        return Angle.radToDeg(this.radians)
    }

    simplify(): {radians: number, degress: number} {
        return {
            radians: this.radians,
            degress: this.degrees
        }
    }

    valueOf(): number {
        return this.radians
    }

    toString(): string {
        return `${MathUtils.round(this.degrees, 2)}°`
    }
}