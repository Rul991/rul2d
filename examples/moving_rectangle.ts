import { Camera, Color, GameEntity, GameScene, GameWorld, Point, Rectangle, Size, Context, VectorUtils } from 'rul2d'

class TestEntity extends GameEntity {
    public rectangle: Rectangle
    public direction: Point
    public speed: number
    public camera: Camera

    public size: Size

    constructor (x?: number, y?: number) {
        super(x, y)

        this.direction = new Point(1)
        this.speed = 200
        this.size = new Size
        this.camera = new Camera

        this.rectangle = new Rectangle()

        this.create()
    }

    init({camera}: GameWorld): void {
        this.camera = camera
    }

    create(): void {
        this.rectangle = new Rectangle(1000, 500, 100)
        this.rectangle.setColor(Color.White)
        this.addObject(this.rectangle)
    }

    protected _draw(ctx: Context): void {
        super._draw(ctx)

        this.rectangle.fill(ctx, Color.Black)
        this.camera.viewport.drawOutline(ctx, Color.Red)
    }

    protected _update(delta: number): void {
        let {x, y, bottom, right} = this.camera.viewport
        if(this.rectangle.x <= x || this.rectangle.right >= right) this.direction.x *= -1
        if(this.rectangle.y <= y || this.rectangle.bottom >= bottom) this.direction.y *= -1

        console.log(x, y, bottom, right)

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