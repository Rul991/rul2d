> **`rul2d`** is a TypeScript-based game engine designed for creating 2D games using HTML5 Canvas. 
> 
> It is structured around an object-oriented and scene-based architecture, enabling developers to build complex game objects by composing them from existing components and other objects. 
> 
> The engine provides a robust framework for rendering graphics, managing scenes, handling animations, and processing user inputs (e.g., mouse and keyboard events). 
> 
> Its modular design makes it suitable for a variety of 2D game projects, from simple demos to more intricate interactive experiences.

## Key Features

- **Object-Oriented Design**: Games are built using entities (`GameEntity`), scenes (`GameScene`), and a world (`GameWorld`) that manages everything.
- **Component Composition**: Entities can include drawable objects (e.g., `Rectangle`, `Circle`) and other components, allowing for reusable and flexible game logic.
- **Scene Management**: Scenes group entities together, providing a way to organize game states or levels.
- **Rendering**: Utilizes HTML5 Canvas for drawing, with support for shapes, sprites, and text.
- **Input Handling**: Includes managers for keyboard (`KeyboardManager`) and pointer (`PointerInputManager`) inputs.
- **Utilities**: Offers tools like `AssetsManager` for loading resources, `SAT` for collision detection, and various math and vector utilities.

## Installation

To use rul2d, install it via npm:

```bash
npm i rul2d
```

## Structure and Usage

The engine revolves around three core classes: `GameEntity`, `GameScene`, and `GameWorld`.

### Core Components

1. **`GameEntity`**
   - Represents individual game objects (e.g., a player, enemy, or platform).
   - Lifecycle methods:
     - `_init`: Initializes the entity with the game world.
     - `_preload`: Loads assets asynchronously (e.g., images, audio).
     - `_create`: Returns an array of `DrawableObject` instances (e.g., shapes) to render.
     - `_draw`: Customizes rendering logic.
     - `_update`: Updates the entity’s state each frame (e.g., movement).

2. **`GameScene`**
   - A collection of entities and UI objects, representing a game state (e.g., a level or menu).
   - Methods like `addObject` and `removeObject` manage the entities within the scene.

3. **`GameWorld`**
   - The top-level manager that oversees scenes, rendering, and the game loop.
   - Initializes a canvas, camera, and managers.
   - Methods:
     - `addScene`: Adds a scene with a key (e.g., `'level1'`).
     - `start`: Begins the game loop, preloading assets and rendering scenes.
     - `setScene`: Switches the active scene.

### Template Example

```typescript
import { GameEntity, GameScene, GameWorld, Context } from 'rul2d'

class NewEntity extends GameEntity {
    constructor(x?: number, y?: number) {
        super(x, y) // Sets initial position
    }

    protected _init(world: GameWorld): void {
        super._init(world)
        // Initialization logic
    }

    protected async _preload(world: GameWorld): Promise<void> {
        await super._preload(world)
        // Load assets if needed
    }

    protected _create(world: GameWorld): DrawableObject[] {
        return [
            ...super._create(world) // Return drawable objects
        ]
    }

    protected _draw(ctx: Context): void {
        super._draw(ctx)
        // Custom drawing if needed
    }

    protected _update(delta: number): void {
        super._update(delta)
        // Update logic (delta is time since last frame)
    }
}

class NewScene extends GameScene {
    public test: NewEntity

    constructor() {
        super()
        this.test = new NewEntity()
        this.addObject(this.test) // Add entity to scene
    }
}

const world = new GameWorld()
world.addScene('new', new NewScene())
world.start() // Starts the game loop
```

### Practical Example

```typescript
import { Camera, Color, Context, DrawMode, GameEntity, GameScene, GameWorld, Point, Rectangle, Size, VectorUtils } from 'rul2d'

class TestEntity extends GameEntity {
    private rectangle: Rectangle
    private direction: Point
    private speed: number
    private camera: Camera
    private size: Size

    constructor(x?: number, y?: number) {
        super(x, y)
        this.direction = new Point(1) // Movement direction
        this.speed = 200 // Pixels per second
        this.size = new Size()
        this.camera = new Camera()
        this.rectangle = new Rectangle()
    }

    protected _init({ camera }: GameWorld): void {
        this.camera = camera // Access world’s camera
    }

    protected _create(world: GameWorld): DrawableObject[] {
        this.rectangle.setPosition(1000, 500) // Initial position
        this.rectangle.setSize(100) // 100x100 square
        this.rectangle.setColor(Color.Black)
        this.rectangle.setDrawMode(DrawMode.Fill) // Filled shape

        return [this.rectangle] // Add rectangle to entity
    }

    protected _update(delta: number): void {
        let { x, y, bottom, right } = this.camera.viewport // Get viewport bounds
        // Reverse direction if hitting edges
        if (this.rectangle.x <= x || this.rectangle.right >= right) this.direction.x *= -1
        if (this.rectangle.y <= y || this.rectangle.bottom >= bottom) this.direction.y *= -1

        // Move entity based on direction, speed, and time delta
        this.move(VectorUtils.multiplyOnNumber(this.direction, this.speed), delta)
    }
}

class TestScene extends GameScene {
    public test: TestEntity

    constructor() {
        super()
        this.test = new TestEntity()
        this.create()
    }

    create(): void {
        this.addObject(this.test) // Add entity to scene
    }
}

const world = new GameWorld()
Camera.addStandardWheelListener(world.camera) // Enable zoom/pan with mouse wheel
world.addScene('test', new TestScene())
world.start()
world.log()
```

## Additional Features

- **Keyboard**: `KeyboardManager` handles key events (e.g., `KeyCodes.W` for “W” key).
- **Pointers**: `PointerInputManager` tracks mouse/touch events, enabling interaction with `PointerableObject` instances.
- **Shapes**: `Circle`, `Triangle`, `RoundedRectangle`, etc., for diverse rendering.
- **Audio**: `BaseAudio` and `PositionedAudio` for sound effects with spatial positioning.
- **Sprites**: `SpriteSheet` and `AnimatedSprite` for animations.
- **Utilities**: `MathUtils`, `VectorUtils`, `LocalStorageManager`, etc., for common tasks.

## Links

- **`Documentation`**:
  - English: [*click*](docs/en.md)
  - Русская: [*click*](docs/ru.md)

- **`Examples`**: [*click*](examples/)
- **`Changelog`**: [*click*](CHANGELOG.md)