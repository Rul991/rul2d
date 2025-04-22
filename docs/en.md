# Rul2D Documentation

Rul2D is a 2D game development library designed to facilitate the creation of interactive applications and games in the browser using the HTML5 canvas. It provides a rich set of classes and utilities for managing game objects, rendering graphics, handling input, and more. This documentation offers a detailed guide to all components of the library, including class descriptions, properties, methods, and examples.

## Table of Contents

- [Main Classes](#main-classes)
  - [CustomObject](#customobject)
  - [DrawableObject](#drawableobject)
  - [GameObject](#gameobject)
  - [GameScene](#gamescene)
  - [GameWorld](#gameworld)
  - [Point](#point)
  - [Shape](#shape)
  - [Rectangle](#rectangle)
  - [Circle](#circle)
  - [Triangle](#triangle)
  - [ShapeableObject](#shapeableobject)
  - [PointerableObject](#pointerableobject)
  - [CanvasImage](#canvasimage)
  - [Camera](#camera)
  - [FollowedCamera](#followedcamera)
  - [GameEntity](#gameentity)
- [Utility Classes](#utility-classes)
  - [Angle](#angle)
  - [AssetsManager](#assetsmanager)
  - [Bounds](#bounds)
  - [CachedValue](#cachedvalue)
  - [Color](#color)
  - [MathUtils](#mathutils)
  - [Random](#random)
  - [Size](#size)
  - [SimpleRect](#simplerect)
  - [Search](#search)
  - [Sorting](#sorting)
  - [VectorUtils](#vectorutils)
  - [CanvasManager](#canvasmanager)
  - [KeyboardManager](#keyboardmanager)
  - [KeyStateManager](#keystatemanager)
  - [PointerInputManager](#pointerinputmanager)
  - [LocalStorageManager](#localstoragemanager)
- [Interfaces](#interfaces)
  - [IAngle](#iangle)
  - [IAngleable](#iangleable)
  - [IMinMax](#iminmax)
  - [ISimplePoint](#isimplepoint)
  - [IPointerable](#ipointerable)
  - [IRoot](#iroot)
  - [ISimpleSize](#isimplesize)
  - [ISizeable](#isizeable)
  - [IRectangle](#irectangle)
  - [ISimpleRect](#isimplerect)
  - [ISimpleDrawableObject](#isimpledrawableobject)
  - [ISimpleCamera](#isimplecamera)
  - [ISimpleShape](#isimpleshape)
  - [IGameWorldBuilder](#igameworldbuilder)
  - [IKeyOptions](#ikeyoptions)
  - [IShapeConfig](#ishapeconfig)
  - [IManager](#imanager)
  - [IEventOptions](#ieventoptions)
  - [IControlManager](#icontrolmanager)
- [Event Classes](#event-classes)
  - [ValueEvent](#valueevent)
  - [StorageEvent](#storageevent)

---

## Main Classes

### CustomObject

> *Abstract*

**Description:**  
The foundational class for all other classes in Rul2D. It provides basic functionality common to all objects, such as a unique identifier and methods for logging, serialization, and string/number representation.

**Properties:**

- **Static:**
  - `createdObjectsCount`: *number* - Tracks the total number of `CustomObject` instances created.

- **Instance:**
  - `_id`: *number* - A private unique identifier assigned to each instance.

**Getters/Setters:**

- `get id`: *number* - Returns the unique identifier of the object, calculated based on the number of `CustomObject` instances created.

**Methods:**

- `log(): void`  
  Logs the object to the console using `console.log`.

- `simplify(): object`  
  Returns a simplified version of the object, intended for serialization or networking. By default, returns an empty object.

- `toString(): string`  
  Returns a string representation of the object in the format `ClassName {key1: value1, key2: value2, ...}` based on the `simplify` method.

- `valueOf(): number`  
  Returns a numeric representation of the object. Defaults to `NaN`.

**Example:**
```javascript
const obj = new CustomObject();
console.log(obj.id); // 0
obj.log(); // Logs the object to the console
console.log(obj.toString()); // "CustomObject {}"
console.log(obj.valueOf()); // NaN
```

---

### DrawableObject

> *Abstract, Extends [CustomObject](#customobject)*

**Description:**  
The parent class for all objects that can be rendered on an HTML5 canvas. It provides properties and methods for managing visibility, rendering, and hierarchical relationships.

**Properties:**

- **Static:**
  - `positiveNumberBounds`: [Bounds](#bounds) - Clamps values between `Number.EPSILON` and `Number.MAX_SAFE_INTEGER`.
  - `opacityBounds`: [Bounds](#bounds) - Clamps opacity values between 0 and 1.

- **Instance:**
  - `isVisible`: *boolean* - Determines if the object is visible on the canvas.
  - `isInViewport`: *boolean* - Indicates if the object is within the camera’s viewport.
  - `managers`: *Set<[IManager](#imanager)>* - A set of manager objects associated with this drawable.
  - `root`: [CurrentRoot](#currentroot) - The parent object (e.g., `GameEntity` or `GameScene`). Defaults to `null`.
  - `eventEmitter`: [EventEmitter](#eventemitter) - Handles events related to this object.
  - `_lineWidth`: *number* - The width of lines used in rendering (default: 1).
  - `_color`: [Color](#color) - The color of the object (default: green).
  - `_opacity`: *number* - The opacity of the object (default: 1).
  - `_zIndex`: *number* - The rendering order (default: 1).
  - `_offset`: [ISimplePoint](#isimplepoint) - The offset relative to the root (default: `{ x: 0, y: 0 }`).

**Getters/Setters:**

- `get canBeSubObject`: *boolean* - Indicates if the object can be a child of a `GameObject`. Defaults to `true`.
- `set/get zIndex`: *number* - Sets or gets the rendering order; updates managers when set.
- `get inheritOpacity`: *number* - Returns the effective opacity, factoring in the parent’s opacity.
- `set/get color`: [Color](#color) - Sets or gets the object’s color.
- `set/get opacity`: *number* - Sets or gets the opacity, clamped by `opacityBounds`.
- `set/get lineWidth`: *number* - Sets or gets the line width, clamped by `positiveNumberBounds`.
- `set/get offset`: [ISimplePoint](#isimplepoint) - Sets or gets the offset relative to the root.
- `abstract get factRect`: [ISimpleRect](#isimplerect) - Must return the bounding rectangle for culling.

**Methods:**

- `setVisibility(value: boolean): void`  
  Sets the visibility of the object.

- `setColor(color: Color): void`  
  Sets the object’s color.

- `setOffset(x: number, y: number): void`  
  Sets the offset position.

- `abstract updatePositionByOffset(point: ISimplePoint): void`  
  Updates the object’s position based on the offset and root position (must be implemented by subclasses).

- `updateColor(ctx: Context, color?: Color): void`  
  Updates the canvas context’s fill and stroke styles with the specified color (defaults to the object’s color).

- `updateContextParameters(ctx: Context, color?: Color): void`  
  Updates the context’s color, line width, and global alpha.

- `init(world: GameWorld): void`  
  Initializes the object when added to a `GameWorld` or `GameScene`. Empty by default.

- `needDraw(): boolean`  
  Returns `true` if the object is visible and in the viewport.

- `update(delta: number): void`  
  Updates the object’s state each frame. Empty by default.

- `protected abstract _draw(ctx: Context): void`  
  Defines the core drawing logic without altering context parameters (must be implemented by subclasses).

- `abstract isObjectInViewport(camera: Camera): boolean`  
  Checks if the object is within the camera’s viewport (must be implemented by subclasses).

- `draw(ctx: Context): void`  
  Renders the object if `needDraw` is true, handling context setup and restoration.

**Example:**
```javascript
class MyDrawable extends DrawableObject {
  get factRect() { return new SimpleRect(0, 0, 10, 10); }
  updatePositionByOffset(point) { /* Implementation */ }
  _draw(ctx) { ctx.fillRect(0, 0, 10, 10); }
  isObjectInViewport(camera) { return true; }
}
const drawable = new MyDrawable();
drawable.draw(context); // Draws a green 10x10 rectangle
```

---

### GameObject

> *Extends [DrawableObject](#drawableobject)*

**Description:**  
A container class for grouping and managing multiple `DrawableObject` instances, handling their rendering and updates.

**Properties:**

- `_objects`: *DrawableObject[]* - An array of child objects.

**Methods:**

- `addObject(object: DrawableObject): boolean`  
  Adds a child object if it can be a sub-object, sorting by `zIndex`. Returns `true` on success.

- `removeObject(object: DrawableObject): boolean`  
  Removes a child object, returning `true` if successful.

- `forEach(callback?: (obj: DrawableObject, index: number) => void): void`  
  Iterates over child objects, executing the callback.

- `protected _draw(ctx: Context): void`  
  Draws all child objects.

- `updateObjects(delta: number): void`  
  Updates all child objects.

- `updatePositionByOffset(point: ISimplePoint): void`  
  Does nothing by default.

- `protected _update(delta: number): void`  
  Calls `updateObjects`.

- `update(delta: number): void`  
  Calls `_update`.

- `updateZIndex(): void`  
  Sorts child objects by `zIndex` using merge sort.

- `isObjectInViewport(camera: Camera): boolean`  
  Always returns `true`.

- `get factRect`: [ISimpleRect](#isimplerect)  
  Returns a default 1x1 rectangle at (0,0).

---

### GameScene

> *Extends [GameObject](#gameobject)*

**Description:**  
Represents a game scene, managing a collection of `GameObject` instances within the `GameWorld`.

**Getters/Setters:**

- `get canBeSubObject`: *boolean* - Returns `false`.

**Methods:**

- `init(world: GameWorld): void`  
  Initializes the scene and its children when added to the `GameWorld`.

---

### GameWorld

> *Extends [CustomObject](#customobject)*

**Description:**  
The core class for managing the game, including the canvas, camera, input, and scenes.

**Properties:**

- `downKeyboardManager`: [KeyboardManager](#keyboardmanager) - Handles keydown events.
- `upKeyboardManager`: [KeyboardManager](#keyboardmanager) - Handles keyup events.
- `keyStateManager`: [KeyStateManager](#keystatemanager) - Tracks key states.
- `pointerManager`: [PointerInputManager](#pointerinputmanager) - Manages pointer input.
- `isUseCulling`: *boolean* - Enables/disables culling.

**Getters/Setters:**

- `get zIndex`: *number* - Returns 1.
- `get inheritOpacity`: *number* - Returns the canvas context’s global alpha.
- `get canvasManager`: [CanvasManager](#canvasmanager) - Returns the canvas manager.
- `set/get camera`: [Camera](#camera) - Sets or gets the camera.

**Methods:**

- `static createGameLoop(callback: (delta: number, lastDelta: number, prevTime: number) => void): number`  
  Starts the game loop, returning the animation frame ID.

- `constructor({ root, camera, size, useCulling }?: IGameWorldBuilder)`  
  Initializes the game world with optional parameters.

- `addScene(key: string, scene: GameScene): void`  
  Adds a scene with a key.

- `removeScene(key: string): void`  
  Removes a scene by key.

- `setScene(key: string): void`  
  Sets the active scene.

- `getScene(): GameScene | null`  
  Returns the current scene.

- `addControls(): void`  
  Sets up input event listeners.

- `start(): void`  
  Begins the game loop and input handling.

---

### Point

> *Extends [DrawableObject](#drawableobject)*

**Description:**  
Represents a 2D point that can be rendered on the canvas.

**Properties:**

- **Static:**
  - `drawRadius`: *number* - Radius for drawing the point (default: 3).

- **Instance:**
  - `_x`, `_y`: *number* - Coordinates.

**Getters/Setters:**

- `set/get x`, `y`: *number* - Coordinates.
- `set/get point`: [ISimplePoint](#isimplepoint) - Sets or gets the position.
- `get factRect`: [ISimpleRect](#isimplerect) - Returns a 1x1 rectangle at the point.

**Methods:**

- `static get NaN(): Point`  
  Returns a point with NaN coordinates.

- `static fromSimplePoint({ x, y }: ISimplePoint): Point`  
  Creates a point from coordinates.

- `updatePositionByOffset({ x, y }: ISimplePoint): void`  
  Adjusts position by offset.

- `setPosition(x?: number, y?: number): void`  
  Sets coordinates, defaulting to 0.

- `addPosition(x: number, y: number): void`  
  Adds to the current position.

- `move({ x, y }: ISimplePoint, delta: number): void`  
  Moves by a scaled vector.

- `drawPoint(ctx: Context): void`  
  Draws the point as concentric circles.

- `protected _draw(ctx: Context): void`  
  Calls `drawPoint`.

- `isObjectInViewport(camera: Camera): boolean`  
  Checks if the point is in the viewport.

---

### Shape

> *Abstract, Extends [Point](#point)*

**Description:**  
An abstract class for 2D shapes, providing positioning, sizing, rotation, and collision detection.

**Properties:**

- `_size`: [Size](#size) - Shape dimensions.
- `_angle`: [Angle](#angle) - Rotation angle.
- `_flipDirection`: [Point](#point) - Flip factors.

**Getters/Setters:**

- `get bottom`, `right`: *number* - Bounding box edges.
- `set/get size`: [ISimpleSize](#isimplesize) - Shape size.
- `set/get center`: [ISimplePoint](#isimplepoint) - Shape center.
- `set/get angle`: [Angle](#angle) - Rotation angle.

**Methods:**

- `flip(x: boolean, y: boolean): void`  
  Flips the shape horizontally and/or vertically.

- `getCorners(): Point[]`  
  Returns the shape’s corners.

- `getBox(): ISimpleRect`  
  Returns the bounding box.

- `getPath(): Path2D`  
  Returns the shape’s Path2D.

- `needUpdate(value?: boolean | null): void`  
  Marks cached values for update.

- `isObjectInViewport(camera: Camera): boolean`  
  Checks viewport intersection.

- `setPosition(x?: number, y?: number): void`  
  Sets position and updates cache.

- `setSize(width?: number, height?: number): void`  
  Sets size and updates cache.

- `setAngle(angle: Angle): void`  
  Sets angle and updates cache.

- `addAngle(angle: Angle): void`  
  Adds to the angle and updates cache.

- `stroke(ctx: Context, color?: Color): void`  
  Strokes the shape’s outline.

- `fill(ctx: Context, color?: Color): void`  
  Fills the shape.

- `clip(ctx: Context, callback: (path: Path2D) => void): void`  
  Clips the context to the shape.

- `drawOutline(ctx: Context, color?: Color): void`  
  Draws the outline.

- `protected _draw(ctx: Context): void`  
  Fills the shape by default.

- `isPointInBoundingBox(point: Point): boolean`  
  Checks if a point is in the bounding box.

- `isBoxesIntersects(other: ISimpleRect): boolean`  
  Checks box intersection.

- `isPointInShape(point: Point): boolean`  
  Checks if a point is inside the shape.

- `drawTransformed(ctx: Context, cb: (x: number, y: number, width: number, height: number) => void): void`  
  Applies transformations and executes the callback.

---

### Rectangle

> *Extends [Shape](#shape)*

**Description:**  
A rectangular shape with rotation support.

**Getters/Setters:**

- `set/get rect`: [ISimpleRect](#isimplerect) - Position and size.
- `set/get rotatedRectangle`: [Rectangle](#rectangle) - Rotated rectangle.

**Methods:**

- `protected _updateCorners(): Point[]`  
  Calculates rotated corners.

- `static from(position: ISimplePoint, size: ISimpleSize): Rectangle`  
  Creates from position and size.

- `static fromSimpleRectangle(rect: ISimpleRect): Rectangle`  
  Creates from a simple rectangle.

- `static fromPoints(first: Point, second: Point): Rectangle`  
  Creates from two points.

---

### Circle

> *Extends [Shape](#shape)*

**Description:**  
A circular shape with radius-based properties.

**Properties:**

- `_radius`: *number* - Circle radius.

**Getters/Setters:**

- `set/get radius`: *number* - Circle radius.

**Methods:**

- `protected _updateCorners(): Point[]`  
  Approximates corners for collision.

- `protected _updateBox(): ISimpleRect`  
  Returns the bounding box.

- `protected _updatePath(): Path2D`  
  Creates a circular Path2D.

- `isPointInShape(point: Point): boolean`  
  Uses distance to check point inclusion.

- `setRadius(radius?: number): void`  
  Sets radius and updates size.

- `setSize(width?: number, height?: number): void`  
  Adjusts radius based on size.

---

### Triangle

> *Extends [Shape](#shape)*

**Description:**  
A triangular shape with three vertices.

**Methods:**

- `protected _updateCorners(): Point[]`  
  Calculates the triangle’s corners.

---

### ShapeableObject

> *Extends [DrawableObject](#drawableobject)*

**Description:**  
Combines `DrawableObject` with a `Shape` for rendering and interaction.

**Properties:**

- `_shape`: [Shape](#shape) - The associated shape.

**Getters/Setters:**

- `set/get shape`: [Shape](#shape) - The shape.
- Delegates `point`, `x`, `y`, etc., to the shape.

**Methods:**

- `setShape(shape: Shape): void`  
  Sets the shape.

- `setAngle(angle: Angle): void`  
  Sets the shape’s angle.

- `addAngle(angle: Angle): void`  
  Adds to the shape’s angle.

- `isPointInShape(point: Point): boolean`  
  Checks point inclusion.

- `protected _draw(ctx: Context): void`  
  Draws the shape.

- `update(delta: number): void`  
  Updates the shape.

- `isObjectInViewport(camera: Camera): boolean`  
  Delegates to the shape.

---

### PointerableObject

> *Extends [ShapeableObject](#shapeableobject)*

**Description:**  
Adds pointer interaction to `ShapeableObject`.

**Properties:**

- `isPressed`: *boolean* - Indicates if the object is pressed.

**Methods:**

- `doWhenDown(cb: PointerCallback): void`  
  Sets the down callback.

- `doWhenUp(cb: PointerCallback): void`  
  Sets the up callback.

- `doWhenPressed(cb: PointerCallback): void`  
  Sets the pressed callback.

- `doWhenHover(cb: PointerCallback): void`  
  Sets the hover callback.

- `doIfNotAnyInteracted(cb: PointerCallback): void`  
  Sets the non-interaction callback.

- `drawOutline(ctx: Context, color?: Color): void`  
  Draws the outline, red when pressed.

---

### CanvasImage

> *Extends [ShapeableObject](#shapeableobject)*

**Description:**  
Renders an image on the canvas with clipping and transformations.

**Properties:**

- `_image`: *HTMLImageElement | null* - The image.
- `_isLoaded`: *boolean* - Indicates if the image is loaded.

**Methods:**

- `setImage(image: HTMLImageElement): void`  
  Sets the image.

- `loadImage(src: string): void`  
  Loads an image from a URL.

- `isLoaded(): boolean`  
  Checks if the image is loaded.

- `cutImage(x: number, y: number, width: number, height: number): void`  
  Sets a clipping rectangle.

- `protected _draw(ctx: Context): void`  
  Draws the image with transformations.

---

### Camera

> *Extends [CustomObject](#customobject)*

**Description:**  
Manages the game’s view with translation, scaling, and rotation.

**Properties:**

- `_ctx`: *Context | null* - Canvas context.
- `_zoom`: *number* - Zoom level.
- `_position`: [Point](#point) - Camera position.
- `_angle`: [Angle](#angle) - Rotation angle.

**Getters/Setters:**

- `set/get zoom`: *number* - Zoom level.
- `set/get point`: [PointType](#pointtype) - Position.
- `get viewport`: [Rectangle](#rectangle) - Visible area.

**Methods:**

- `static addStandardWheelListener(camera: Camera): boolean`  
  Adds zoom/pan listeners.

- `setSmoothFactor(factor: number): void`  
  Sets smoothing factor.

- `setSmoothing(enabled: boolean, quality: SmoothingQuality): void`  
  Configures image smoothing.

- `updatePosition(): void`  
  Updates position toward the target.

- `setPosition(x?: number, y?: number): void`  
  Sets target position.

- `addPosition(x: number, y: number): void`  
  Adds to target position.

- `move(point: ISimplePoint, delta: number): void`  
  Moves target position.

- `begin(): void`  
  Saves context state.

- `translate(): void`  
  Applies translation.

- `scale(): void`  
  Applies scaling.

- `rotate(): void`  
  Applies rotation.

- `end(): void`  
  Restores context state.

- `update(callback: (ctx: Context) => void): void`  
  Applies transformations and renders.

---

### FollowedCamera

> *Extends [Camera](#camera)*

**Description:**  
A camera that tracks a specific object.

**Properties:**

- `_followedObject`: [FollowedCameraObject](#followedcameraobject) - Object to follow.

**Methods:**

- `setFollowedObject(obj: FollowedCameraObject): void`  
  Sets the object to follow.

- `updatePosition(): void`  
  Centers on the followed object.

- `update(callback: (ctx: Context) => void): void`  
  Updates with parent logic.

---

### GameEntity

> *Extends [GameObject](#gameobject)*

**Description:**  
A positioned `GameObject` that updates child positions.

**Properties:**

- `_position`: [Point](#point) - Entity position.
- `_factRect`: [CachedValue](#cachedvalue)<[ISimpleRect](#isimplerect)> - Bounding rectangle.

**Getters/Setters:**

- `set/get point`: [PointType](#pointtype) - Position.
- `get factRect`: [ISimpleRect](#isimplerect) - Bounding rectangle.

**Methods:**

- `addObject(object: DrawablePointerable): boolean`  
  Adds a child and sets its offset.

- `removeObject(object: DrawablePointerable): boolean`  
  Removes a child and resets its offset.

- `updateObjectsPosition(): void`  
  Updates child positions.

- `protected _updateFactRect(): ISimpleRect`  
  Calculates the bounding rectangle.

- `isObjectInViewport(camera: Camera): boolean`  
  Checks viewport intersection.

- `updatePositionByOffset({ x, y }: ISimplePoint): void`  
  Updates position with offset.

- `update(delta: number): void`  
  Updates entity and children.

---

## Utility Classes

### Angle

> *Extends [CustomObject](#customobject)*

**Description:**  
Represents and manipulates angles in radians or degrees.

**Properties:**

- **Static:**
  - `Pi`: *number* - π.
  - `Pi2`: *number* - 2π.
  - `Rad_1`: *number* - Radians per degree.

- **Instance:**
  - `_radians`: *number* - Angle in radians.

**Getters/Setters:**

- `set/get radians`: *number* - Angle in radians, normalized to [0, 2π).
- `set/get degrees`: *number* - Angle in degrees.

**Methods:**

- `static degToRad(deg: number): number`  
  Converts degrees to radians.

- `static radToDeg(rad: number): number`  
  Converts radians to degrees.

- `static from(rad: number): Angle`  
  Creates from radians.

- `static fromRadians(rad: number): Angle`  
  Alias for `from`.

- `static fromDegrees(deg: number): Angle`  
  Creates from degrees.

- `setAngle(angle: Angle): void`  
  Sets the angle.

- `addAngle(angle: Angle): void`  
  Adds another angle.

- `valueOf(): number`  
  Returns radians.

- `toString(): string`  
  Returns degrees as a string.

---

### AssetsManager

> *Extends [CustomObject](#customobject)*

**Description:**  
A singleton for loading and caching assets.

**Properties:**

- **Static:**
  - `instance`: [AssetsManager](#assetsmanager) - Singleton instance.

- **Instance:**
  - `_cachedImages`, `_cachedTexts`, `_cachedJSON`: *Map* - Asset caches.

**Methods:**

- `loadTextFile(src: string): Promise<string>`  
  Loads and caches a text file.

- `loadJSONFile(src: string): Promise<Record<string, any>>`  
  Loads and caches a JSON file.

---

### Bounds

> *Extends [CustomObject](#customobject)*

**Description:**  
Defines a range for clamping values.

**Properties:**

- `min`, `max`: *number* - Range bounds.

**Methods:**

- `set(min: number, max: number): void`  
  Sets the bounds.

- `get(value: number): number`  
  Clamps the value within bounds.

- `simplify(): IMinMax`  
  Returns `{ min, max }`.

---

### CachedValue

> *Extends [CustomObject](#customobject)*

**Description:**  
Caches a value for lazy updates.

**Properties:**

- `_cachedValue`: *T* - Cached value.
- `_isNeedUpdate`: *boolean* - Update flag.
- `_updateCallback`: *() => T* - Update function.

**Methods:**

- `constructor(defaultValue: T)`  
  Initializes with a default value.

- `needUpdate(value?: boolean | null): void`  
  Sets the update flag.

- `setUpdateCallback(callback?: () => T): void`  
  Sets the update callback.

- `get(): T`  
  Returns the cached value, updating if needed.

- `update(): T`  
  Forces an update.

---

### Color

> *Extends [CustomObject](#customobject)*

**Description:**  
Represents an RGBA color.

**Properties:**

- **Static:**
  - `componentBounds`: [Bounds](#bounds) - Clamps components to [0, 255].

- **Instance:**
  - `_r`, `_g`, `_b`: *number* - RGB components.
  - `_a`: *number* - Alpha (0-1).

**Methods:**

- `setRGBA(r: number, g: number, b: number, a?: number): this`  
  Sets color components.

- `toString(): string`  
  Returns an RGBA string.

- `simplify(): { r: number, g: number, b: number, a: number }`  
  Returns color components.

- `static from(r: number, g: number, b: number, a?: number): Color`  
  Creates a color.

- `static random(a?: number): Color`  
  Creates a random color.

- `static get Black`, `White`, `Red`, `Blue`, `Green`: *Color*  
  Predefined colors.

---

### MathUtils

**Description:**  
Provides mathematical utilities.

**Methods:**

- `static lerp(value: number, target: number, factor: number): number`  
  Linear interpolation.

- `static floor(x: number, afterDot?: number): number`  
  Floors a number.

- `static ceil(x: number, afterDot?: number): number`  
  Ceils a number.

- `static round(x: number, afterDot?: number): number`  
  Rounds a number.

- `static updateWithAfterDotNumber(x: number, afterDot: number, callback: (power: number) => number): number`  
  Applies a function with decimal precision.

- `static percents(value: number, { min, max }?: IMinMax): number`  
  Calculates a percentage.

- `static getArrayValueByCondition<T>(array: T[], conditionCallback: (value: number, last: number) => boolean, valueCallback?: (value: T) => number): T | null`  
  Finds an array value by condition.

- `static min<T>(values: T[], valueCallback?: (value: T) => number): T | null`  
  Finds the minimum value.

- `static max<T>(values: T[], valueCallback?: (value: T) => number): T | null`  
  Finds the maximum value.

---

### Random

**Description:**  
Generates random values.

**Methods:**

- `static number(max: number, afterDot?: number): number`  
  Random number up to `max`.

- `static range(min: number, max: number, afterDot?: number): number`  
  Random number in a range.

- `static chance(value: number, max: number): boolean`  
  Random boolean based on probability.

- `static array(count: number, { min, max }?: IMinMax, afterDot?: number): number[]`  
  Array of random numbers.

---

### Size

> *Extends [CustomObject](#customobject)*

**Description:**  
Represents width and height.

**Properties:**

- `width`, `height`: *number* - Dimensions.

**Getters/Setters:**

- `set/get size`: [ISimpleSize](#isimplesize) - Width and height.
- `set center`: Warns it’s not settable.
- `get center`: [PointType](#pointtype) - Center point.

**Methods:**

- `setSize(width?: number, height?: number): void`  
  Sets dimensions.

---

### SimpleRect

> *Extends [CustomObject](#customobject)*

**Description:**  
A simple rectangle with position and size.

**Properties:**

- `x`, `y`, `width`, `height`: *number* - Rectangle parameters.

---

### Search

**Description:**  
Provides search algorithms.

**Methods:**

- `static binary<T>(arr: T[], target: T, callback?: SearchCallback<T>): number`  
  Binary search.

- `static findInsertPosition<T>(arr: T[], value: T, callback?: SearchCallback<T>): number`  
  Finds insertion position.

- `static linear<T>(arr: T[], target: number, callback?: SearchCallback<T>): number`  
  Linear search.

---

### Sorting

**Description:**  
Provides sorting utilities.

**Methods:**

- `static addToArray<T>(arr: T[], value: T, callback?: SearchCallback<T>): number`  
  Adds to a sorted array.

- `static merge<T>(arr: T[], callback?: SearchCallback<T>): T[]`  
  Merge sort.

- `static quick<T>(arr: T[], callback?: (value: T) => number): T[]`  
  Quicksort.

---

### VectorUtils

**Description:**  
2D vector operations.

**Methods:**

- `static getAngle({ x, y }: ISimplePoint, { x: x1, y: y1 }: ISimplePoint): Angle`  
  Angle between points.

- `static getDoubleDistance({ x, y }: ISimplePoint, { x: x1, y: y1 }: ISimplePoint): number`  
  Squared distance.

- `static getDistance(first: ISimplePoint, second: ISimplePoint): number`  
  Distance.

- `static isInDistance(first: ISimplePoint, second: ISimplePoint, maxDistance: number): boolean`  
  Distance check.

- `static magnitude(vector: ISimplePoint): number`  
  Vector magnitude.

- `static cross(first: ISimplePoint, second: ISimplePoint): number`  
  Cross product.

- `static dot(first: ISimplePoint, second: ISimplePoint): number`  
  Dot product.

- `static normalize(point: ISimplePoint): ISimplePoint`  
  Normalizes a vector.

- `static plus(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Adds points.

- `static minus(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Subtracts points.

- `static multiply(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Multiplies points.

- `static div(first: ISimplePoint, second: ISimplePoint): ISimplePoint`  
  Divides points.

- `static negative({ x, y }: ISimplePoint): ISimplePoint`  
  Negates a point.

- `static multiplyOnNumber({ x, y }: ISimplePoint, num: number): ISimplePoint`  
  Scalar multiplication.

---

### CanvasManager

> *Extends [CustomObject](#customobject)*

**Description:**  
Manages the canvas and context.

**Properties:**

- `_canvas`: *Canvas | null* - Canvas element.
- `_ctx`: *Context | null* - 2D context.

**Methods:**

- `get canvas`: *Canvas | null* - Returns the canvas.
- `get ctx`: *Context | null* - Returns the context.
- `setCanvas(canvas: Canvas): void`  
  Sets the canvas.

- `getContext(): Context | null`  
  Gets or creates the context.

- `resize({ width, height }: ISimpleSize): void`  
  Resizes the canvas.

- `resizeToClientRect(): void`  
  Resizes to client rectangle.

- `create({ root, size }?: { root?: HTMLElement, size?: ISimpleSize | null }): Canvas`  
  Creates a canvas.

- `clear({ x, y }?: ISimplePoint): void`  
  Clears the canvas.

- `addStandardResizeHandler(): void`  
  Adds resize listener.

---

### KeyboardManager

> *Extends [EventEmitter](#eventemitter)<KeyboardEvent>*

**Description:**  
Manages keyboard input.

**Properties:**

- **Static:**
  - `defaultOptions`: [IKeyOptions](#ikeyoptions) - Default key options.

**Methods:**

- `static stringify(key: string, options?: IKeyOptions): string`  
  Creates a key string with modifiers.

- `static from(event: KeyboardEvent): string`  
  Creates a key string from an event.

- `addKey(key: KeyCodes, callback: KeyboardEventCallback, options?: IKeyOptions): void`  
  Adds a key callback.

- `addKeys(keys: KeyCodes[], callback: KeyboardEventCallback, options?: IKeyOptions): void`  
  Adds callbacks for multiple keys.

- `removeKey(key: string, callback: KeyboardEventCallback, options?: IKeyOptions): boolean`  
  Removes a key callback.

- `onceKey(key: KeyCodes, callback: EventCallback<KeyboardEvent>, options?: IKeyOptions): void`  
  Adds a one-time callback.

- `anyKey(callback: KeyboardEventCallback, options?: IKeyOptions): void`  
  Handles any key press.

- `allKey(callback: KeyboardEventCallback): void`  
  Handles all key events.

- `addControls(key: 'keydown' | 'keyup'): void`  
  Adds key event listeners.

---

### KeyStateManager

> *Extends [CustomObject](#customobject)*

**Description:**  
Tracks key states.

**Properties:**

- `downKeyboardManager`, `upKeyboardManager`: [KeyboardManager](#keyboardmanager) | null - Key event managers.

**Methods:**

- `setKey(key: KeyCodes, options?: IKeyOptions): void`  
  Sets the key to track.

- `setManager(down: KeyboardManager, up: KeyboardManager): void`  
  Sets managers.

- `addKeyStateHandler(downCallback: KeyboardEventCallback, upCallback: KeyboardEventCallback): void`  
  Adds state handlers.

- `removeKeyStateHandler(downCallback?: KeyboardEventCallback, upCallback?: KeyboardEventCallback): void`  
  Removes handlers.

---

### PointerInputManager

> *Extends [CustomObject](#customobject)*

**Description:**  
Manages pointer input.

**Properties:**

- `_pointersLocation`: *Point[]* - Pointer positions.
- `_cursorPosition`: [Point](#point) - Cursor position.
- `_pointerables`: *PointerableObject[]* - Managed objects.
- `_camera`: [Camera](#camera) | null - Associated camera.

**Methods:**

- `setCamera(camera: Camera): void`  
  Sets the camera.

- `getCursorPosition(): Point`  
  Returns the cursor position.

- `addPointerable(obj: PointerableObject): void`  
  Adds a pointerable object.

- `removePointerable(obj: PointerableObject): void`  
  Removes a pointerable object.

- `addControls(canvas: Canvas): void`  
  Adds pointer event listeners.

- `updateZIndex(): void`  
  Sorts pointerables by `zIndex`.

- `update(): void`  
  Updates pointer interactions.

---

### LocalStorageManager

> *Extends [EventEmitter](#eventemitter)<[StorageEvent](#storageevent)<T>, [LocalStorageEmitKeys](#localstorageemitkeys)>*

**Description:**  
Manages local storage with events.

**Methods:**

- `set<K extends keyof T>(key: K, value: T[K]): void`  
  Sets a value and emits a `set` event.

- `get<K extends keyof T>(key: K, defaultValue?: T[K] | null): T[K] | null`  
  Gets a value or default.

- `getAll(): Partial<T>`  
  Returns all stored values.

- `emitDefault(key: string): void`  
  Emits a default event.

---

## Interfaces

### IAngle

**Properties:**

- `radians`: *number* - Angle in radians.

---

### IAngleable

**Methods:**

- `setAngle(angle: Angle): void`
- `addAngle(angle: Angle): void`

---

### IMinMax

**Properties:**

- `min`, `max`: *number*

---

### ISimplePoint

**Properties:**

- `x`, `y`: *number*

---

### IPointerable

**Properties:**

- `point`: [PointType](#pointtype)
- `x`, `y`: *number*

**Methods:**

- `setPosition(x?: number, y?: number): void`
- `addPosition(x: number, y: number): void`
- `move(point: ISimplePoint, delta: number): void`

---

### IRoot

**Properties:**

- `inheritOpacity`, `zIndex`: *number*

---

### ISimpleSize

**Properties:**

- `width`, `height`: *number*

---

### ISizeable

**Properties:**

- `center`: [PointType](#pointtype)
- `size`: [ISimpleSize](#isimplesize)

**Methods:**

- `setSize(width?: number, height?: number): void`

---

### IRectangle

**Extends:** [ISizeable](#isizeable), [IPointerable](#ipointerable)

**Properties:**

- `bottom`, `right`: *number*

---

### ISimpleRect

**Extends:** [ISimplePoint](#isimplepoint), [ISimpleSize](#isimplesize)

---

### ISimpleDrawableObject

**Properties:**

- `color`: *{ r: number, g: number, b: number, a: number }*
- `lineWidth`, `opacity`, `zIndex`: *number*

---

### ISimpleCamera

**Properties:**

- `zoom`, `x`, `y`: *number*
- `zoomLimit`: [IMinMax](#iminmax)

---

### ISimpleShape

**Properties:**

- `size`: [ISimpleSize](#isimplesize)
- `angle`: [IAngle](#iangle)

---

### IGameWorldBuilder

**Properties:**

- `root?`: *HTMLElement*
- `camera?`: [Camera](#camera)
- `size?`: [ISimpleSize](#isimplesize) | null
- `useCulling?`: *boolean*

---

### IKeyOptions

**Properties:**

- `altKey?`, `ctrlKey?`, `metaKey?`, `shiftKey?`: *boolean*

---

### IShapeConfig

**Methods:**

- `setShape(shape: Shape): void`
- `set shape(shape: Shape)`
- `get shape(): Shape`

---

### IManager

**Methods:**

- `updateZIndex(): void`

---

### IEventOptions

**Properties:**

- `isOnce?`: *boolean*

---

### IControlManager

**Methods:**

- `addControls(key: string): void`

---

## Event Classes

### ValueEvent

> *Extends Event*

**Description:**  
A custom event with a value.

**Properties:**

- `value`: *any* - Event value.

---

### StorageEvent

> *Extends Event*

**Description:**  
An event for storage operations.

**Properties:**

- `key?`: *keyof T* - Storage key.
- `value?`: *T[keyof T]* - Storage value.

---

This documentation provides a complete reference for the Rul2D library, ensuring developers have all necessary information to utilize its features effectively. Each section is detailed with properties, methods, and examples where applicable, following the structure inspired by `ru.md` and enriched with data from `index.mjs` and `index.d.ts`.