import AssetsManager from '../utils/AssetsManager'
import Logging from '../utils/static/Logging'

export default abstract class CustomObject {
    private static createdObjectsCount: number = 0
    private _id: number

    constructor() {
        this._id = CustomObject.createdObjectsCount++
    }

    async loadJSONFromFile(src: string) {
        let assets = new AssetsManager()

        let result = await assets.loadJSONFile(src)
        this._loadJSONFromFile(result)
    }

    protected _loadJSONFromFile<T extends Record<string, any> = Record<string, any>>(result: T): void {

    }

    get id(): number {
        return this._id
    }

    log(): void {
        Logging.debug(this)
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