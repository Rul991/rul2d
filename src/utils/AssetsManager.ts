import CustomObject from '../objects/CustomObject'
import { Dict } from './types'

export default class AssetsManager extends CustomObject {
    static instance = new AssetsManager()

    private _cachedImages: Dict<HTMLImageElement>
    private _cachedTexts: Dict<string>
    private _cachedJSON: Dict<Record<string, any>>

    constructor() {
        super()

        this._cachedImages = new Map
        this._cachedJSON = new Map
        this._cachedTexts = new Map

        return AssetsManager.instance
    }

    clear(type: 'image' | 'text' | 'json', src: string): boolean {
        if(type == 'image')
            return this._cachedImages.delete(src)
        else if(type == 'json')
            return this._cachedJSON.delete(src)
        else 
            return this._cachedTexts.delete(src)
    }

    private async _loadFile<T>(src: string, cacheDict: Dict<T>, callback: (responce: Response) => Promise<T>): Promise<T> {
        if(cacheDict.has(src))
            return cacheDict.get(src)!

        let responce = await fetch(src)
        let value = await callback(responce)

        cacheDict.set(src, value)

        return value
    }

    async loadTextFile(src: string): Promise<string> {
        return await this._loadFile(src, this._cachedTexts, async res => {
            return await res.text()
        })
    }

    async loadJSONFile(src: string): Promise<Record<string, any>> {
        return await this._loadFile(src, this._cachedJSON, async res => {
            return await res.json()
        })
    }

    async loadImageFile(src: string): Promise<HTMLImageElement> {
        return await this._loadFile(src, this._cachedImages, async res => {
            let blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const image = new Image()
            image.src = url

            return image
        })
    }
}