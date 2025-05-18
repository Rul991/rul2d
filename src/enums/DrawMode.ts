/**
 * Enum that defines the way an object will be rendered
 */

enum DrawMode {
    /**
     * Only the filled part is rendered
     */
    Fill,
    /**
     Only the outline is rendered.
     */
    Stroke,
    /**
     * The outline and the filled part are rendered
     */
    All
}

export default DrawMode