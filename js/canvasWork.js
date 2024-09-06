import { $, all$ } from "./documentWork.js"

export const resizeCanvas = (canvas = new HTMLCanvasElement, {width = innerWidth, height = innerHeight}) => {
    [canvas.width, canvas.height] = [width, height]
}

export const createCanvas = (root = document.body) => {
    const canvas = document.createElement('canvas')
    
    canvas.id = `canvas-${all$('canvas').length}`
    canvas.style.imageRendering = 'pixelated'

    root.appendChild(canvas)
    return canvas
}

export const clearCanvas = ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

export const getContext2d = (canvas = new HTMLCanvasElement()) => {
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.imageSmoothingQuality = 'high'

    return ctx
}

const _drawRect = (ctx, x, y, width, height, color, type) => {
    ctx[`${type}Style`] = color
    ctx[`${type}Rect`](x,y,width,height)
}

export const fillRect = (ctx, x, y, width, height, color) => _drawRect(ctx, x, y, width, height, color, 'fill')
export const strokeRect = (ctx, x, y, width, height, color) => _drawRect(ctx, x, y, width, height, color, 'stroke')

const _drawArc = (ctx, x, y, radius, color, startAngle = 0, endAngle = Math.PI*2, type) => {
    ctx.beginPath()
    ctx[`${type}Style`] = color
    ctx.moveTo(x,y)
    ctx.arc(x, y, radius, startAngle, endAngle)
    ctx[type]()
    ctx.closePath()
}

export const fillArc = (ctx, x, y, radius, color, startAngle, endAngle) => _drawArc(ctx, x, y, radius, color, startAngle, endAngle, 'fill')
export const strokeArc = (ctx, x, y, radius, color, startAngle, endAngle) => _drawArc(ctx, x, y, radius, color, startAngle, endAngle, 'stroke')

const _drawPath = (ctx, points = [], color, type) => {
    ctx[`${type}Style`] = color

    let firstPoint = points.shift()

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)

    for (const point of points) 
        ctx.lineTo(point.x, point.y)

    ctx[type]()

    points.unshift(firstPoint)
    ctx.closePath()
}

export const fillPath = (ctx, points, color) => _drawPath(ctx, points, color, 'fill')
export const strokePath = (ctx, points, color) => _drawPath(ctx, points, color, 'stroke')

export const drawImage = (ctx, image, position, source = undefined) => {
    source = source ?? {x: 0, y: 0, width: image.width, height: image.height}
    ctx.drawImage(image, source.x, source.y, source.width, source.height, position.x, position.y, position.width, position.height)
}

export const measureText = (ctx = getContext2d(), text = '') => {
    let textMetrics = ctx.measureText(text)
    textMetrics.height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent

    return textMetrics
}

export const createGameLoop = (callback = (delta = 0) => {}) => {
    let delta = 1 / 60
    let previousTime = Date.now()

    const update = () => {
        [delta, previousTime] = [(Date.now() - previousTime) / 1000, Date.now()]
        callback(delta)

        requestAnimationFrame(update)
    }

    update()
}