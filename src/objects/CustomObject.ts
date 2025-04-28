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

        try {
            let result = await assets.loadJSONFile(src)
            await this._loadJSONFromFile(result)
        }
        catch(e) {
            Logging.engineError('Cant load json from file', e, this)
        }
    }

    protected async _loadJSONFromFile(result: Record<string, any>): Promise<void> {}

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

    toJSONString(): string {
        return JSON.stringify(this.simplify())
    }

    valueOf(): number {
        return NaN
    }
}