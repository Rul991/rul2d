import InteractiveObject from './InteractiveObject.js'

/**
 * Represents a clickable object that can respond to pointer events on a canvas.
 * This class extends InteractiveObject to provide additional functionality for handling click interactions.
 * @extends InteractiveObject
 */

export default class ClickableObject extends InteractiveObject {

    /**
     * Adds event listeners to the given canvas element to handle pointer events.
     * When a pointer down event occurs, it updates the position of the object based on the mouse coordinates.
     * 
     * @param {HTMLCanvasElement} [canvas=new HTMLCanvasElement] - The canvas element to which controls will be added.
     * @returns {boolean}
     */

    addControls(canvas = new HTMLCanvasElement) {
        canvas.addEventListener('pointerdown', e => {
            this.preventDefaultWhenNeed(e)
            this.lastEvent = e
            let {clientX: x, clientY: y} = e
            let {left, top} = canvas.getBoundingClientRect()
            this.update({x: x - left, y: y - top})
        })

        return true
    }
}