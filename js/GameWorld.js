import { createCanvas } from "./canvasWork.js"

export class GameWorld {
    constructor({canvas = null, width = null, height = null}) {
        this.initProperty('canvas', canvas, createCanvas())
        this.initProperty('width', width, canvas.width ?? innerWidth)
        this.initProperty('height', height, canvas.height ?? innerHeight)
    }

    initProperty(key, value, defaultValue) {
        this[key] = value ?? defaultValue
    }
}