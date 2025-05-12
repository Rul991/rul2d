# Rul2d V2

> **`Rul2d`** is a powerful and flexible TypeScript library for creating games using HTML5 Canvas.
> 
> It provides tools for rendering graphical objects, managing scenes, animations, handling input events (mouse and keyboard).

**To install, enter:**

```shell
npm i rul2d
```

**Template:**

```typescript
import { GameEntity, GameScene, GameWorld, Context } from 'rul2d'

class NewEntity extends GameEntity {
    constructor (x?: number, y?: number) {
        super(x, y)
    }

    protected _init(world: GameWorld): void {
        super._init(world)
    }

    protected async _preload(world: GameWorld): Promise<void> {
        await super._preload(world)
    }

    protected _create(world: GameWorld): DrawableObject[] {
        return [
            ...super._create(world)
        ]
    }

    protected _draw(ctx: Context): void {
        super._draw(ctx)
    }

    protected _update(delta: number): void {
        super._update(delta)
    }
}

class NewScene extends GameScene {
    public test: NewEntity

    constructor () {
        super()
        this.test = new NewEntity()
        this.addObject(this.test)
    }
}

const world = new GameWorld()
world.addScene('new', new NewScene())
world.start()
```

**Example:**

```typescript
import { Camera, Color, Context, DrawMode, GameEntity, GameScene, GameWorld, Point, Rectangle, Size, VectorUtils } from 'rul2d'

class TestEntity extends GameEntity {
    private rectangle: Rectangle
    private direction: Point
    private speed: number
    private camera: Camera
    private size: Size

    constructor (x?: number, y?: number) {
        super(x, y)

        this.direction = new Point(1)
        this.speed = 200
        this.size = new Size()
        this.camera = new Camera()
        this.rectangle = new Rectangle()
    }

    protected _init({camera}: GameWorld): void {
        this.camera = camera
    }

    protected _create(world: GameWorld): DrawableObject[] {
        this.rectangle.setPosition(1000, 500)
        this.rectangle.setSize(100)
        this.rectangle.setColor(Color.Black)
        this.rectangle.setDrawMode(DrawMode.Fill)

        return [
            this.rectangle
        ]
    }

    protected _update(delta: number): void {
        let {x, y, bottom, right} = this.camera.viewport
        if(this.rectangle.x <= x || this.rectangle.right >= right) this.direction.x *= -1
        if(this.rectangle.y <= y || this.rectangle.bottom >= bottom) this.direction.y *= -1

        this.move(
            VectorUtils.multiplyOnNumber(this.direction, this.speed), 
            delta
        )
    }
}

class TestScene extends GameScene {
    public test: TestEntity

    constructor () {
        super()
        this.test = new TestEntity()
        this.create()
    }

    create(): void {
        this.addObject(this.test)
    }
}

const world = new GameWorld()
Camera.addStandardWheelListener(world.camera)
world.addScene('test', new TestScene())
world.start()
world.log()
```

## Links

- **`Documentation`**:
  - English: [*click*](docs/en.md)
  - Русская: [*click*](docs/ru.md)

- **`Examples`**: [*click*](examples/)
- **`Changelog`**: [*click*](CHANGELOG.md)