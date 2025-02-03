import { all$ } from "./documentWork.js"

/**
 * Resizes a given canvas.
 * @param {HTMLCanvasElement} [canvas=new HTMLCanvasElement()] - The canvas element to resize.
 * @param {Object} [size] - The size dimensions.
 * @param {number} [size.width=innerWidth] - The width to set the canvas.
 * @param {number} [size.height=innerHeight] - The height to set the canvas.
 */

export const resizeCanvas = (canvas = new HTMLCanvasElement, {width = innerWidth, height = innerHeight}) => {
    [canvas.width, canvas.height] = [width, height]
}

/**
 * Creates a new canvas element and appends it to the root element.
 * @param {HTMLElement} [root=document.body] - The root element to append the canvas to.
 * @returns {HTMLCanvasElement} The newly created canvas element.
 */

export const createCanvas = (root = document.body) => {
    const canvas = document.createElement('canvas')
    
    canvas.id = `canvas-${all$('canvas').length}`
    canvas.style.imageRendering = 'pixelated'

    root.appendChild(canvas)
    return canvas
}

/**
 * Clears the specified canvas context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to clear.
 */

export const clearCanvas = ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

/**
 * Gets the 2D rendering context for a given canvas element.
 * @param {HTMLCanvasElement} [canvas=new HTMLCanvasElement()] - The canvas to get the context for.
 * @returns {CanvasRenderingContext2D} The 2D rendering context for the specified canvas.
 */

export const getContext2d = (canvas = new HTMLCanvasElement()) => {
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.imageSmoothingQuality = 'high'

    return ctx
}

/**
 * Draws a rectangle on the specified context with the given type (fill or stroke).
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {string} type - The type of rectangle to draw ('fill' or 'stroke').
 * @private
 */

const _drawRect = (ctx, x, y, width, height, type) => {
    ctx[`${type}Rect`](x,y,width,height)
}

/**
 * Draws a filled rectangle on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */

export const fillRect = (ctx, x, y, width, height) => _drawRect(ctx, x, y, width, height, 'fill')

/**
 * Draws a stroked rectangle on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */

export const strokeRect = (ctx, x, y, width, height) => _drawRect(ctx, x, y, width, height, 'stroke')

/**
 * Draws an arc on the specified context with the given parameters.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} x - The x-coordinate of the center of the arc.
 * @param {number} y - The y-coordinate of the center of the arc.
 * @param {number} radius - The radius of the arc.
 * @param {number} [startAngle=0] - The starting angle of the arc, in radians.
 * @param {number} [endAngle=Math.PI * 2] - The ending angle of the arc, in radians.
 * @param {string} type - The type of arc to draw ('fill' or 'stroke').
 * @private
 */

const _drawArc = (ctx, x, y, radius, startAngle = 0, endAngle = Math.PI*2, type) => {
    ctx.beginPath()
    ctx.moveTo(x,y)
    ctx.arc(x, y, radius, startAngle, endAngle)
    ctx[type]()
    ctx.closePath()
}

/**
 * Draws a filled arc on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} x - The x-coordinate of the center of the arc.
 * @param {number} y - The y-coordinate of the center of the arc.
 * @param {number} radius - The radius of the arc.
 * @param {number} [startAngle=0] - The starting angle of the arc, in radians.
 * @param {number} [endAngle=Math.PI * 2] - The ending angle of the arc, in radians.
 */

export const fillArc = (ctx, x, y, radius, startAngle, endAngle) => _drawArc(ctx, x, y, radius, startAngle, endAngle, 'fill')

/**
 * Draws a stroked arc on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} x - The x-coordinate of the center of the arc.
 * @param {number} y - The y-coordinate of the center of the arc.
 * @param {number} radius - The radius of the arc.
 * @param {number} [startAngle=0] - The starting angle of the arc, in radians.
 * @param {number} [endAngle=Math.PI * 2] - The ending angle of the arc, in radians.
 */

export const strokeArc = (ctx, x, y, radius, startAngle, endAngle) => _drawArc(ctx, x, y, radius, startAngle, endAngle, 'stroke')

/**
 * Draws a path defined by an array of points on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {Array<{x: number, y: number}>} points - An array of points defining the path.
 * @param {string} type - The type of path to draw ('fill' or 'stroke').
 */

const _drawPath = (ctx, points = [], type) => {
    if(!points.length) return

    let firstPoint = points.shift()

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)

    for (const point of points) 
        ctx.lineTo(point.x, point.y)

    ctx[type]()

    points.unshift(firstPoint)
    ctx.closePath()
}

/**
 * Draws a filled path on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {Array<{x: number, y: number}>} points - An array of points defining the path.
 */

export const fillPath = (ctx, points) => _drawPath(ctx, points, 'fill')

/**
 * Draws a stroked path on the specified context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {Array<{x: number, y: number}>} points - An array of points defining the path.
 */

export const strokePath = (ctx, points) => _drawPath(ctx, points, 'stroke')

/**
 * Draws an image on the specified context at the provided position, with an optional source rectangle.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {HTMLImageElement} image - The image to be drawn.
 * @param {{x: number, y: number}} position - The position where the image should be drawn.
 * @param {{x: number, y: number, width: number, height: number}|null} [source=null] - The source section of the image to draw from.
 */

export const drawImage = (ctx, image, position, source = null) => {
    source = source ?? {x: 0, y: 0, width: image.width, height: image.height}
    ctx.drawImage(image, source.x, source.y, source.width, source.height, position.x, position.y, position.width, position.height)
}

/**
 * Measures the width and height of a given text when rendered in the provided context.
 * @param {CanvasRenderingContext2D} [ctx=getContext2d()] - The rendering context to use for text measurement.
 * @param {string} [text=''] - The text to measure.
 * @returns {{width: number, height: number}} The metrics of the text, including width and height.
 */

export const measureText = (ctx = getContext2d(), text = '') => {
    let textMetrics = ctx.measureText(text)
    textMetrics.height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent

    return {width: textMetrics.width, height: textMetrics.height}
}

/**
 * Creates a game loop that calls a callback function at a consistent frame rate.
 * @param {([delta = 0, prevTime = 0]) => {}} - The callback function to invoke during the game loop.
 * @returns {number} The request ID for the ongoing animation frame.
 */

export const createGameLoop = (callback = ([delta = 0, prevTime = 0]) => {}) => {
    let delta = 1 / 60
    let previousTime = Date.now()

    const update = () => {
        [delta, previousTime] = [(Date.now() - previousTime) / 1000, Date.now()]
        callback([isFinite(delta) ? delta ?? 1 : 1, previousTime])

        return requestAnimationFrame(update)
    }

    return update()
}