export default class CustomObject {
    private static createdObjectsCount: number = 0
    private _id: number

    constructor() {
        this._id = CustomObject.createdObjectsCount++
    }

    get id(): number {
        return this._id
    }

    log(): void {
        console.log(this)
    }

    simplify(): {} {
        return {}
    }

    toString(): string {
        let result: string = `${this.constructor.name} {`
        let entries: [string, any][] = Object.entries(this.simplify())

        entries.forEach(([key, value], i) => {
            result += `${key}: ${value.toString()}`
            
            if(i + 1 < entries.length) result += ', '
        })

        result += '}'

        return result
    }

    valueOf(): number {
        return NaN
    }
}