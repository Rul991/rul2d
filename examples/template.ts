import { GameEntity, GameScene, GameWorld, Context } from 'rul2d'

class NewEntity extends GameEntity {
    constructor (x?: number, y?: number) {
        super(x, y)
    }

    init(world: GameWorld): void {
        
    }

    protected _draw(ctx: Context): void {
        
    }

    protected _update(delta: number): void {
        
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
world.setScene('new')
world.start()