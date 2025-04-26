import Logging from './static/Logging'
import { CacheDictTypes, Dict } from './types'

export default class AssetsManager {
    static instance = new AssetsManager()

    private _cachedImages: Dict<HTMLImageElement>
    private _cachedTexts: Dict<string>
    private _cachedJSON: Dict<Record<string, any>>
    private _cachedAudios: Dict<AudioBuffer>
    private _cachedBinaries: Dict<ArrayBuffer>

    constructor() {
        this._cachedImages = new Map
        this._cachedJSON = new Map
        this._cachedTexts = new Map
        this._cachedAudios = new Map
        this._cachedBinaries = new Map

        return AssetsManager.instance
    }

    clear(type: CacheDictTypes, src: string): boolean {
        if(type == 'image')
            return this._cachedImages.delete(src)
        else if(type == 'json')
            return this._cachedJSON.delete(src)
        else 
            return this._cachedTexts.delete(src)
    }

    clearDict(type: CacheDictTypes): void {
        if(type == 'image')
            return this._cachedImages.clear()
        else if(type == 'json')
            return this._cachedJSON.clear()
        else 
            return this._cachedTexts.clear()
    }

    clearAll() {
        [this._cachedImages, this._cachedJSON, this._cachedTexts].forEach(dict => {
            dict.clear()
        })
    }

    private async _loadFile<T>(src: string, cacheDict: Dict<T>, callback: (responce: Response, isError: boolean) => Promise<T>): Promise<T> {
        if(cacheDict.has(src)) {
            Logging.engineLog(`used cache value: ${src}`)
            return cacheDict.get(src)!
        }

        let responce: Response | undefined
        let isError = false

        try {
            responce = await fetch(src)
            Logging.engineLog(`loaded: ${src}`)
            if(!responce.ok) {
                throw new Error(`(${responce.status} ${responce.statusText}) Can't load file "${src}"`)
            }
        }
        catch(e) {
            Logging.error(e)
            isError = true
        }

        let value = await callback(responce!, isError)
        
        if(!isError) 
            cacheDict.set(src, value)

        return value
    }

    async loadTextFile(src: string): Promise<string> {
        return await this._loadFile(src, this._cachedTexts, async (res, isErr) => {
            if(isErr) return ''
            else return await res.text()
        })
    }

    async loadBinarytFile(src: string): Promise<ArrayBuffer> {
        return await this._loadFile(src, this._cachedBinaries, async (res, isErr) => {
            if(isErr) return new ArrayBuffer
            else return await res.arrayBuffer()
        })
    }

    async loadJSONFile(src: string): Promise<Record<string, any>> {
        return await this._loadFile(src, this._cachedJSON, async (res, isErr) => {
            if(isErr) return {}
            else return await res.json()
        })
    }

    async loadImageFile(src: string): Promise<HTMLImageElement> {
        return await this._loadFile(src, this._cachedImages, async (res, isErr) => {
            const image = new Image()
            if(isErr) 
                return image

            let blob = await res.blob()
            const url = URL.createObjectURL(blob)
            image.src = url

            return image
        })
    }

    async loadAudioFile(src: string, audioContext: AudioContext): Promise<AudioBuffer> {
        return await this._loadFile(src, this._cachedAudios, async (res, isErr) => {
            if(isErr) 
                return new AudioBuffer({
                    length: 0,
                    numberOfChannels: 0,
                    sampleRate: 0
                })
            
            const buffer = await res.arrayBuffer()
            return await audioContext.decodeAudioData(buffer)
        })
    }
}